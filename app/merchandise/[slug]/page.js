import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductDetail from "@/components/merchandise/ProductDetail";
import ProductCard from "@/components/merchandise/ProductCard";
import { getProduct, getProducts } from "@/lib/data";
import { checkoutEnabled } from "@/lib/payments";
import { inr } from "@/lib/format";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/merchandise/${slug}` },
    openGraph: { images: p.images?.slice(0, 1) },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProducts())
    .filter((p) => p.slug !== slug && p.category === product.category)
    .slice(0, 4);
  const enabled = checkoutEnabled();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    offers: product.concept ? undefined : {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-x pt-32 md:pt-40">
        <Link href="/merchandise" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
          <ArrowLeft size={15} /> Back to store
        </Link>
        <ProductDetail product={product} checkoutEnabled={enabled} priceLabel={inr(product.price)} />
      </section>
      {related.length > 0 && (
        <section className="container-x py-24">
          <h2 className="display text-4xl">Related products</h2>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} checkoutEnabled={enabled} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
