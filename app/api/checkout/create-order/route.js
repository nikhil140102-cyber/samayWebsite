import Razorpay from "razorpay";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Order, Product } from "@/models";
import { checkoutEnabled } from "@/lib/payments";
import { fail, json, rateLimit, readJson } from "@/lib/http";

const schema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(100),
        quantity: z.coerce.number().int().min(1).max(10),
        size: z.string().max(20).optional(),
        color: z.string().max(40).optional(),
      })
    )
    .min(1)
    .max(20),
  customer: z.object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email(),
    phone: z.string().trim().regex(/^[0-9+ ]{10,15}$/),
    address: z.string().trim().min(10).max(300),
    pincode: z.string().regex(/^\d{6}$/),
  }),
});

export async function POST(request) {
  if (!checkoutEnabled()) return fail("Checkout is not enabled on this site.", 503);
  if (!rateLimit(request, { key: "checkout", limit: 10, windowMs: 60_000 })) return fail("Too many attempts.", 429);

  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("Please check your cart and delivery details.");
  const { items, customer } = parsed.data;

  try {
    await connectDB();
    // Prices and stock come from the database. The client's numbers are never trusted.
    const products = await Product.find({ slug: { $in: items.map((i) => i.slug) }, published: true, purchasable: true, concept: { $ne: true } }).lean();
    const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
    const lines = [];
    for (const i of items) {
      const p = bySlug[i.slug];
      if (!p) return fail(`"${i.slug}" is no longer available.`, 409);
      if ((p.stock ?? 0) < i.quantity) return fail(`Only ${p.stock} left of ${p.name}.`, 409);
      if (p.sizes?.length && i.size && !p.sizes.includes(i.size)) return fail(`Invalid size for ${p.name}.`);
      if (p.colors?.length && i.color && !p.colors.includes(i.color)) return fail(`Invalid colour for ${p.name}.`);
      lines.push({ productId: String(p._id), slug: p.slug, name: p.name, price: p.price, quantity: i.quantity, size: i.size, color: i.color });
    }
    const subtotal = lines.reduce((n, l) => n + l.price * l.quantity, 0);
    const amount = Math.round(subtotal * 100); // paise

    const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await Order.create({ items: lines, subtotal, amount, currency: "INR", customer, status: "created" });
    const rzpOrder = await rzp.orders.create({ amount, currency: "INR", receipt: String(order._id), notes: { orderId: String(order._id) } });
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    return json({ ok: true, razorpayOrderId: rzpOrder.id, amount, currency: "INR", orderId: String(order._id) });
  } catch (e) {
    console.error("[checkout/create-order]", e);
    return fail("Could not start the payment. Please try again.", 500);
  }
}
