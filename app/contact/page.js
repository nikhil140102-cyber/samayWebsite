import { ArrowUpRight, Briefcase, Mail } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import Reveal from "@/components/animations/Reveal";
import ContactForm from "@/components/common/ContactForm";
import { LINKS, SITE } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the team behind this independent Samay Raina fan website.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={<>Say <span className="font-serif italic font-normal text-accent">hello.</span></>}
        intro="Questions, corrections, takedown requests or feedback about this fan site go here."
      />
      <section className="container-x grid gap-8 pb-12 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="card p-8 md:p-10">
          <ContactForm />
        </Reveal>
        <Reveal delay={0.1} className="space-y-4">
          <div className="card p-7">
            <Mail className="text-accent" />
            <h2 className="mt-4 font-display text-xl font-bold">About this site</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              {SITE.disclaimer} Messages sent here reach the fan-site team only. We can&apos;t pass messages on to Samay
              Raina.
            </p>
          </div>
          <div className="card p-7">
            <Briefcase className="text-accent" />
            <h2 className="mt-4 font-display text-xl font-bold">Official enquiries</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              For bookings, brand work or official matters, please use the official website.
            </p>
            <a href={LINKS.officialSite} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-5">
              samayraina.co <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
