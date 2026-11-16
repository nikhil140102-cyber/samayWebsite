import Link from "next/link";
import { ArrowUpRight, Crown, Mic, MonitorPlay, Tv } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import Reveal from "@/components/animations/Reveal";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { milestones, SOURCES } from "@/data/journey";
import { getGallery } from "@/lib/data";
import { LINKS, SITE } from "@/lib/site";

export const metadata = {
  title: "About Samay Raina",
  description:
    "The journey of Samay Raina — from open mics and Comicstaan 2 to chess streaming, India's Got Latent, Still Alive and the Samay Raina Live tour. Fully sourced.",
  alternates: { canonical: "/about" },
};

const chapters = [
  {
    icon: Mic,
    eyebrow: "Introduction",
    title: "A comedian who refuses to stay in one lane.",
    body: [
      "Samay Raina is an Indian stand-up comedian and YouTuber, known for dark, unfiltered humour, crowd work and chaotic live formats built for YouTube.",
      "Born in Jammu on 26 October 1997, he trained as an engineer at PVG's College of Engineering in Pune before comedy took over.",
    ],
    sources: ["wiki"],
  },
  {
    icon: Mic,
    eyebrow: "Early journey",
    title: "Open mics, opening slots, then Comicstaan.",
    body: [
      "He started doing open mics in August 2017 and opened for established comedians like Abhishek Upmanyu and Anirban Dasgupta.",
      "In 2019 he joined Comicstaan Season 2 on Amazon Prime Video, at Aakash Gupta's suggestion, and the two went on to become the season's joint winners.",
    ],
    sources: ["wiki", "chessbase"],
  },
  {
    icon: Crown,
    eyebrow: "Chess & entertainment",
    title: "The comedian who made chess cool.",
    body: [
      "When the pandemic shut down live comedy in 2020, he began streaming chess on YouTube at fellow comedian Tanmay Bhat's suggestion. Grandmaster Vidit Gujrathi and YouTuber agadmator joined his streams and the audience exploded.",
      "Comedians on Board — chess tournaments between comedians — became a phenomenon, and the streams are widely credited with bringing online chess to a mass Indian audience.",
    ],
    sources: ["wiki", "deadant", "chessbase"],
    link: { href: LINKS.chess, label: "His Chess.com profile" },
  },
  {
    icon: MonitorPlay,
    eyebrow: "YouTube journey",
    title: "India's Got Latent and the return with Still Alive.",
    body: [
      "On 14 June 2024 he launched India's Got Latent, a comedy talent show inspired by Kill Tony and the Got Talent format, on his YouTube channel. In February 2025, after a controversy over a guest's remarks, he made the episodes private and stepped back.",
      "He returned on 7 April 2026 with his debut special, Still Alive, which was reported to have become the most-watched comedy special on YouTube. India's Got Latent Season 2 premiered on 20 June 2026 on YouTube and Netflix.",
    ],
    sources: ["wikiIgl", "thr", "stillAlive", "fpj", "igl2"],
  },
  {
    icon: Tv,
    eyebrow: "Shows & appearances",
    title: "From Prime Video to Netflix to arenas.",
    body: [
      "Beyond Comicstaan, his credits include Netflix's Comedy Premium League (2021) and mentoring on Amazon Prime Video's One Mic Stand Season 2.",
      "In 2026 he toured the US with Still Alive, and Samay Raina Live — his biggest India tour so far — runs from November 2026 to April 2027 with tickets exclusively on District.",
    ],
    sources: ["wiki", "hans", "district"],
    link: { href: "/shows", label: "See tour dates", internal: true },
  },
];

function Cite({ ids }) {
  return (
    <p className="mt-4 text-xs text-muted">
      Sources:{" "}
      {ids.map((id, i) => (
        <span key={id}>
          <a href={SOURCES[id].url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
            {SOURCES[id].label}
          </a>
          {i < ids.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export default async function AboutPage() {
  const gallery = await getGallery();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Samay Raina",
    birthDate: "1997-10-26",
    birthPlace: "Jammu, India",
    jobTitle: "Stand-up comedian",
    nationality: "Indian",
    sameAs: [LINKS.youtube, LINKS.instagram, LINKS.x, SOURCES.wiki.url],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="About Samay"
        title={<>The <span className="font-serif italic font-normal text-accent">unfiltered</span> story.</>}
        intro="An editorial look at the journey so far. Every fact below links to a public source, and nothing has been invented or embellished."
      />

      <div className="container-x">
        {chapters.map((c, i) => (
          <section key={c.eyebrow} className="grid gap-8 border-t border-line py-16 md:grid-cols-[0.8fr_1.4fr] md:py-24">
            <Reveal>
              <span className="font-sora text-sm text-muted">0{i + 1}</span>
              <p className="eyebrow mt-3">{c.eyebrow}</p>
              <c.icon className="mt-6 text-accent" size={30} />
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display text-3xl md:text-[2.6rem]">{c.title}</h2>
              {c.body.map((p, j) => (
                <p key={j} className={`mt-5 text-[1.02rem] leading-relaxed text-muted ${j === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-accent" : ""}`}>
                  {p}
                </p>
              ))}
              {c.link &&
                (c.link.internal ? (
                  <Link href={c.link.href} className="btn btn-ghost mt-6">
                    {c.link.label} <ArrowUpRight size={15} />
                  </Link>
                ) : (
                  <a href={c.link.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6">
                    {c.link.label} <ArrowUpRight size={15} />
                  </a>
                ))}
              <Cite ids={c.sources} />
            </Reveal>
          </section>
        ))}
      </div>

      {/* Milestones */}
      <section className="bg-bg-soft py-24">
        <div className="container-x">
          <p className="eyebrow">Major milestones</p>
          <h2 className="display mt-3 text-4xl md:text-5xl">The timeline.</h2>
          <ol className="relative mt-14 border-l border-line pl-8 md:pl-12">
            {milestones.map((m, i) => (
              <Reveal as="li" key={i} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[calc(2rem+6px)] md:-left-[calc(3rem+6px)] top-2 h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_var(--accent)]" />
                <p className="font-display text-sm font-bold text-accent">{m.year}</p>
                <h3 className="mt-1 font-display text-2xl font-bold">{m.title}</h3>
                <p className="mt-2 max-w-2xl text-muted leading-relaxed">{m.text}</p>
                <Cite ids={m.sources} />
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-x py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Photo gallery</p>
            <h2 className="display mt-3 text-3xl md:text-[2.6rem]">Moments.</h2>
          </div>
          <Link href="/gallery" className="btn btn-ghost">
            Full gallery <ArrowUpRight size={15} />
          </Link>
        </div>
        <GalleryGrid images={gallery.slice(0, 6)} />
        <p className="mt-6 text-xs text-muted">{SITE.disclaimer}</p>
      </section>
    </>
  );
}
