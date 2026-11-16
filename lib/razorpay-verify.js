import "server-only";
import crypto from "node:crypto";
import { Order, Product } from "@/models";

const safeEqual = (a, b) => {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};

/** Checkout signature: HMAC_SHA256(order_id|payment_id, key_secret) */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

/** Webhook signature: HMAC_SHA256(raw body, webhook secret) */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}

/** Idempotently marks an order paid and decrements stock exactly once. */
export async function markOrderPaid(razorpayOrderId, paymentId, paidAmount) {
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId, status: "created", ...(paidAmount ? { amount: paidAmount } : {}) },
    { $set: { status: "paid", razorpayPaymentId: paymentId, paidAt: new Date() } },
    { new: true }
  );
  if (!order) return Order.findOne({ razorpayOrderId }); // already processed (or amount mismatch)
  await Promise.all(
    order.items.map((i) => Product.updateOne({ slug: i.slug }, { $inc: { stock: -i.quantity } }))
  );
  return order;
}
