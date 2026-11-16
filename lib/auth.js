// Admin session handling: signed JWT in an httpOnly cookie (jose works in Node & proxy).
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "sr_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

export const authConfigured = () => Boolean(secret());

export async function createSession(admin) {
  const key = secret();
  if (!key) throw new Error("AUTH_SECRET must be set (32+ characters)");
  return new SignJWT({ email: admin.email, role: admin.role, name: admin.name || "" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin._id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key);
}

export async function verifySession(token) {
  const key = secret();
  if (!key || !token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookie(token) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  };
}

/** Route-handler guard. Returns the session or null. `role: "admin"` requires full admin. */
export async function getSession(request, { role } = {}) {
  const token = request.cookies.get(COOKIE)?.value;
  const session = await verifySession(token);
  if (!session) return null;
  if (role === "admin" && session.role !== "admin") return null;
  return session;
}
