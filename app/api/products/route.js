import { getProducts } from "@/lib/data";
import { json } from "@/lib/http";

export const revalidate = 300;

export async function GET() {
  return json({ ok: true, products: await getProducts() });
}
