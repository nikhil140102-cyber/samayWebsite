"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/common/Providers";
import { inr } from "@/lib/format";

export function CartLines({ editable = true }) {
  const { items, update, remove, lineKey } = useCart();
  return (
    <ul className="divide-y divide-line">
      {items.map((i) => {
        const k = lineKey(i);
        return (
          <li key={k} className="flex gap-4 py-4">
            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
              {i.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2">
                <Link href={`/merchandise/${i.slug}`} className="font-semibold leading-snug hover:text-accent">
                  {i.name}
                </Link>
                <span className="font-semibold">{inr(i.price * i.quantity)}</span>
              </div>
              <p className="text-xs text-muted">{[i.size, i.color].filter(Boolean).join(" · ")}</p>
              {editable && (
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-line">
                    <button className="grid h-8 w-8 place-items-center" onClick={() => update(k, i.quantity - 1)} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm" aria-live="polite">{i.quantity}</span>
                    <button className="grid h-8 w-8 place-items-center" onClick={() => update(k, i.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => remove(k)} className="text-muted hover:text-accent" aria-label={`Remove ${i.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function CartDrawer() {
  const { open, setOpen, items, subtotal } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[71] flex h-full w-full max-w-md flex-col bg-bg shadow-soft border-l border-line"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <p className="font-display text-xl font-bold">Your cart</p>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5">
              {items.length ? (
                <CartLines />
              ) : (
                <div className="grid h-full place-items-center text-center text-muted">
                  <div>
                    <ShoppingBag className="mx-auto mb-3" />
                    <p>Your cart is empty.</p>
                  </div>
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-line p-5">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="font-display font-bold">{inr(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Shipping and taxes are confirmed at checkout.</p>
                <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-primary mt-4 w-full">
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
