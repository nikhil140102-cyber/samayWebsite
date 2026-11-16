import { z } from "zod";
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { FanSubmission } from "@/models";
import { dbUnavailable, fail, json, looksLikeSpam, rateLimit, readJson } from "@/lib/http";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  imageUrl: z.string().trim().url().refine((u) => u.startsWith("https://"), "Use an https link"),
  caption: z.string().trim().max(300).optional(),
  consent: z.literal(true, { message: "Please confirm you have the right to share this" }),
});

export async function POST(request) {
  if (!rateLimit(request, { key: "fan-sub", limit: 3, windowMs: 300_000 })) return fail("Too many submissions. Please wait a few minutes.", 429);
  const body = await readJson(request);
  if (!body) return fail("Invalid request body");
  if (looksLikeSpam(body)) return json({ ok: true, message: "Thanks! Your submission is in the review queue." });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Please check the form");
  if (!hasDatabase) return dbUnavailable();
  try {
    await connectDB();
    const { consent, ...rest } = parsed.data;
    await FanSubmission.create({ ...rest, consentAt: new Date() });
    return json({ ok: true, message: "Thanks! Your submission is in the review queue." });
  } catch (e) {
    console.error("[fan-submissions]", e);
    return fail("Could not save your submission right now.", 500);
  }
}
