import { revalidatePath } from "next/cache";
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { RESOURCES } from "@/lib/admin-fields";
import { MODELS, validate } from "@/lib/admin-registry";
import { dbUnavailable, fail, json, readJson } from "@/lib/http";

async function guard(request, resource, { write = false } = {}) {
  const def = RESOURCES[resource];
  if (!def) return { error: fail("Unknown resource", 404) };
  const session = await getSession(request, { role: def.adminOnly ? "admin" : undefined });
  if (!session) return { error: fail("Unauthorised", 401) };
  if (write && (def.readOnly || def.editOnly)) return { error: fail("This resource cannot be created here", 405) };
  if (!hasDatabase) return { error: dbUnavailable() };
  await connectDB();
  return { def, session, Model: MODELS[resource] };
}

export async function GET(request, { params }) {
  const { resource } = await params;
  const g = await guard(request, resource);
  if (g.error) return g.error;
  if (g.def.singleton) {
    const doc = await g.Model.findOne({ key: "home" }).lean();
    return json({ ok: true, item: doc });
  }
  const q = request.nextUrl.searchParams;
  const limit = Math.min(200, Number(q.get("limit")) || 100);
  const sortKey = resource === "shows" ? { startDate: 1 } : { createdAt: -1 };
  const items = await g.Model.find({}, resource === "subscribers" ? "-ipHash" : undefined).sort(sortKey).limit(limit).lean();
  const total = await g.Model.countDocuments();
  return json({ ok: true, items, total });
}

export async function POST(request, { params }) {
  const { resource } = await params;
  const g = await guard(request, resource, { write: true });
  if (g.error) return g.error;
  const body = (await readJson(request)) || {};
  const { data, error } = validate(resource, body, { partial: false });
  if (error) return fail(error, 422);
  try {
    let item;
    if (g.def.singleton) {
      for (const f of g.def.fields) if (body[f.name] === "") data[f.name] = ""; // explicit clear
      item = await g.Model.findOneAndUpdate({ key: "home" }, { $set: data }, { upsert: true, new: true });
    } else {
      item = await g.Model.create(data);
    }
    revalidatePath("/", "layout");
    return json({ ok: true, item }, 201);
  } catch (e) {
    if (e.code === 11000) return fail("An item with this slug/ID already exists.", 409);
    console.error(`[admin/${resource}]`, e);
    return fail("Could not save.", 500);
  }
}
