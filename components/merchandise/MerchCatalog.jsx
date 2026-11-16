"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function MerchCatalog({ products, categories, checkoutEnabled }) {
  const [cat, setCat] = useState("All");
  const present = categories.filter((c) => products.some((p) => p.category === c));
  const shown = cat === "All" ? products : products.filter((p) => p.category === cat);
  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
        {["All", ...present].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`relative rounded-full px-4 py-2 text-sm ${cat === c ? "text-white" : "border border-line hover:border-accent"}`}
          >
            {cat === c && <motion.span layoutId="merch-pill" className="absolute inset-0 rounded-full bg-accent" />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      {products.every((p) => p.concept) ? (
        <p className="mb-8 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          <span className="font-semibold text-fg">Concept collection.</span> Original designs made for this tribute,
          inspired by the channel and the shows. They aren&apos;t official products and aren&apos;t for sale.
        </p>
      ) : (
        !checkoutEnabled && (
          <p className="mb-8 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-muted">
            Online checkout is not active yet. Products can be browsed but not purchased.
          </p>
        )
      )}
      <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} checkoutEnabled={checkoutEnabled} />
        ))}
      </div>
    </>
  );
}
