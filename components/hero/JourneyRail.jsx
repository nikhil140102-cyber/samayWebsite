"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Horizontal milestone rail that drifts with scroll (GSAP ScrollTrigger scrub). */
export default function JourneyRail({ items }) {
  const wrap = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current.scrollWidth - window.innerWidth + 80;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current.closest("section"),
            pin: wrap.current.closest("section"),
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className="overflow-x-auto lg:overflow-visible [scrollbar-width:none]">
      <ol ref={track} className="flex w-max gap-5 px-[max(1.1rem,calc((100vw-1320px)/2+2.5rem))] pb-4">
        {items.map((m, i) => (
          <li
            key={i}
            className="group relative w-[78vw] max-w-[340px] shrink-0 rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-accent"
          >
            <span className="display text-5xl text-transparent [-webkit-text-stroke:1px_var(--accent)] group-hover:text-accent transition-colors">
              {m.year}
            </span>
            <h3 className="mt-6 font-display text-xl font-bold">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
