"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { useCart } from "@/components/common/Providers";
import { CartLines } from "./CartDrawer";
import { inr } from "@/lib/format";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutClient({ enabled, razorpayKey }) {
  const { items, subtotal, clear, ready } = useCart();
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [orderId, setOrderId] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const customer = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus({ state: "loading", message: "" });
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ slug, quantity, size, color }) => ({ slug, quantity, size, color })),
          customer,
        }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Could not start checkout");

      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load the payment window. Check your connection.");

      const rzp = new window.Razorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "SR Fan World",
        description: "Merchandise order",
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: "#e11d2e" },
        handler: async (resp) => {
          setStatus({ state: "loading", message: "Verifying payment…" });
          const v = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resp),
          });
          const data = await v.json();
          if (v.ok && data.ok) {
            clear();
            setOrderId(data.orderId);
            setStatus({ state: "done", message: "" });
          } else {
            setStatus({ state: "error", message: data.error || "Payment could not be verified. You have not been charged twice. Contact us with your payment ID." });
          }
        },
        modal: { ondismiss: () => setStatus({ state: "idle", message: "" }) },
      });
      rzp.on("payment.failed", (r) => setStatus({ state: "error", message: r.error?.description || "Payment failed." }));
      rzp.open();
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  if (status.state === "done") {
    return (
      <div className="mt-10 max-w-xl rounded-[2rem] border border-line bg-surface p-10">
        <CheckCircle2 className="text-accent" size={36} />
        <h2 className="mt-4 display text-4xl">Payment confirmed.</h2>
        <p className="mt-3 text-muted">
          Your order reference is <span className="font-mono text-fg">{orderId}</span>. A confirmation will follow by email.
        </p>
        <Link href="/merchandise" className="btn btn-ghost mt-6">Continue browsing</Link>
      </div>
    );
  }

  if (!ready) return <div className="skeleton mt-10 h-48 rounded-3xl" />;

  if (!items.length) {
    return (
      <div className="mt-10 rounded-[2rem] border border-dashed border-line p-12 text-center text-muted">
        Your cart is empty. <Link href="/merchandise" className="text-accent underline">Visit the store</Link>.
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="card px-6">
        <CartLines />
      </div>
      <form onSubmit={onSubmit} className="card space-y-4 p-6 md:p-8 h-fit">
        <h2 className="font-display text-2xl font-bold">Delivery details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" className="input" required autoComplete="name" maxLength={80} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" className="input" required autoComplete="tel" pattern="[0-9+ ]{10,15}" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="address">Address</label>
          <textarea id="address" name="address" className="input min-h-24" required autoComplete="street-address" maxLength={300} />
        </div>
        <div>
          <label className="label" htmlFor="pincode">PIN code</label>
          <input id="pincode" name="pincode" className="input" required pattern="[0-9]{6}" inputMode="numeric" autoComplete="postal-code" />
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-lg">
          <span>Subtotal</span>
          <span className="font-display font-bold">{inr(subtotal)}</span>
        </div>
        <p className="text-xs text-muted">Prices are re-checked on our server before payment.</p>
        {status.state === "error" && <p role="alert" className="text-sm text-accent">{status.message}</p>}
        {enabled ? (
          <button className="btn btn-primary w-full" disabled={status.state === "loading"}>
            {status.state === "loading" ? <Loader2 size={17} className="animate-spin" /> : <Lock size={16} />}
            {status.message || "Pay securely with Razorpay"}
          </button>
        ) : (
          <p className="rounded-2xl border border-line bg-surface-2 p-4 text-sm text-muted">
            Online payments are not active on this site yet. No payment will be taken.
          </p>
        )}
      </form>
    </div>
  );
}
