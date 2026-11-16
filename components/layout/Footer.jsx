import Link from "next/link";
import { ArrowUpRight, Ticket } from "lucide-react";
import { AFFILIATE_DISCLOSURE, LINKS, SITE, SOCIALS } from "@/lib/site";
import SocialIcon from "@/components/common/SocialIcon";
import NewsletterForm from "@/components/common/NewsletterForm";

const cols = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About Samay" },
      { href: "/videos", label: "Videos" },
      { href: "/shows", label: "Live Shows" },
      { href: "/gallery", label: "Gallery" },
      { href: "/fan-community", label: "Fan Community" },
    ],
  },
  {
    title: "Shop & Support",
    links: [
      { href: "/membership", label: "Membership" },
      { href: "/merchandise", label: "Merchandise" },
      { href: "/fan-picks", label: "Fan Picks" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms & Conditions" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-16 border-t border-line bg-bg-soft overflow-hidden">
      <div className="container-x py-10 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="eyebrow mb-4">About this fan project</p>
            <p className="display text-2xl md:text-3xl">Made by a fan, for the fans.</p>
            <p className="mt-3 text-sm text-muted leading-relaxed max-w-md">
              {SITE.disclaimer} All trademarks, videos and images belong to their respective owners and are
              used for tribute and commentary with attribution.
            </p>
            <div className="mt-4 max-w-md">
              <NewsletterForm compact source="footer" />
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="eyebrow mb-4 !text-muted">{c.title}</p>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-accent transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent transition-colors"
              >
                <SocialIcon name={s.key} size={15} /> {s.label}
              </a>
            ))}
            <a
              href={LINKS.districtArtist}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent transition-colors"
            >
              <Ticket size={15} /> Book on District <ArrowUpRight size={13} />
            </a>
          </div>
          <p className="text-xs text-muted max-w-md">{AFFILIATE_DISCLOSURE}</p>
        </div>

        <div className="mt-5 flex flex-col gap-2 text-xs text-muted md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} SR Fan World — an independently operated fan project.</p>
          <p>
            Video content © Samay Raina, embedded via YouTube. Ticketing by{" "}
            <a href={LINKS.district} className="underline hover:text-accent" target="_blank" rel="noopener noreferrer">
              District
            </a>
            .
          </p>
        </div>
      </div>
      <p
        aria-hidden
        className="footer-wordmark select-none whitespace-nowrap display text-[13vw] leading-[0.8] -mb-[1.6vw] text-center cursor-default"
      >
        SAMAY RAINA
      </p>
    </footer>
  );
}
