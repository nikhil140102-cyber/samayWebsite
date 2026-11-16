import { z } from "zod";
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { ContactMessage } from "@/models";
import { dbUnavailable, fail, json, looksLikeSpam, rateLimit, readJson } from "@/lib/http";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Message is too short").max(3000),
});

export async function POST(request) {
  if (!rateLimit(request, { key: "contact", limit: 3, windowMs: 60_000 })) return fail("Too many messages. Try again shortly.", 429);
  const body = await readJson(request);
  if (!body) return fail("Invalid request body");
  if (looksLikeSpam(body)) return json({ ok: true, message: "Thanks — your message has been received." });
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Please check the form");
  if (!hasDatabase) return dbUnavailable();
  try {
    await connectDB();
    await ContactMessage.create(parsed.data);
    return json({ ok: true, message: "Thanks — your message has been received. We'll reply by email." });
  } catch (e) {
    console.error("[contact]", e);
    return fail("Could not send your message right now.", 500);
  }
}
