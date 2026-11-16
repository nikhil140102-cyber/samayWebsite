import { PageHeader } from "@/components/common/SectionHeading";
import AffiliateGrid from "@/components/merchandise/AffiliateGrid";
import { getAffiliateProducts } from "@/lib/data";
import { amazonUrl, hasAssociateTag } from "@/lib/amazon";
import { AFFILIATE_CATEGORIES } from "@/data/affiliate";
import { AFFILIATE_DISCLOSURE } from "@/lib/site";

export const revalidate = 600;

export const metadata = {
  title: "Fan Picks — Products Worth Exploring",
  description: "Microphones, headphones, chess sets, books and creator gear picked for fans. Amazon affiliate links.",
  alternates: { canonical: "/fan-picks" },
};

export default async function FanPicksPage() {
  const products = (await getAffiliateProducts()).map((p) => ({ ...p, url: amazonUrl(p) }));
  return (
    <>
      <PageHeader
        eyebrow="Fan picks"
        title={<>Products worth <span className="font-serif italic font-normal text-accent">exploring.</span></>}
        intro="Gear for streaming, playing chess and making things, picked by fans. These are not official Samay Raina products."
      >
        <p className="mt-8 inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm">
          {AFFILIATE_DISCLOSURE}
        </p>
      </PageHeader>
      <section className="container-x pb-12">
        <AffiliateGrid products={products} categories={AFFILIATE_CATEGORIES} />
        {!hasAssociateTag && (
          <p className="mt-8 text-xs text-muted">Note for the site owner: set AMAZON_ASSOCIATE_TAG to attach your Associates ID to these links.</p>
        )}
      </section>
    </>
  );
}
