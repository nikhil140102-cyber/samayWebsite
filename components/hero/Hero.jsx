"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, Play, Ticket, Compass } from "lucide-react";
import { useTheme } from "@/components/common/Providers";
import { LINKS } from "@/lib/site";

gsap.registerPlugin(useGSAP);

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

function SplitWords({ text, accentLast = false }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.06em] mr-[0.22em] last:mr-0">
      <span className={`reveal-word ${accentLast && i === words.length - 1 ? "text-accent" : ""}`}>{w}</span>
    </span>
  ));
}

/** Original mascot (chess-pawn comedian), floating with mouse parallax. */
function HeroCharacter({ src = "/images/hero-character.webp", alt = "SR Fan World mascot: a chess-pawn comedian with a microphone", unoptimized = false, photo = false }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 60, damping: 18 });
  const y = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 60, damping: 18 });
  const rotate = useSpring(useTransform(mx, [-1, 1], photo ? [0, 0] : [-4, 4]), { stiffness: 60, damping: 18 });

  useEffect(() => {
    const onMove = (e) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div
      className={`pointer-events-none absolute ${
        photo
          ? "bottom-0 right-[-14%] h-[44%] w-[62%] sm:right-0 sm:h-[54%] md:right-[1%] md:h-[90%] md:w-[46%]"
          : "bottom-[3%] right-[-10%] h-[36%] w-[55%] sm:right-0 sm:h-[48%] md:bottom-[6%] md:right-[4%] md:h-[78%] md:w-[48%]"
      }`}
    >
      {/* stage glow + floor shadow */}
      <div className="absolute left-1/2 top-[38%] h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,46,63,.45),transparent)] blur-2xl" />
      <div className="absolute bottom-[2%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl dark:bg-black/80" />
      <motion.div style={{ x, y, rotate }} className="relative h-full w-full">
        <motion.div
          className="relative h-full w-full"
          animate={{ y: photo ? [0, -6, 0] : [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            unoptimized={unoptimized}
            sizes="(min-width:768px) 45vw, 70vw"
            className="object-contain object-bottom drop-shadow-[0_30px_40px_rgba(0,0,0,.55)]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero({ content }) {
  const root = useRef(null);
  const { isDark } = useTheme();
  const [webgl, setWebgl] = useState(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only API, read after hydration to avoid SSR mismatch
    setWebgl(canUseWebGL());
    const mq = window.matchMedia("(max-width: 767px)");
    setCompact(mq.matches);
    const on = () => setCompact(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(".hero-line", { scaleX: 0, transformOrigin: "left", duration: 1.2 })
          .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 }, "-=0.9")
          .from(".hero-title .reveal-word", { yPercent: 110, rotate: 4, duration: 1.3, stagger: 0.08 }, "-=0.7")
          .from(".hero-sub .reveal-word", { yPercent: 110, duration: 1, stagger: 0.05 }, "-=0.9")
          .from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, "-=0.6")
          .from(".hero-scene", { opacity: 0, scale: 0.92, duration: 1.8 }, 0.2);
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const [first, ...rest] = content.heroHeading.split(" ");
  const titleTail = rest.join(" ");

  return (
    <section ref={root} className="relative min-h-[86svh] overflow-hidden grain" aria-label="Introduction">
      {/* cinematic backdrop */}
      <div aria-hidden className="absolute inset-0">
        <div
          className="absolute -right-40 top-1/4 h-[70vmax] w-[70vmax] rounded-full blur-3xl opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent 70%)" }}
        />
        <div
          className="absolute -left-60 -bottom-60 h-[60vmax] w-[60vmax] rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 60% 40%, black 20%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 60% 40%, black 20%, transparent 70%)",
          }}
        />
        {/* stage spotlight cone */}
        <div
          className="absolute left-[55%] top-0 h-full w-[46vw] -translate-x-1/2 opacity-40 dark:opacity-60"
          style={{
            background: "conic-gradient(from 180deg at 50% 0%, transparent 42%, var(--accent-soft) 50%, transparent 58%)",
          }}
        />
      </div>

      {/* 3D scene or licensed portrait */}
      <div className="hero-scene absolute inset-0 opacity-60 md:opacity-100 md:left-[38%]">
        {webgl && <HeroScene dark={isDark} compact={compact} showMic={false} sidePawn={!content.heroImage} />}
        {content.heroImage ? (
          <HeroCharacter src={content.heroImage} alt="Samay Raina on stage with a microphone" unoptimized={content.heroImage.startsWith("data:")} photo />
        ) : (
          <HeroCharacter />
        )}
      </div>

      <div className="container-x relative z-10 flex min-h-[86svh] flex-col justify-end pb-14 pt-32 md:justify-center md:pb-16">
        <div className="max-w-[min(100%,980px)]">
          <div className="flex items-center gap-4 mb-6">
            <span className="hero-line block h-px w-14 bg-accent" />
            <p className="hero-eyebrow eyebrow">An independent fan tribute</p>
          </div>

          <h1 className="hero-title display text-[clamp(2.5rem,6.2vw,5.9rem)] uppercase">
            <span className="block text-muted/80 text-[0.32em] tracking-[0.12em] font-sora font-semibold mb-2">
              <SplitWords text={first} />
            </span>
            {(() => {
              const w = titleTail.split(" ");
              const cut = Math.ceil(w.length / 2);
              return (
                <>
                  <span className="block"><SplitWords text={w.slice(0, cut).join(" ")} /></span>
                  <span className="block"><SplitWords text={w.slice(cut).join(" ")} accentLast /></span>
                </>
              );
            })()}
          </h1>

          <p className="hero-sub mt-6 font-serif italic text-[clamp(1.1rem,2vw,1.6rem)] leading-tight max-w-3xl">
            <SplitWords text={content.heroSubheading} />
          </p>

          <p className="hero-fade mt-4 max-w-lg text-muted text-[0.98rem] leading-relaxed">{content.heroText}</p>

          <div className="hero-fade mt-9 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-primary">
              <Compass size={17} /> Explore the Journey
            </Link>
            <a href={LINKS.youtube} target="_blank" rel="noopener noreferrer" className="btn btn-ghost glass">
              <Play size={17} /> Watch on YouTube
            </a>
            <Link href="/shows" className="btn btn-ghost glass">
              <Ticket size={17} /> Upcoming Shows
            </Link>
          </div>
        </div>

        {content.heroImage && content.heroImageCredit && (
          <p className="absolute bottom-4 right-6 text-[10px] text-muted">Photo: {content.heroImageCredit}</p>
        )}

        {!content.heroImage && <a
          href="#latest"
          className="hero-fade absolute bottom-8 right-6 md:right-10 hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted hover:text-accent"
        >
          Scroll
          <span className="grid h-10 w-10 place-items-center rounded-full border border-line animate-bounce">
            <ArrowDown size={15} />
          </span>
        </a>}
      </div>
    </section>
  );
}
