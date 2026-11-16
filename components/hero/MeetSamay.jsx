"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Crown, Mic, MonitorPlay, Trophy } from "lucide-react";

// Every highlight here is sourced on the /about page.
const highlights = [
  { icon: Trophy, label: "Comicstaan 2 co-winner", meta: "2019" },
  { icon: Crown, label: "Took chess streaming mainstream", meta: "2020" },
  { icon: MonitorPlay, label: "Created India's Got Latent", meta: "2024" },
  { icon: Mic, label: "Debut special Still Alive", meta: "2026" },
];

/**
 * "Meet Samay": copy on the left, cinematic stage image on the right.
 * To use a photo of Samay instead, replace /public/images/meet-samay.webp (keep a tall 4:5 crop).
 */
export default function MeetSamay() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.04, 1.12]);

  return (
    <section ref={ref} className="container-x py-20 md:py-24" aria-labelledby="meet-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Meet Samay</p>
          <h2 id="meet-heading" className="display mt-4 text-[clamp(1.9rem,3.6vw,3.1rem)]">
            From open mics to <span className="font-serif font-normal italic text-accent">sold-out arenas.</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted">
            A Jammu-born engineer turned stand-up comedian, Samay Raina built his audience on dark, unfiltered
            humour and chaotic live formats — then turned a pandemic chess stream into a national obsession.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <motion.li
                key={h.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:scale-110">
                  <h.icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-snug">{h.label}</span>
                  <span className="text-xs text-muted">{h.meta}</span>
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-primary">
              Read his story <ArrowRight size={15} />
            </Link>
            <Link href="/shows" className="btn btn-ghost">
              See tour dates
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,var(--accent-soft),transparent)] blur-2xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line shadow-soft">
            <motion.div style={{ y, scale }} className="absolute inset-0">
              <Image
                src="/images/meet-samay.webp"
                alt="A spotlit comedy stage with a vintage microphone and a stool in front of a red curtain"
                fill
                sizes="(min-width:1024px) 42vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
              <div>
                <p className="font-sora text-[10px] uppercase tracking-[0.3em] text-white/70">Now touring</p>
                <p className="mt-1 font-display text-xl font-bold leading-tight">Samay Raina Live</p>
                <p className="text-xs text-white/70">India · Nov 2026 – Apr 2027</p>
              </div>
              <Link
                href="/shows"
                className="glass shrink-0 rounded-full px-4 py-2 text-xs font-semibold !text-white !bg-white/10 !border-white/20 hover:!bg-white/20"
              >
                Tickets →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
