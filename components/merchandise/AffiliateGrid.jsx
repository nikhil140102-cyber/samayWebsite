"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Camera, Crown, Gamepad2, Headphones, Lamp, Mic, Sparkles, Sun, Timer } from "lucide-react";

// Explicit map keeps the bundle small (no wildcard icon import).
const ICONS = { BookOpen, Camera, Crown, Gamepad2, Headphones, Lamp, Mic, Sparkles, Sun, Timer };

export default function AffiliateGrid({ products, categories }) {
  const [cat, setCat] = useState("All");
  const present = categories.filter((c) => products.some((p) => p.category === c));
  const shown = cat === "All" ? products : products.filter((p) => p.category === cat);
  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Categories">
        {["All", ...present].map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`relative rounded-full px-4 py-2 text-sm ${cat === c ? "text-white" : "border border-line hover:border-accent"}`}
          >
            {cat === c && <motion.span layoutId="aff-pill" className="absolute inset-0 rounded-full bg-accent" />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => {
          const Icon = ICONS[p.icon] || Sparkles;
          return (
            <motion.article
              layout
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 8) * 0.04 }}
              className="card group flex flex-col p-7 transition duration-500 hover:-translate-y-1 hover:border-accent"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-soft text-accent transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Icon size={28} />
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted">{p.category}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{p.description}</p>
              <a
                href={p.url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="btn btn-ghost mt-auto self-start !mt-6"
              >
                View on Amazon <ArrowUpRight size={15} />
              </a>
            </motion.article>
          );
        })}
      </motion.div>
    </>
  );
}
