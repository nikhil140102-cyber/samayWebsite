// Copies the verified seed data in /data into MongoDB so it can be edited in /admin.
// Usage: npm run seed   (safe to re-run: upserts by slug / youtubeId)
import mongoose from "mongoose";
import { readFileSync, existsSync } from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const { default: shows } = await import("../data/shows.js");
const { default: videos } = await import("../data/videos.js");
const { default: gallery } = await import("../data/gallery.js");
const { default: affiliate } = await import("../data/affiliate.js");

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;
const now = new Date();
const upsert = async (col, key, docs) => {
  for (const d of docs) {
    await db.collection(col).updateOne(
      { [key]: d[key] },
      { $set: { ...d, published: d.published ?? true, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
  }
  console.log(`✔ ${col}: ${docs.length}`);
};

await upsert("shows", "slug", shows);
await upsert(
  "videos",
  "youtubeId",
  videos.map(({ id, ...v }) => ({ youtubeId: id, ...v }))
);
await upsert("galleryimages", "slug", gallery);
await upsert("affiliateproducts", "slug", affiliate);
await mongoose.disconnect();
