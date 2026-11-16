import { ArrowUpRight, Camera, Megaphone, Newspaper } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import Reveal, { Stagger, StaggerItem } from "@/components/animations/Reveal";
import NewsletterForm from "@/components/common/NewsletterForm";
import FanSubmissionForm from "@/components/common/FanSubmissionForm";
import SocialIcon from "@/components/common/SocialIcon";
import { getUpcomingShows } from "@/lib/data";
import { LINKS, SITE } from "@/lib/site";

export const revalidate = 600;

export const metadata = {
  title: "Fan Community",
  description: "Join the fan newsletter, follow the official channels and share your fan art and photos.",
  alternates: { canonical: "/fan-community" },
};

const channels = [
  { key: "youtube", label: "YouTube", handle: "@SamayRainaOfficial", href: LINKS.youtube },
  { key: "instagram", label: "Instagram", handle: "@maisamayhoon", href: LINKS.instagram },
  { key: "x", label: "X", handle: "@ReheSamay", href: LINKS.x },
  { key: "discord", label: "Discord", handle: "discord.gg/maisamayhoon", href: LINKS.discord },
  { key: "youtube", label: "India's Got Latent", handle: "@IndiasGotLatentOfficial", href: LINKS.iglYoutube },
  { key: "instagram", label: "Latent on Instagram", handle: "@indiasgotlatent", href: LINKS.iglInstagram },
];

export default async function FanCommunityPage() {
  const shows = await getUpcomingShows();
  const updates = [
    {
      icon: Megaphone,
      title: "Samay Raina Live is on tour",
      text: `${shows.length} upcoming listings across ${new Set(shows.map((s) => s.city)).size} cities, from November 2026 to April 2027. Tickets are on District.`,
      href: "/shows",
    },
    {
      icon: Newspaper,
      title: "India's Got Latent Season 2",
      text: "New episodes have premiered on YouTube and Netflix since 20 June 2026.",
      href: "/videos",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Fan community"
        title={<>The <span className="font-serif italic font-normal text-accent">Latent</span> lounge.</>}
        intro="A home base for fans: newsletter, official channels, community updates and a wall for your fan art."
      >
        <p className="mt-6 text-sm text-muted max-w-xl">{SITE.disclaimer} This community is run by fans, not by Samay Raina or his team.</p>
      </PageHeader>

      <section className="container-x grid gap-6 pb-20 lg:grid-cols-2">
        <Reveal className="card p-8 md:p-10">
          <p className="eyebrow">Fan newsletter</p>
          <h2 className="mt-3 display text-4xl">Get the drop first.</h2>
          <p className="mt-3 text-muted">New videos, tour dates and community picks. Unsubscribe anytime.</p>
          <div className="mt-8">
            <NewsletterForm source="community" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="card p-8 md:p-10">
          <p className="eyebrow">Community updates</p>
          <ul className="mt-6 space-y-4">
            {updates.map((u) => (
              <li key={u.title}>
                <a href={u.href} className="group flex gap-4 rounded-2xl border border-line p-5 hover:border-accent transition-colors">
                  <u.icon className="shrink-0 text-accent" />
                  <span>
                    <span className="block font-display text-lg font-semibold group-hover:text-accent">{u.title}</span>
                    <span className="mt-1 block text-sm text-muted">{u.text}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-bg-soft py-20">
        <div className="container-x">
          <p className="eyebrow">Official channels</p>
          <h2 className="mt-3 display text-3xl md:text-[2.6rem]">Follow the source.</h2>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((c) => (
              <StaggerItem key={c.href}>
                <a href={c.href} target="_blank" rel="noopener noreferrer" className="card group flex items-center gap-4 p-6 hover:border-accent transition-colors">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                    <SocialIcon name={c.key} size={20} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-semibold">{c.label}</span>
                    <span className="text-sm text-muted">{c.handle}</span>
                  </span>
                  <ArrowUpRight size={18} className="text-muted group-hover:text-accent" />
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <Camera className="text-accent" size={30} />
            <p className="eyebrow mt-6">Fan submissions</p>
            <h2 className="mt-3 display text-3xl md:text-[2.6rem]">Share your fan art.</h2>
            <p className="mt-4 text-muted text-lg">
              Made a sketch, a cosplay or a show-night photo? Share a link to it. Each submission is reviewed by hand
              before it can appear in the gallery, and only with your consent.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="card p-8">
            <FanSubmissionForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
