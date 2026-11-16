import "server-only";
import { z } from "zod";
import { RESOURCES } from "./admin-fields";
import { isDistrictUrl } from "./district";
import { slugify } from "./format";
import {
  AffiliateProduct, ContactMessage, FanSubmission, GalleryImage, Newsletter, Order, Product, Show, SiteContent, Video,
} from "@/models";

export const MODELS = {
  shows: Show,
  products: Product,
  videos: Video,
  gallery: GalleryImage,
  affiliate: AffiliateProduct,
  subscribers: Newsletter,
  submissions: FanSubmission,
  messages: ContactMessage,
  orders: Order,
  content: SiteContent,
};

const ytId = (v) => {
  const s = String(v || "").trim();
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : s;
};

const optionalEmpty = (schema) => z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());

function fieldSchema(f) {
  let s;
  switch (f.type) {
    case "number":
      s = z.coerce.number().min(0);
      break;
    case "boolean":
      s = z.coerce.boolean();
      break;
    case "url":
      s = z.string().trim().url().refine((u) => u.startsWith("https://"), "Must be an https URL");
      if (f.district) s = s.refine(isDistrictUrl, "Must be a district.in URL");
      break;
    case "date":
      s = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
      break;
    case "select":
      s = z.enum(f.options);
      break;
    case "list":
      s = z.preprocess(
        (v) => (Array.isArray(v) ? v : String(v || "").split("\n")).map((x) => String(x).trim()).filter(Boolean),
        z.array(z.string().max(500)).max(30)
      );
      break;
    case "image":
      s = z
        .string()
        .trim()
        .max(1_400_000, "Image is too large — use one under ~1 MB")
        .refine(
          (v) => v.startsWith("https://") || /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(v),
          "Must be an https image URL or an uploaded PNG/JPG/WebP"
        );
      break;
    case "youtube":
      s = z.preprocess(ytId, z.string().regex(/^[\w-]{11}$/, "Not a valid YouTube video ID"));
      break;
    case "textarea":
      s = z.string().trim().max(4000);
      break;
    default:
      s = z.string().trim().max(300);
  }
  if (f.required) return f.type === "boolean" || f.type === "number" ? s : s.refine((v) => v !== "", `${f.label} is required`);
  return optionalEmpty(s);
}

export function validate(resource, body, { partial = false } = {}) {
  const def = RESOURCES[resource];
  const shape = {};
  for (const f of def.fields) {
    if (f.type === "slug") continue;
    shape[f.name] = partial ? fieldSchema({ ...f, required: false }) : fieldSchema(f);
  }
  const result = z.object(shape).strip().safeParse(body || {});
  if (!result.success) {
    return { error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
  }
  const data = result.data;
  // derive slugs
  const slugField = def.fields.find((f) => f.type === "slug");
  if (slugField) {
    const provided = slugify(body?.slug || "");
    if (provided) data.slug = provided;
    else if (!partial) data.slug = slugify(slugField.from.map((k) => data[k]).filter(Boolean).join(" "));
  }
  // business rules
  if (resource === "products" && !partial && !data.concept && typeof data.price !== "number") {
    return { error: "Price is required unless the product is a concept design." };
  }
  if (resource === "products" && data.published && !data.concept && !data.licenseNote && !partial) {
    return { error: "A licence note is required before a product can be published." };
  }
  if (resource === "affiliate" && !partial && !data.asin && !data.query) {
    return { error: "Provide an ASIN or a search query." };
  }
  return { data };
}
