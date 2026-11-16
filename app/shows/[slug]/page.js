import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock, Info, MapPin, Ticket } from "lucide-react";
import Reveal from "@/components/animations/Reveal";
import ShowCard, { ShowPoster, statusOf } from "@/components/shows/ShowCard";
import { getShow, getShows, showPhase } from "@/lib/data";
import { districtBookingUrl } from "@/lib/district";
import { inr, formatDate } from "@/lib/format";
import { VERIFIED_AT } from "@/data/shows";

export const revalidate = 600;

export async function generateStaticParams() {
  return (await getShows()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) return { title: "Show not found" };
  return {
    title: `${show.title} — ${show.city}, ${show.venue}`,
    description: `${show.title} at ${show.venue}, ${show.city}. ${show.dateLabel}. Tickets on District.`,
    alternates: { canonical: `/shows/${slug}` },
  };
}

export default async function ShowDetail({ params }) {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) notFound();
  const phase = showPhase(show);
  const st = statusOf(show, phase);
  const bookable = phase !== "past" && !["sold-out", "cancelled"].includes(show.status);
  const others = (await getShows()).filter((s) => s.slug !== slug && showPhase(s) === "upcoming").slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ComedyEvent",
    name: `${show.title} | ${show.city} | ${show.venue}`,
    startDate: show.startDate,
    endDate: show.endDate || show.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: show.venue, address: show.address || show.city },
    performer: { "@type": "Person", name: "Samay Raina" },
    offers: { "@type": "Offer", url: show.districtUrl, ...(show.priceFrom ? { price: show.priceFrom, priceCurrency: "INR" } : {}) },
  };

  const facts = [
    { icon: MapPin, label: "Venue", value: show.venue, sub: show.address },
    { icon: CalendarDays, label: "Dates", value: show.dateLabel },
    show.gatesOpen && { icon: Clock, label: "Gates open", value: show.gatesOpen },
    { icon: Ticket, label: "Tickets", value: typeof show.priceFrom === "number" ? `From ${inr(show.priceFrom)}` : "See District for prices" },
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-x pt-32 md:pt-40">
        <Link href="/shows" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
          <ArrowLeft size={15} /> All shows
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <ShowPoster show={show} className="aspect-[4/5] w-full shadow-soft" />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col">
            <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
            <p className="eyebrow mt-6">{show.tour}</p>
            <h1 className="display mt-3 text-4xl md:text-5xl">
              {show.title}
              <span className="block text-accent">{show.city}</span>
            </h1>
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="card p-5">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                    <f.icon size={14} className="text-accent" /> {f.label}
                  </dt>
                  <dd className="mt-2 font-display text-lg font-semibold leading-snug">{f.value}</dd>
                  {f.sub && <dd className="mt-1 text-sm text-muted">{f.sub}</dd>}
                </div>
              ))}
            </dl>
            {show.notes?.length > 0 && (
              <ul className="mt-6 space-y-2 text-sm text-muted">
                {show.notes.map((n) => (
                  <li key={n} className="flex gap-2">
                    <Info size={15} className="mt-0.5 shrink-0 text-accent" /> {n}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              {bookable ? (
                <a href={districtBookingUrl(show.districtUrl)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-7 !py-4 text-base">
                  <Ticket size={18} /> Book Tickets on District <ArrowUpRight size={16} />
                </a>
              ) : (
                <span className="btn btn-ghost">Booking closed</span>
              )}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.address || `${show.venue} ${show.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <MapPin size={16} /> Directions
              </a>
            </div>
            <p className="mt-6 text-xs text-muted">
              Details checked against the official District listing on {formatDate(VERIFIED_AT)}. Booking, pricing,
              refunds and entry rules are handled by District. This fan site does not sell tickets.
            </p>
          </Reveal>
        </div>
      </section>

      {others.length > 0 && (
        <section className="container-x py-24">
          <p className="eyebrow">More dates</p>
          <h2 className="display mt-3 text-4xl md:text-5xl">Other cities on the tour</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {others.map((s) => (
              <ShowCard key={s.slug} show={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
