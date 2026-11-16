import { getShows, showPhase } from "@/lib/data";
import { json } from "@/lib/http";

export const revalidate = 600;

export async function GET() {
  const shows = (await getShows()).map((s) => ({ ...s, phase: showPhase(s) }));
  return json({ ok: true, shows });
}
