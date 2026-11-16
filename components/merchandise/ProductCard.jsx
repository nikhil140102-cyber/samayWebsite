"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCart } from "@/components/common/Providers";
import { inr } from "@/lib/format";

export default function ProductCard({ product, checkoutEnabled }) {
  const { add } = useCart();
  const canBuy = !product.concept && checkoutEnabled && product.purchasable !== false && (product.stock ?? 1) > 0;
  const needsOptions = (product.sizes?.length || 0) > 1 || (product.colors?.length || 0) > 1;

  return (
    <article className="group">
      <Link href={`/merchandise/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-2">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
          )}
          {product.images?.[1] && (
            <Image src={product.images[1]} alt="" fill sizes="25vw" className="object-cover opacity-0 transition duration-700 group-hover:opacity-100" />
          )}
          <span className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-[11px] font-semibold">{product.category}</span>
          {product.concept && (
            <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Concept</span>
          )}
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold leading-snug">
            <Link href={`/merchandise/${product.slug}`} className="hover:text-accent">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">{product.description}</p>
        </div>
        <p className="font-display text-sm font-bold whitespace-nowrap">{product.concept ? <span className="text-muted font-sora text-[11px] uppercase tracking-wider">Not for sale</span> : inr(product.price)}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/merchandise/${product.slug}`} className="btn btn-ghost flex-1 !py-2.5 text-sm">
          {product.concept ? "View Design" : "View Product"}
        </Link>
        {canBuy && !needsOptions ? (
          <button
            className="btn btn-primary !py-2.5 text-sm"
            onClick={() =>
              add({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                size: product.sizes?.[0] || "",
                color: product.colors?.[0] || "",
              })
            }
          >
            <Plus size={15} /> Add to Cart
          </button>
        ) : product.externalUrl ? (
          <a href={product.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary !py-2.5 text-sm">
            Store <ArrowUpRight size={14} />
          </a>
        ) : null}
      </div>
    </article>
  );
}
