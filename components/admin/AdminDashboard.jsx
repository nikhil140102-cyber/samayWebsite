"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Box, CalendarDays, ExternalLink, Film, Home, Image as ImageIcon, Inbox, Loader2, LogOut, Mail, Pencil,
  Plus, Receipt, Sparkles, Trash2, X,
} from "lucide-react";
import { RESOURCES } from "@/lib/admin-fields";
import { useTheme } from "@/components/common/Providers";

const ICONS = {
  content: Home, shows: CalendarDays, products: Box, videos: Film, gallery: ImageIcon, affiliate: Sparkles,
  subscribers: Mail, submissions: Bell, messages: Inbox, orders: Receipt,
};
const ORDER = ["content", "shows", "products", "videos", "gallery", "affiliate", "subscribers", "submissions", "messages", "orders"];

const toFormValue = (f, v) => {
  if (v === undefined || v === null) return f.type === "boolean" ? Boolean(f.default) : f.default ?? "";
  if (f.type === "list") return Array.isArray(v) ? v.join("\n") : v;
  return v;
};

/** Reads an image file, centre-crops it square and resizes to 320px WebP (data URL). */
function fileToSquareWebp(file, size = 320) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/webp", 0.9));
    };
    img.onerror = () => reject(new Error("Could not read that image"));
    img.src = url;
  });
}

function ImageField({ f, value, onChange }) {
  const [err, setErr] = useState("");
  const isData = typeof value === "string" && value.startsWith("data:");
  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return setErr("Use a PNG, JPG or WebP image.");
    setErr("");
    try {
      onChange(f.name, await fileToSquareWebp(file));
    } catch (x) {
      setErr(x.message);
    }
    e.target.value = "";
  }
  return (
    <div className="sm:col-span-2">
      <span className="label">{f.label}</span>
      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-surface-2 p-4">
        <span className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-accent font-display text-xl font-bold text-white ring-2 ring-accent ring-offset-2 ring-offset-[var(--surface-2)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Logo preview" className="h-full w-full object-cover" />
          ) : (
            "SR"
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <label className="btn btn-primary !py-2 cursor-pointer">
              Upload image
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
            </label>
            {value && (
              <button type="button" className="btn btn-ghost !py-2" onClick={() => onChange(f.name, "")}>
                Remove
              </button>
            )}
          </div>
          <input
            className="input"
            type="url"
            placeholder="…or paste an https:// image link"
            value={isData ? "" : value || ""}
            onChange={(e) => onChange(f.name, e.target.value)}
          />
          <p className="text-xs text-muted">
            Square images work best. Uploads are cropped to a centred square and resized to 320 px automatically.
            Click <strong>Save</strong> below to publish.
          </p>
          {err && <p role="alert" className="text-xs text-accent">{err}</p>}
        </div>
      </div>
    </div>
  );
}

