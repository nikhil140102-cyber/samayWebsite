"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/components/common/Providers";

function OptionGroup({ label, options, value, onChange }) {
  if (!options?.length) return null;
  return (
    <fieldset className="mt-6">
      <legend className="label">
        {label}: <span className="text-fg">{value}</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`min-w-12 rounded-full border px-4 py-2 text-sm transition ${
              value === o ? "border-accent bg-accent text-white" : "border-line hover:border-accent"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function ProductDetail({ product, checkoutEnabled, priceLabel }) {
  const { add } = useCart();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [qty, setQty] = useState(1);
  const inStock = (product.stock ?? 0) > 0;
  const canBuy = !product.concept && checkoutEnabled && product.purchasable !== false && inStock;
  const images = product.images?.length ? product.images : [];

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-2">
          <AnimatePresence mode="wait">
            {images[img] && (
              <motion.div key={img} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Image src={images[img]} alt={`${product.name} — image ${img + 1}`} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImg(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative h-24 w-20 overflow-hidden rounded-xl border-2 ${i === img ? "border-accent" : "border-transparent"}`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="eyebrow">{product.category}</p>
        <h1 className="display mt-3 text-3xl md:text-[2.6rem]">{product.name}</h1>
        {product.concept ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent">Concept design · not for sale</p>
        ) : (
          <p className="mt-4 display text-3xl">{priceLabel}</p>
        )}
        <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">{product.description}</p>

        {product.concept ? (
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {product.sizes?.length > 0 && (
              <div className="card p-4"><dt className="text-xs uppercase tracking-[0.2em] text-muted">Planned sizes</dt><dd className="mt-1 font-medium">{product.sizes.join(" · ")}</dd></div>
            )}
            {product.colors?.length > 0 && (
              <div className="card p-4"><dt className="text-xs uppercase tracking-[0.2em] text-muted">Colourway</dt><dd className="mt-1 font-medium">{product.colors.join(" · ")}</dd></div>
            )}
          </dl>
        ) : (
          <>
            <OptionGroup label="Size" options={product.sizes} value={size} onChange={setSize} />
            <OptionGroup label="Colour" options={product.colors} value={color} onChange={setColor} />
          </>
        )}

        {canBuy && (
          <div className="mt-8 flex gap-3">
            <label className="sr-only" htmlFor="qty">Quantity</label>
            <select id="qty" className="input !w-24" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
              {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <button
              className="btn btn-primary flex-1"
              onClick={() =>
                add({ slug: product.slug, name: product.name, price: product.price, image: images[0], size, color }, qty)
              }
            >
              <ShoppingBag size={17} /> Add to Cart
            </button>
          </div>
        )}
        {!canBuy && (
          <div className="mt-8 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
            {product.concept
              ? "This is an original concept design created for this tribute site. It isn't an official product and isn't for sale."
              : !inStock
                ? "Currently out of stock."
                : "Online purchase isn't available for this item yet."}
            {product.externalUrl && (
              <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3 w-full">
                Buy from licensed store <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        )}

        <ul className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
          <li className="flex gap-3">
            <Truck size={18} className="shrink-0 text-accent" />
            <span>{product.concept ? "Ships only if it ever becomes an official, licensed product." : product.shipping || "Shipping details are confirmed at checkout."}</span>
          </li>
          {product.licenseNote && (
            <li className="flex gap-3">
              <ShieldCheck size={18} className="shrink-0 text-accent" />
              <span>{product.licenseNote}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
