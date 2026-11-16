import { getLatestVideos } from "@/lib/youtube";
import { json } from "@/lib/http";

export const revalidate = 1800;

export async function GET() {
  const { videos, source } = await getLatestVideos();
  return json({ ok: true, source, videos });
}
