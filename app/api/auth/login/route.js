import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { Admin } from "@/models";
import { authConfigured, createSession, sessionCookie } from "@/lib/auth";
import { fail, json, rateLimit, readJson } from "@/lib/http";

const schema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) });

// Constant-time-ish dummy hash so unknown emails take as long as wrong passwords.
const DUMMY = bcrypt.hashSync("timing-equaliser-not-a-password", 10);

export async function POST(request) {
  if (!rateLimit(request, { key: "login", limit: 5, windowMs: 15 * 60_000 })) {
    return fail("Too many login attempts. Try again in 15 minutes.", 429);
  }
  if (!authConfigured()) {
    return fail("Admin is not configured. Set AUTH_SECRET (32+ characters) in .env.local.", 503);
  }
  const parsed = schema.safeParse(await readJson(request));
  if (!parsed.success) return fail("Invalid email or password.", 401);

  // 1) Owner account from environment variables (works with or without MongoDB).
  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD || "";
  if (envEmail && envPass.length >= 12 && parsed.data.email === envEmail) {
    const a = crypto.createHash("sha256").update(parsed.data.password).digest();
    const b = crypto.createHash("sha256").update(envPass).digest();
    if (!crypto.timingSafeEqual(a, b)) return fail("Invalid email or password.", 401);
    const token = await createSession({ _id: "env-owner", email: envEmail, role: "admin", name: "Owner" });
    const res = json({ ok: true, role: "admin" });
    res.cookies.set(sessionCookie(token));
    return res;
  }

  // 2) Admin users stored in MongoDB (created with `npm run create-admin`).
  if (!hasDatabase) {
    return fail("Invalid email or password.", 401);
  }

  await connectDB();
  const admin = await Admin.findOne({ email: parsed.data.email });
  const ok = await bcrypt.compare(parsed.data.password, admin?.passwordHash || DUMMY);
  if (!admin || !ok) return fail("Invalid email or password.", 401);

  admin.lastLoginAt = new Date();
  await admin.save();
  const token = await createSession(admin);
  const res = json({ ok: true, role: admin.role });
  res.cookies.set(sessionCookie(token));
  return res;
}