function Field({ f, value, onChange }) {
  if (f.type === "image") return <ImageField f={f} value={value} onChange={onChange} />;
  const id = `f-${f.name}`;
  const common = { id, name: f.name, value: value ?? "", onChange: (e) => onChange(f.name, e.target.value), className: "input" };
  return (
    <div className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
      {f.type === "boolean" ? (
        <label className="flex items-center gap-3 pt-6">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(f.name, e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          <span className="text-sm">{f.label}</span>
        </label>
      ) : (
        <>
          <label className="label" htmlFor={id}>
            {f.label} {f.required && <span className="text-accent">*</span>}
          </label>
          {f.type === "select" ? (
            <select {...common}>
              <option value="">—</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : f.type === "textarea" || f.type === "list" ? (
            <textarea {...common} rows={f.type === "list" ? 3 : 4} />
          ) : (
            <input
              {...common}
              type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
              placeholder={f.type === "slug" ? "auto-generated if empty" : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}

function Editor({ resource, def, item, onClose, onSaved }) {
  const [values, setValues] = useState(() => Object.fromEntries(def.fields.map((f) => [f.name, toFormValue(f, item?.[f.name])])));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = item?._id && !def.singleton ? `/api/admin/${resource}/${item._id}` : `/api/admin/${resource}`;
    const res = await fetch(url, {
      method: item?._id && !def.singleton ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) return setError(data.error || "Save failed");
    onSaved();
  }

  return (
    <form onSubmit={save} className="card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">{item?._id ? "Edit" : "New"} — {def.label}</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-line" aria-label="Close editor">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {def.fields.map((f) => (
          <Field key={f.name} f={f} value={values[f.name]} onChange={set} />
        ))}
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-accent">{error}</p>}
      <div className="mt-6 flex gap-2">
        <button className="btn btn-primary" disabled={saving}>
          {saving && <Loader2 size={15} className="animate-spin" />} Save
        </button>
        {onClose && <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>}
      </div>
    </form>
  );
}

function ResourcePanel({ resource, role }) {
  const def = RESOURCES[resource];
  const [items, setItems] = useState(null);
  const [single, setSingle] = useState(undefined);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/${resource}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Failed to load");
    setError("");
    if (def.singleton) setSingle(data.item || {});
    else {
      setItems(data.items);
      setTotal(data.total);
    }
  }, [resource, def.singleton]);

  // The panel is keyed by tab, so it remounts with fresh state; just fetch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on mount; state is set after the request resolves
    load();
  }, [load]);

  async function remove(it) {
    if (!window.confirm(`Delete "${it[def.titleField] || it._id}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/${resource}/${it._id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return setError(data.error || "Delete failed");
    load();
  }

  function exportCsv() {
    const rows = [["email", "name", "consentAt", "source", "unsubscribed"], ...items.map((i) => [i.email, i.name || "", i.consentAt, i.source || "", i.unsubscribed])];
    const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "subscribers.csv";
    a.click();
  }

  const errorNote = error && <p className="mb-4 rounded-2xl border border-accent/40 bg-accent-soft p-4 text-sm">{error}</p>;
  // Singletons (Homepage) still show their editor so the uploader can be tried; saving reports the error.
  if (error && def.singleton)
    return (
      <>
        {errorNote}
        <Editor resource={resource} def={def} item={{}} onSaved={load} />
      </>
    );
  if (error) return errorNote;

  if (def.singleton) {
    if (single === undefined) return <Loader2 className="animate-spin" />;
    return <Editor resource={resource} def={def} item={single} onSaved={load} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{items ? `${total} total` : "Loading…"}</p>
        <div className="flex gap-2">
          {resource === "subscribers" && items?.length > 0 && (
            <button onClick={exportCsv} className="btn btn-ghost !py-2 text-sm">Export CSV</button>
          )}
          {!def.readOnly && !def.editOnly && (
            <button onClick={() => setEditing({})} className="btn btn-primary !py-2 text-sm">
              <Plus size={15} /> Add {def.label.toLowerCase()}
            </button>
          )}
        </div>
      </div>

      {editing && (
        <div className="mb-6">
          <Editor resource={resource} def={def} item={editing._id ? editing : null} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
        </div>
      )}

      {!items ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-muted">
          Nothing here yet.{" "}
          {["shows", "videos", "gallery", "affiliate"].includes(resource) && "The public site is showing the verified seed data from /data until you add items here."}
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line">
          {items.map((it) => (
            <li key={it._id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">
                  {it[def.titleField] || "(untitled)"}
                  {it.published === false && <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] uppercase text-muted">Draft</span>}
                </p>
                <p className="truncate text-xs text-muted">{def.subtitle?.(it)}</p>
              </div>
              {it.districtUrl && (
                <a href={it.districtUrl} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent" aria-label="Open District listing">
                  <ExternalLink size={16} />
                </a>
              )}
              {!def.readOnly && (
                <button onClick={() => setEditing(it)} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent" aria-label="Edit">
                  <Pencil size={14} />
                </button>
              )}
              {role === "admin" && resource !== "orders" && (
                <button onClick={() => remove(it)} className="grid h-9 w-9 place-items-center rounded-full border border-line hover:border-accent hover:text-accent" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminDashboard({ session, database }) {
  const router = useRouter();
  const { isDark, toggle } = useTheme();
  const tabs = useMemo(() => ORDER.filter((k) => !(RESOURCES[k].adminOnly && session.role !== "admin")), [session.role]);
  const [tab, setTab] = useState("shows");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-bg-soft p-4 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-sm font-bold text-white">SR</span>
          <div>
            <p className="font-display font-bold leading-none">Admin</p>
            <p className="text-xs text-muted">{session.role}</p>
          </div>
        </div>
        <nav className="mt-4 flex gap-1 overflow-x-auto md:flex-col" aria-label="Admin sections">
          {tabs.map((k) => {
            const Icon = ICONS[k];
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                aria-current={tab === k ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${tab === k ? "bg-accent text-white" : "hover:bg-surface-2"}`}
              >
                <Icon size={16} /> {RESOURCES[k].label}
              </button>
            );
          })}
        </nav>
        <div className="mt-6 hidden space-y-1 md:block">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2">
            <ExternalLink size={16} /> View site
          </a>
          <button onClick={toggle} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2">
            {isDark ? "☀︎" : "☾"} Theme
          </button>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-surface-2">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <section className="p-5 md:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Manage</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{RESOURCES[tab].label}</h1>
          </div>
          <span className="md:hidden">
            <button onClick={logout} className="btn btn-ghost !py-2" aria-label="Sign out">
              <LogOut size={15} />
            </button>
          </span>
        </div>
        {!database && (
          <p className="mb-6 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
            MongoDB is not connected, so changes can&apos;t be saved. Set MONGODB_URI.
          </p>
        )}
        {tab === "shows" && (
          <p className="mb-6 rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
            District has no public API. Copy each event&apos;s URL from district.in and only enter prices and dates you have
            checked on the live listing.
          </p>
        )}
        <ResourcePanel key={tab} resource={tab} role={session.role} />
      </section>
    </div>
  );
}
