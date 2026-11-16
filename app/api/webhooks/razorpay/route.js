// Razorpay webhook → backs up client-side verification (e.g. if the user closes
// the tab after paying). Configure in Razorpay Dashboard → Webhooks with the event
// "payment.captured" and set RAZORPAY_WEBHOOK_SECRET.
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { markOrderPaid, verifyWebhookSignature } from "@/lib/razorpay-verify";
import { fail, json } from "@/lib/http";

export async function POST(request) {
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature"))) {
    return fail("Invalid signature", 401);
  }
  if (!hasDatabase) return fail("No database", 503);
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return fail("Bad JSON");
  }
  if (event.event === "payment.captured") {
    const p = event.payload?.payment?.entity;
    if (p?.order_id) {
      await connectDB();
      await markOrderPaid(p.order_id, p.id, p.amount);
    }
  }
  return json({ ok: true });
}
