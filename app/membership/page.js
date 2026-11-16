import { ArrowUpRight, Check, Crown, Star, Users } from "lucide-react";
import Reveal, { Stagger, StaggerItem } from "@/components/animations/Reveal";
import { LINKS } from "@/lib/site";

export const metadata = {
  title: "Membership",
  description: "Go beyond the show — free fan updates and official YouTube channel membership for Samay Raina's channel.",
  alternates: { canonical: "/membership" },
};

const tiers = [
  {
    icon: Users,
    name: "Free Fan",
    price: "Free",
    tagline: "Everything public, all in one place.",
    perks: ["Public YouTube videos", "Public tour & channel updates", "Community news via the fan newsletter"],
    cta: { label: "Join the newsletter", href: "/fan-community", internal: true },
  },
  {
    icon: Crown,
    name: "Exclusive Member",
    price: "Set by YouTube",
    tagline: "Official YouTube channel membership.",
    perks: [
      "Join directly on Samay Raina's YouTube channel",
      "Access to eligible members-only videos and posts",
      "Members-only community content where available",
    ],
    cta: { label: "Join on YouTube", href: LINKS.youtubeJoin },
    featured: true,
    note: "Pricing, perks and availability are set by the channel on YouTube and may vary by country.",
  },
  {
    icon: Star,
    name: "Premium Experience",
    price: "Official platforms",
    tagline: "Live, in the room.",
    perks: [
      "Samay Raina Live tickets via District",
      "Apply to be in the India's Got Latent audience via the official site",
      "No unofficial bundles — only verified, official routes",
    ],
    cta: { label: "Apply on samayraina.co", href: LINKS.audienceApply },
    secondary: { label: "Tour tickets", href: "/shows", internal: true },
  },
];

export default function MembershipPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-20 grain">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 h-[600px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent)" }}
        />
        <div className="container-x relative text-center">
          <Reveal>
            <p className="eyebrow">Membership</p>
            <h1 className="display mt-5 text-[clamp(2.5rem,6.5vw,5.6rem)]">
              GO BEYOND
              <br />
              THE <span className="text-accent">SHOW.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              Discover exclusive content and entertainment experiences.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-20">
        <Stagger className="grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <StaggerItem key={t.name}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 md:p-10 transition duration-500 hover:-translate-y-1 ${
                  t.featured
                    ? "bg-[#0a0a0b] text-white shadow-[0_40px_120px_-40px_var(--accent)] ring-1 ring-[#ff2e3f]/40"
                    : "card"
                }`}
              >
                {t.featured && (
                  <>
                    <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ff2e3f]/40 blur-3xl" />
                    <span className="absolute right-6 top-6 rounded-full bg-[#ff2e3f] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                      Official
                    </span>
                  </>
                )}
                <t.icon className={t.featured ? "text-[#ff2e3f]" : "text-accent"} size={30} />
                <h2 className="relative mt-8 font-display text-3xl font-bold">{t.name}</h2>
                <p className={`relative mt-1 ${t.featured ? "text-white/60" : "text-muted"}`}>{t.tagline}</p>
                <p className="relative mt-6 display text-4xl">{t.price}</p>
                <ul className="relative mt-8 space-y-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-3">
                      <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                      <span className={t.featured ? "text-white/85" : ""}>{p}</span>
                    </li>
                  ))}
                </ul>
                {t.note && <p className="relative mt-6 text-xs text-white/50">{t.note}</p>}
                <div className="relative mt-auto flex flex-wrap gap-2 pt-10">
                  {t.cta.internal ? (
                    <a href={t.cta.href} className={`btn ${t.featured ? "btn-primary" : "btn-ghost"}`}>
                      {t.cta.label}
                    </a>
                  ) : (
                    <a href={t.cta.href} target="_blank" rel="noopener noreferrer" className={`btn ${t.featured ? "btn-primary" : "btn-ghost"}`}>
                      {t.cta.label} <ArrowUpRight size={15} />
                    </a>
                  )}
                  {t.secondary && (
                    <a href={t.secondary.href} className="btn btn-ghost">
                      {t.secondary.label}
                    </a>
                  )}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          This fan site does not sell subscriptions or host members-only content. Membership is purchased and managed
          entirely on YouTube, and benefits are decided by the channel, not by this website.
        </p>
      </section>
    </>
  );
}
