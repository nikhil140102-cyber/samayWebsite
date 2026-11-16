// Amazon Associates link builder. Uses only search URLs or product URLs built from an
// ASIN you chose — never scraped data. Domain defaults to amazon.in (Associates India).
const TAG = process.env.AMAZON_ASSOCIATE_TAG || "";
const DOMAIN = process.env.AMAZON_DOMAIN || "www.amazon.in";

export const hasAssociateTag = Boolean(TAG);

export function amazonUrl({ asin, query }) {
  const u = asin
    ? new URL(`https://${DOMAIN}/dp/${encodeURIComponent(asin)}`)
    : new URL(`https://${DOMAIN}/s`);
  if (!asin) u.searchParams.set("k", query || "");
  if (TAG) u.searchParams.set("tag", TAG);
  return u.toString();
}
