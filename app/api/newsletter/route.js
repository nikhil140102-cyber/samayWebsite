import { z } from "zod";
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { Newsletter } from "@/models";
import { clientIp, dbUnavailable, fail, hashIp, json, looksLikeSpam, rateLimit, readJson } from "@/lib/http";

const CONSENT_TEXT =
  "I agree to receive the SR Fan World newsletter and accept the Privacy Policy. I can unsubscribe anytime.";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  name: z.string().trim().max(80).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Consent is required" }),
  source: z.string().max(30).optional(),
});

export async function POST(request) {
  if (!rateLimit(request, { key: "newsletter", limit: 5, windowMs: 60_000 })) {
    return fail("Too many attempts. Please try again in a minute.", 429);
  }
  const body = await readJson(request);
  if (!body) return fail("Invalid request body");
  if (looksLikeSpam(body)) return json({ ok: true, message: "Thanks! You're on the list." }); // silently drop bots
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message || "Please enter a valid email");
  if (!hasDatabase) return dbUnavailable();

  try {
    await connectDB();
    const { email, name, source } = parsed.data;
    await Newsletter.updateOne(
      { email },
      {
        $set: { name: name || undefined, unsubscribed: false, source, consentAt: new Date(), consentText: CONSENT_TEXT, ipHash: hashIp(clientIp(request)) },
      },
      { upsert: true }
    );
    return json({ ok: true, message: "Thanks! You're on the list." });
  } catch (e) {
    console.error("[newsletter]", e);
    return fail("Could not subscribe right now. Please try again later.", 500);
  }
}
