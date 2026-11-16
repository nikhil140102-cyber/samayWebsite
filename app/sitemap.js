import { SITE } from "@/lib/site";
import { getProducts, getShows } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap() {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const statics = [
    "", "/about", "/videos", "/shows", "/membership", "/merchandise", "/fan-picks", "/gallery",
    "/fan-community", "/contact", "/privacy-policy", "/terms-and-conditions", "/affiliate-disclosure",
  ].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: p ? "weekly" : "daily", priority: p ? 0.7 : 1 }));
  const shows = (await getShows()).map((s) => ({ url: `${base}/shows/${s.slug}`, lastModified: now, priority: 0.8 }));
  const products = (await getProducts()).map((p) => ({ url: `${base}/merchandise/${p.slug}`, lastModified: now, priority: 0.6 }));
  return [...statics, ...shows, ...products];
}
