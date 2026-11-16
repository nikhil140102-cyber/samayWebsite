import { getSession } from "@/lib/auth";
import { fail, json } from "@/lib/http";

export async function GET(request) {
  const s = await getSession(request);
  if (!s) return fail("Not signed in", 401);
  return json({ ok: true, email: s.email, role: s.role, name: s.name });
}
