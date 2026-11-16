import Link from "next/link";
import { ArrowRight, PackageOpen, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/common/SectionHeading";
import Reveal from "@/components/animations/Reveal";
import MerchCatalog from "@/components/merchandise/MerchCatalog";
import { getProducts } from "@/lib/data";
import { checkoutEnabled } from "@/lib/payments";
import { PRODUCT_CATEGORIES } from "@/data/products";

export const revalidate = 300;

export const metadata = {
  title: "Merchandise — Wear the Chaos",
  description: "Licensed fan merchandise. T-shirts, hoodies, caps, posters and collectibles.",
  alternates: { canonical: "/merchandise" },
};

export default async function MerchandisePage() {
  const products = await getProducts();
  return (
    <>
      <PageHeader
        eyebrow="Merchandise"
        title={<>WEAR THE <span className="text-accent">CHAOS.</span></>}
        intro="A concept collection inspired by the channel, the specials and the tour. Built on a fully working store, ready for an official, licensed drop."
      />
      <section className="container-x pb-12">
        {products.length ? (
          <MerchCatalog products={products} categories={PRODUCT_CATEGORIES} checkoutEnabled={checkoutEnabled()} />
        ) : (
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-line p-10 md:p-16 grain">
              <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" style={{ background: "var(--accent-soft)" }} />
              <PackageOpen size={36} className="relative text-accent" />
              <h2 className="relative display mt-6 text-3xl md:text-4xl">The drop is being stitched.</h2>
              <p className="relative mt-5 max-w-2xl text-lg text-muted">
                No officially licensed Samay Raina merchandise has been confirmed for this store yet, so nothing is
                for sale. We won&apos;t sell products using his name, face or branding without permission. The store,
                cart and secure checkout are ready to go live as soon as licensed products are added.
              </p>
              <ul className="relative mt-8 grid gap-3 sm:grid-cols-3 text-sm">
                {["Server-verified Razorpay payments", "Persistent cart & live stock", "Admin-managed catalogue"].map((t) => (
                  <li key={t} className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3">
                    <ShieldCheck size={16} className="text-accent shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <Link href="/fan-community" className="btn btn-primary">
                  Get notified at launch <ArrowRight size={16} />
                </Link>
                <Link href="/fan-picks" className="btn btn-ghost">
                  Browse Fan Picks
                </Link>
              </div>
            </div>
          </Reveal>
        )}
      </section>

      <section className="container-x pb-8">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-bg-soft p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <p className="eyebrow">Third-party discovery</p>
            <h2 className="mt-2 display text-3xl md:text-5xl">FAN PICKS – PRODUCTS WORTH EXPLORING</h2>
            <p className="mt-3 max-w-xl text-muted">
              Creator gear, chess sets and more on Amazon. Clearly labelled affiliate links, never official merchandise.
            </p>
          </div>
          <Link href="/fan-picks" className="btn btn-ghost shrink-0">
            Explore fan picks <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
