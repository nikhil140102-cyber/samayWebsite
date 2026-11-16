import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Crown, Sparkles, Ticket } from "lucide-react";
import Hero from "@/components/hero/Hero";
import Marquee from "@/components/animations/Marquee";
import Reveal, { Stagger, StaggerItem } from "@/components/animations/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import VideoGrid, { VideoSkeletonGrid } from "@/components/videos/VideoGrid";
import ShowCard from "@/components/shows/ShowCard";
import NewsletterForm from "@/components/common/NewsletterForm";
import JourneyRail from "@/components/hero/JourneyRail";
import { getLatestVideos } from "@/lib/youtube";
import { getSiteContent, getUpcomingShows } from "@/lib/data";
import { milestones } from "@/data/journey";
import { LINKS } from "@/lib/site";

export const revalidate = 1800;

async function LatestVideos() {
  const { videos } = await getLatestVideos();
  const longform = videos.filter((v) => v.kind !== "short").slice(0, 4);
  return <VideoGrid videos={longform.length ? longform : videos.slice(0, 4)} variant="feature" />;
}

async function UpcomingShows() {
  const shows = await getUpcomingShows(4);
  if (!shows.length)
    return (
      <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
        No upcoming shows are listed right now. Check back soon.
      </p>
    );
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {shows.map((s) => (
        <Reveal key={s.slug}>
          <ShowCard show={s} />
        </Reveal>
      ))}
    </div>
  );
}

export default async function Home() {
  const content = await getSiteContent();
  return (
    <>
      <Hero content={content} />

      <Marquee items={["Comedy", "Chaos", "Chess", "Still Alive", "India's Got Latent", "Samay Raina Live"]} />

      {/* Latest videos */}
      <section id="latest" className="container-x py-20 md:py-24 scroll-mt-24">
        <SectionHeading
          eyebrow="Fresh off the channel"
          title={<>Latest from <span className="font-serif italic font-normal text-accent">YouTube</span></>}
          intro="Pulled straight from the official channel. Tap any video to play it here."
          action={
            <Link href="/videos" className="btn btn-ghost">
              All videos <ArrowRight size={16} />
            </Link>
          }
        />
        <Suspense fallback={<VideoSkeletonGrid count={4} />}>
          <LatestVideos />
        </Suspense>
      </section>

      {/* Journey */}
      <section className="relative overflow-hidden bg-bg-soft py-20 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="The journey"
            title={<>From open mics<br />to <span className="text-accent">arenas.</span></>}
            intro="Every milestone below is drawn from public, cited sources — no myths, no made-up numbers."
            action={
              <Link href="/about" className="btn btn-primary">
                Read the full story <ArrowRight size={16} />
              </Link>
            }
          />
        </div>
        <JourneyRail items={milestones} />
      </section>

      {/* Shows */}
      <section className="container-x py-20 md:py-24">
        <SectionHeading
          eyebrow={content.announcement}
          title={<>Catch him <span className="font-serif italic font-normal">live.</span></>}
          intro="Samay Raina Live is touring India from November 2026 to April 2027. Tickets are sold exclusively on District."
          action={
            <Link href="/shows" className="btn btn-ghost">
              <Ticket size={16} /> All shows
            </Link>
          }
        />
        <Suspense fallback={<div className="skeleton h-64 rounded-3xl" />}>
          <UpcomingShows />
        </Suspense>
      </section>

      {/* Membership + Fan picks */}
      <section className="container-x pb-20 md:pb-24">
        <Stagger className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <StaggerItem>
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-[#0a0a0b] p-8 md:p-12 text-white grain">
              <div
                aria-hidden
                className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl"
                style={{ background: "rgba(255,46,63,.45)" }}
              />
              <Crown className="relative text-[#ff2e3f]" size={32} />
              <p className="relative mt-8 font-sora text-xs uppercase tracking-[0.3em] text-white/60">Membership</p>
              <h2 className="relative mt-3 display text-4xl md:text-5xl">GO BEYOND THE SHOW.</h2>
              <p className="relative mt-5 max-w-md text-white/70 text-lg">
                Discover exclusive content and entertainment experiences, through official channel memberships.
              </p>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <Link href="/membership" className="btn btn-primary">
                  See membership tiers <ArrowRight size={16} />
                </Link>
                <a href={LINKS.youtubeJoin} target="_blank" rel="noopener noreferrer" className="btn border border-white/20 text-white hover:border-white">
                  Join on YouTube <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="card flex h-full flex-col p-7 md:p-9">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Merchandise</p>
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">Concept</span>
              </div>
              <h2 className="mt-3 display text-3xl md:text-4xl">Wear the chaos.</h2>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["still-alive-tee", "blunder-master-hoodie", "nazar-na-lage-tee"].map((k) => (
                  <Link key={k} href={`/merchandise/${k}`} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-2">
                    <Image src={`/images/merch/${k}.webp`} alt="" fill sizes="(min-width:1024px) 12vw, 30vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Link href="/merchandise" className="btn btn-primary">
                  See the collection <ArrowRight size={15} />
                </Link>
                <Link href="/fan-picks" className="btn btn-ghost">
                  <Sparkles size={15} /> Fan picks
                </Link>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      {/* Newsletter */}
      <section className="container-x pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-line p-8 md:p-14 grain">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-70"
              style={{ background: "radial-gradient(80% 120% at 100% 0%, var(--accent-soft), transparent 60%)" }}
            />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="eyebrow">Fan newsletter</p>
                <h2 className="mt-3 display text-3xl md:text-[2.6rem]">
                  Never miss a <span className="font-serif italic font-normal text-accent">drop.</span>
                </h2>
                <p className="mt-4 text-muted text-lg">
                  New videos, tour dates and fan-community news. Once in a while, no spam.
                </p>
              </div>
              <NewsletterForm source="home" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
