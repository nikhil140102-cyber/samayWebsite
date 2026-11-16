import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { connectDB, hasDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { RESOURCES } from "@/lib/admin-fields";
import { MODELS, validate } from "@/lib/admin-registry";
import { dbUnavailable, fail, json, readJson } from "@/lib/http";

async function guard(request, params, role) {
  const { resource, id } = await params;
  const def = RESOURCES[resource];
  if (!def || def.singleton) return { error: fail("Unknown resource", 404) };
  if (!mongoose.isValidObjectId(id)) return { error: fail("Invalid id", 400) };
  const session = await getSession(request, { role: role || (def.adminOnly ? "admin" : undefined) });
  if (!session) return { error: fail(role === "admin" ? "Only admins can do this" : "Unauthorised", 401) };
  if (!hasDatabase) return { error: dbUnavailable() };
  await connectDB();
  return { resource, id, def, Model: MODELS[resource] };
}

export async function PATCH(request, { params }) {
  const g = await guard(request, params);
  if (g.error) return g.error;
  if (g.def.readOnly) return fail("Read-only resource", 405);
  const body = await readJson(request);
  const { data, error } = validate(g.resource, body, { partial: true });
  if (error) return fail(error, 422);
  // Only touch fields that were actually sent.
  const update = Object.fromEntries(Object.entries(data).filter(([k]) => body && k in body));
  if (g.resource === "products" && update.published) {
    const current = await g.Model.findById(g.id).lean();
    if (!(update.licenseNote ?? current?.licenseNote)) return fail("Add a licence note before publishing.", 422);
  }
  try {
    const item = await g.Model.findByIdAndUpdate(g.id, { $set: update }, { new: true, runValidators: true });
    if (!item) return fail("Not found", 404);
    revalidatePath("/", "layout");
    return json({ ok: true, item });
  } catch (e) {
    if (e.code === 11000) return fail("Slug/ID already in use.", 409);
    console.error(`[admin/${g.resource}]`, e);
    return fail("Could not update.", 500);
  }
}

export async function DELETE(request, { params }) {
  // Deleting is restricted to the "admin" role; editors can create and edit only.
  const g = await guard(request, params, "admin");
  if (g.error) return g.error;
  if (g.resource === "orders") return fail("Orders cannot be deleted — refund them in Razorpay instead.", 405);
  const res = await g.Model.findByIdAndDelete(g.id);
  if (!res) return fail("Not found", 404);
  revalidatePath("/", "layout");
  return json({ ok: true });
}
