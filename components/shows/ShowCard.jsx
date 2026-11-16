import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Ticket } from "lucide-react";
import { inr } from "@/lib/format";
import { districtBookingUrl } from "@/lib/district";

const STATUS = {
  "on-sale": { label: "On sale on District", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  "sold-out": { label: "Sold out", cls: "bg-zinc-500/15 text-muted" },
  "coming-soon": { label: "Coming soon", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  cancelled: { label: "Cancelled", cls: "bg-zinc-500/15 text-muted" },
  past: { label: "Completed", cls: "bg-zinc-500/15 text-muted" },
};

export function statusOf(show, phase) {
  return phase === "past" ? STATUS.past : STATUS[show.status] || STATUS["on-sale"];
}

/** Poster built from type — no unlicensed imagery. Admin can set `poster` to a licensed image. */
export function ShowPoster({ show, className = "" }) {
  const d = new Date(show.startDate + "T00:00:00+05:30");
  const month = d.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }).toUpperCase();
  const day = d.toLocaleDateString("en-IN", { day: "2-digit", timeZone: "Asia/Kolkata" });
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#0a0a0b] text-white ${className}`}>
      {show.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={show.poster} alt={`${show.title} ${show.city} poster`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 80% 0%, rgba(255,46,63,.55), transparent 55%), radial-gradient(90% 60% at 0% 100%, rgba(255,46,63,.25), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 22px)" }}
          />
          <div className="relative flex h-full flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <span className="font-sora text-[10px] uppercase tracking-[0.3em] text-white/70">Live</span>
              <span className="text-right font-display leading-none">
                <span className="block text-4xl font-bold">{day}</span>
                <span className="text-xs tracking-[0.25em] text-white/70">{month}</span>
              </span>
            </div>
            <div>
              <p className="font-display text-3xl font-bold uppercase leading-[0.9] tracking-tight">
                Samay
                <br />
                Raina <span className="text-[#ff2e3f]">Live</span>
              </p>
              <p className="mt-2 font-sora text-xs uppercase tracking-[0.25em] text-white/80">{show.city}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ShowCard({ show, phase = "upcoming" }) {
  const st = statusOf(show, phase);
  const bookable = phase !== "past" && show.status !== "cancelled" && show.status !== "sold-out";
  return (
    <article className="card group grid overflow-hidden p-3 transition duration-500 hover:-translate-y-1 hover:shadow-soft sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-5">
      <Link href={`/shows/${show.slug}`} aria-label={`Details: ${show.title}, ${show.city}`}>
        <ShowPoster show={show} className="aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[220px]" />
      </Link>
      <div className="flex flex-col p-3 sm:py-4 sm:pl-0 sm:pr-3">
        <span className={`self-start rounded-full px-3 py-1 text-[11px] font-semibold ${st.cls}`}>{st.label}</span>
        <h3 className="mt-3 font-display text-2xl font-bold leading-tight">
          <Link href={`/shows/${show.slug}`} className="hover:text-accent transition-colors">
            {show.title} — {show.city}
          </Link>
        </h3>
        <ul className="mt-3 space-y-1.5 text-sm text-muted">
          <li className="flex gap-2">
            <MapPin size={15} className="mt-0.5 shrink-0 text-accent" /> {show.venue}
          </li>
          <li className="flex gap-2">
            <CalendarDays size={15} className="mt-0.5 shrink-0 text-accent" /> {show.dateLabel}
          </li>
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <p className="text-sm">
            {typeof show.priceFrom === "number" ? (
              <>
                <span className="text-muted">From </span>
                <span className="font-display text-xl font-bold">{inr(show.priceFrom)}</span>
              </>
            ) : (
              <span className="text-muted">Price on District</span>
            )}
          </p>
          <div className="flex gap-2">
            <Link href={`/shows/${show.slug}`} className="btn btn-ghost !py-2.5 !px-4 text-sm">
              Details
            </Link>
            {bookable && (
              <a
                href={districtBookingUrl(show.districtUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary !py-2.5 !px-4 text-sm"
              >
                <Ticket size={15} /> Book Tickets <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
