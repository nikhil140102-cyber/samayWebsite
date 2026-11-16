export default function Marquee({ items, className = "" }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden border-y border-line py-4 ${className}`} aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 display text-2xl md:text-[2rem] uppercase">
            <span className={i % 2 ? "text-transparent [-webkit-text-stroke:1px_var(--fg)]" : ""}>{t}</span>
            <span className="h-3 w-3 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
