// Read layer used by pages. Prefers MongoDB (admin-managed) and falls back to the
// verified seed files in /data so the site works before a database is connected.
import "server-only";
import { connectDB, hasDatabase } from "./mongodb";
import { Show, Product, GalleryImage, AffiliateProduct, SiteContent, Video } from "@/models";
import seedShows from "@/data/shows";
import seedProducts from "@/data/products";
import seedGallery from "@/data/gallery";
import seedAffiliate from "@/data/affiliate";
import seedContent from "@/data/content";
import seedVideos from "@/data/videos";

const clean = (docs) => JSON.parse(JSON.stringify(docs));

async function fromDb(fn, fallback) {
  if (!hasDatabase) return fallback;
  try {
    await connectDB();
    const result = await fn();
    // An empty collection still falls back to verified seed data.
    if (Array.isArray(result) && result.length === 0) return fallback;
    return result ? clean(result) : fallback;
  } catch (e) {
    console.error("[data] database read failed, using seed data:", e.message);
    return fallback;
  }
}

const today = () => new Date().toISOString().slice(0, 10);

export function showPhase(show) {
  const end = show.endDate || show.startDate;
  if (show.status === "cancelled") return "cancelled";
  return end < today() ? "past" : "upcoming";
}

export async function getShows() {
  const shows = await fromDb(() => Show.find({ published: true }).sort({ startDate: 1 }).lean(), seedShows);
  return [...shows].sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export async function getUpcomingShows(limit) {
  const shows = (await getShows()).filter((s) => showPhase(s) === "upcoming");
  return limit ? shows.slice(0, limit) : shows;
}

export async function getShow(slug) {
  return (await getShows()).find((s) => s.slug === slug) || null;
}

export async function getProducts() {
  return fromDb(() => Product.find({ published: true }).sort({ createdAt: -1 }).lean(), seedProducts);
}

export async function getProduct(slug) {
  return (await getProducts()).find((p) => p.slug === slug) || null;
}

export async function getGallery() {
  return fromDb(() => GalleryImage.find({ published: true }).sort({ createdAt: -1 }).lean(), seedGallery);
}

export async function getAffiliateProducts() {
  return fromDb(() => AffiliateProduct.find({ published: true }).sort({ category: 1 }).lean(), seedAffiliate);
}

export async function getCuratedVideos() {
  const docs = await fromDb(
    () => Video.find({ published: true }).sort({ publishedAt: -1 }).lean(),
    null
  );
  if (!docs) return seedVideos;
  return docs.map((d) => ({
    id: d.youtubeId,
    title: d.title,
    description: d.description,
    publishedAt: d.publishedAt,
    kind: d.kind,
    featured: d.featured,
  }));
}

export async function getSiteContent() {
  const doc = await fromDb(() => SiteContent.findOne({ key: "home" }).lean(), null);
  if (!doc) return seedContent;
  const merged = { ...seedContent };
  for (const k of Object.keys(seedContent)) if (doc[k]) merged[k] = doc[k];
  return merged;
}
