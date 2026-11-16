export const inr = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)
    : "";

export function formatDate(iso, opts = { day: "numeric", month: "short", year: "numeric" }) {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? iso + "T00:00:00+05:30" : iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { ...opts, timeZone: "Asia/Kolkata" });
}

export function compactNumber(n) {
  if (typeof n !== "number") return "";
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export const slugify = (s = "") =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
