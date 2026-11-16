import Reveal from "@/components/animations/Reveal";

export default function SectionHeading({ eyebrow, title, intro, align = "left", action }) {
  const center = align === "center";
  return (
    <div className={`mb-8 md:mb-10 flex flex-col gap-6 md:flex-row md:items-end ${center ? "items-center text-center md:flex-col md:items-center" : "md:justify-between"}`}>
      <Reveal className={center ? "max-w-3xl" : "max-w-3xl"}>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="display text-[clamp(1.8rem,3.6vw,3.1rem)]">{title}</h2>
        {intro && <p className="mt-4 text-muted text-base leading-relaxed max-w-2xl mx-auto md:mx-0">{intro}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-14 grain">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent)" }}
      />
      <div className="container-x relative">
        <Reveal>
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="display text-[clamp(2.3rem,5.6vw,4.9rem)]">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-base md:text-lg text-muted leading-relaxed">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
