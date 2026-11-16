import { PageHeader } from "@/components/common/SectionHeading";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { getGallery } from "@/lib/data";
import { GALLERY_CATEGORIES } from "@/data/gallery";

export const revalidate = 600;

export const metadata = {
  title: "Gallery",
  description: "Stage performances, comedy events and YouTube moments, with source attribution on every image.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const images = await getGallery();
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={<>Frames of <span className="font-serif italic font-normal text-accent">chaos.</span></>}
        intro="Only images we're allowed to reuse appear here, each credited to its source. Click any frame to open it full screen."
      />
      <section className="container-x pb-12">
        <GalleryGrid images={images} filterable categories={GALLERY_CATEGORIES} />
      </section>
    </>
  );
}
