import Razorpay from "razorpay";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { checkoutEnabled } from "@/lib/payments";
import { markOrderPaid, verifyPaymentSignature } from "@/lib/razorpay-verify";
import { fail, json, rateLimit, readJson } from "@/lib/http";

const schema = z.object({
  razorpay_order_id: z.string().min(5).max(64),
  razorpay_payment_id: z.string().min(5).max(64),
  razorpay_signature: z.string().min(10).max(256),
});

export async function POST(request) {
  if (!checkoutEnabled()) return fail("Checkout is not enabled.", 503);
  if (!rateLimit(request, { key: "verify", limit: 20, windowMs: 60_000 })) return fail("Too many attempts.", 429);
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("Invalid payment response.");
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = parsed.data;

  // 1) Cryptographic proof the response came from Razorpay for this order.
  if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
    return fail("Payment signature mismatch. The payment was not verified.", 400);
  }

  try {
    // 2) Ask Razorpay directly that the payment really is captured/authorised for this order and amount.
    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const payment = await rzp.payments.fetch(paymentId);
    if (payment.order_id !== orderId || !["captured", "authorized"].includes(payment.status)) {
      return fail("Payment is not complete.", 402);
    }

    await connectDB();
    const order = await markOrderPaid(orderId, paymentId, payment.amount);
    if (!order) return fail("Order not found.", 404);
    if (order.status !== "paid") return fail("Payment amount did not match the order. Please contact us.", 409);
    return json({ ok: true, orderId: String(order._id) });
  } catch (e) {
    console.error("[checkout/verify]", e);
    return fail("Could not verify the payment right now. If you were charged, contact us with your payment ID.", 500);
  }
}
