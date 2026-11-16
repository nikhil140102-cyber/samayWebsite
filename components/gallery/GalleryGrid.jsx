"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";

function Lightbox({ images, index, onClose, onNav }) {
  const img = images[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col bg-black/95 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={img.title}
    >
      <div className="flex items-center justify-between p-4 md:p-6">
        <p className="text-sm text-white/70">
          {index + 1} / {images.length}
        </p>
        <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close" autoFocus>
          <X size={20} />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 md:px-20" onClick={onClose}>
        <AnimatePresence mode="wait">
          <motion.div
            key={img.slug || img.src}
            className="relative h-full max-h-[75vh] w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={img.src} alt={img.title} fill sizes="90vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous image">
              <ChevronLeft />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNav(1); }} className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Next image">
              <ChevronRight />
            </button>
          </>
        )}
      </div>
      <div className="p-4 text-center md:p-6">
        <p className="font-display text-lg font-semibold">{img.title}</p>
        <p className="mt-1 text-xs text-white/60">
          {img.credit}
          {img.sourceUrl && (
            <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 underline">
              Source <ExternalLink size={11} />
            </a>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default function GalleryGrid({ images, filterable = false, categories = [] }) {
  const [active, setActive] = useState(null);
  const [cat, setCat] = useState("All");

  const shown = useMemo(() => (cat === "All" ? images : images.filter((i) => i.category === cat)), [images, cat]);
  const nav = useCallback((d) => setActive((i) => (i + d + shown.length) % shown.length), [shown.length]);

  if (!images?.length) {
    return (
      <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
        No images yet. Licensed photos can be added from the admin dashboard.
      </p>
    );
  }

  const cats = ["All", ...categories];
  return (
    <>
      {filterable && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          {cats.map((c) => {
            const count = c === "All" ? images.length : images.filter((i) => i.category === c).length;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                onClick={() => setCat(c)}
                disabled={count === 0}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors disabled:opacity-40 ${cat === c ? "text-white" : "border border-line hover:border-accent"}`}
              >
                {cat === c && <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-accent" />}
                <span className="relative">
                  {c} <span className="opacity-60">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      <motion.div layout className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {shown.map((img, i) => (
            <motion.figure
              layout
              key={img.slug || img.src}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}
              className="group relative overflow-hidden rounded-2xl bg-surface-2"
            >
              <button onClick={() => setActive(i)} className="block w-full" aria-label={`Open ${img.title}`}>
                <Image
                  src={img.src}
                  alt={img.title}
                  width={img.width || 800}
                  height={img.height || 600}
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="h-auto w-full transition duration-700 group-hover:scale-[1.04]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-white/70">{img.category}</span>
                  <span className="font-display font-semibold">{img.title}</span>
                </figcaption>
              </button>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {active !== null && shown[active] && (
          <Lightbox images={shown} index={active} onClose={() => setActive(null)} onNav={nav} />
        )}
      </AnimatePresence>
    </>
  );
}
