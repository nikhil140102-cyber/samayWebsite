// YouTube integration — three tiers, all using real data only:
//   1. YouTube Data API v3 (YOUTUBE_API_KEY) → uploads, popular, shorts, playlists
//   2. Public channel RSS feed (no key)      → latest ~15 uploads
//   3. Curated, verified video list          → /data/videos.js or the Videos collection
// Responses are cached with Next's fetch cache (revalidate) to protect API quota.
import "server-only";
import { SITE } from "./site";
import { getCuratedVideos } from "./data";

const KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL = SITE.youtubeChannelId;
const API = "https://www.googleapis.com/youtube/v3";
const HOUR = 3600;

export const thumb = (id, q = "hqdefault") => `https://i.ytimg.com/vi/${id}/${q}.jpg`;

async function api(path, params, revalidate = HOUR) {
  const qs = new URLSearchParams({ ...params, key: KEY });
  const res = await fetch(`${API}/${path}?${qs}`, { next: { revalidate, tags: ["youtube"] } });
  if (!res.ok) throw new Error(`YouTube API ${path} ${res.status}`);
  return res.json();
}

// ISO 8601 duration → seconds
function seconds(iso = "") {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
}

function normalize(item, details) {
  const id = item.contentDetails?.videoId || item.id?.videoId || item.id;
  const sn = item.snippet || {};
  const d = details?.[id];
  const dur = seconds(d?.contentDetails?.duration);
  return {
    id,
    title: sn.title,
    description: sn.description || "",
    publishedAt: item.contentDetails?.videoPublishedAt || sn.publishedAt || null,
    thumbnail: sn.thumbnails?.maxres?.url || sn.thumbnails?.high?.url || thumb(id),
    durationSec: dur || null,
    views: d?.statistics?.viewCount ? Number(d.statistics.viewCount) : null,
    kind: dur && dur <= 180 ? "short" : "video",
  };
}

async function videoDetails(ids) {
  if (!ids.length) return {};
  const data = await api("videos", { part: "contentDetails,statistics", id: ids.join(","), maxResults: "50" });
  return Object.fromEntries((data.items || []).map((v) => [v.id, v]));
}

async function fromApi() {
  const uploads = "UU" + CHANNEL.slice(2);
  const list = await api("playlistItems", { part: "snippet,contentDetails", playlistId: uploads, maxResults: "50" });
  const items = (list.items || []).filter((i) => i.snippet?.title !== "Private video");
  const details = await videoDetails(items.map((i) => i.contentDetails.videoId));
  return items.map((i) => normalize(i, details));
}

async function fromRss() {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`, {
    next: { revalidate: HOUR, tags: ["youtube"] },
  });
  if (!res.ok) throw new Error(`RSS ${res.status}`);
  const xml = await res.text();
  const decode = (s = "") =>
    s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  const pick = (block, tag) => block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1];
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => {
    const id = pick(e, "yt:videoId");
    const link = e.match(/<link[^>]*href="([^"]+)"/)?.[1] || "";
    return {
      id,
      title: decode(pick(e, "title")),
      description: decode(pick(e, "media:description") || ""),
      publishedAt: pick(e, "published") || null,
      thumbnail: thumb(id),
      durationSec: null,
      views: null,
      kind: link.includes("/shorts/") ? "short" : "video",
    };
  });
}

async function fromCurated() {
  const vids = await getCuratedVideos();
  return vids.map((v) => ({ ...v, thumbnail: thumb(v.id), durationSec: null, views: null }));
}

/**
 * Latest uploads. Returns { videos, source, error }.
 * source: "api" | "rss" | "curated"
 */
export async function getLatestVideos() {
  const errors = [];
  if (KEY) {
    try {
      return { videos: await fromApi(), source: "api" };
    } catch (e) {
      errors.push(e.message);
    }
  }
  try {
    const v = await fromRss();
    if (v.length) return { videos: v, source: "rss" };
  } catch (e) {
    errors.push(e.message);
  }
  return { videos: await fromCurated(), source: "curated", error: errors.join("; ") || null };
}

/** Most-viewed uploads — API only (needs real view counts). */
export async function getPopularVideos() {
  if (!KEY) return [];
  try {
    const data = await api(
      "search",
      { part: "snippet", channelId: CHANNEL, order: "viewCount", type: "video", maxResults: "12" },
      6 * HOUR
    );
    const items = data.items || [];
    const details = await videoDetails(items.map((i) => i.id.videoId));
    return items.map((i) => normalize(i, details));
  } catch (e) {
    console.error("[youtube] popular:", e.message);
    return [];
  }
}

/** Public playlists — API only. */
export async function getPlaylists() {
  if (!KEY) return [];
  try {
    const data = await api("playlists", { part: "snippet,contentDetails", channelId: CHANNEL, maxResults: "24" }, 6 * HOUR);
    return (data.items || []).map((p) => ({
      id: p.id,
      title: p.snippet.title,
      count: p.contentDetails?.itemCount ?? null,
      thumbnail: p.snippet.thumbnails?.high?.url || p.snippet.thumbnails?.default?.url,
    }));
  } catch (e) {
    console.error("[youtube] playlists:", e.message);
    return [];
  }
}

export const youtubeStatus = () => ({ apiKey: Boolean(KEY), channelId: CHANNEL });
