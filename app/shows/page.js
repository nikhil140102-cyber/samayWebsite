import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import ShowsExplorer from "@/components/shows/ShowsExplorer";
import { getShows, showPhase } from "@/lib/data";
import { VERIFIED_AT } from "@/data/shows";
import { LINKS } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const revalidate = 600;

export const metadata = {
  title: "Live Shows & Tickets",
  description:
    "Samay Raina Live — India tour 2026–27 dates, venues and starting prices. Book tickets on District by Zomato.",
  alternates: { canonical: "/shows" },
};

export default async function ShowsPage() {
  const shows = (await getShows()).map((s) => ({ ...s, phase: showPhase(s) }));
  const upcoming = shows.filter((s) => s.phase === "upcoming");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": upcoming.map((s) => ({
      "@type": "ComedyEvent",
      name: `${s.title} | ${s.city} | ${s.venue}`,
      startDate: s.startDate,
      endDate: s.endDate || s.startDate,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: s.venue, address: s.address || s.city },
      performer: { "@type": "Person", name: "Samay Raina" },
      offers: {
        "@type": "Offer",
        url: s.districtUrl,
        ...(typeof s.priceFrom === "number" ? { price: s.priceFrom, priceCurrency: "INR" } : {}),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="Samay Raina Live · India Tour 2026–27"
        title={<>Live &amp; <span className="font-serif italic font-normal text-accent">unfiltered.</span></>}
        intro="His biggest India tour yet runs November 2026 to April 2027. Tickets are sold exclusively on District, and every Book Tickets button takes you to the official listing."
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={LINKS.districtArtist} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            All dates on District <ArrowUpRight size={15} />
          </a>
          <p className="text-xs text-muted max-w-sm">
            Listings checked against District on {formatDate(VERIFIED_AT)}. Prices and availability change, so
            District is always the final word.
          </p>
        </div>
      </PageHeader>
      <section className="container-x pb-16">
        <ShowsExplorer shows={shows} />
      </section>
    </>
  );
}
