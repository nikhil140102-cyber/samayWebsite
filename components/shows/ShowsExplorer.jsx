"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import ShowCard from "./ShowCard";

const monthKey = (iso) => iso.slice(0, 7);
const monthLabel = (key) =>
  new Date(key + "-01T00:00:00+05:30").toLocaleDateString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

export default function ShowsExplorer({ shows }) {
  const [city, setCity] = useState("All");
  const [month, setMonth] = useState("All");
  const [status, setStatus] = useState("upcoming");

  const cities = useMemo(() => ["All", ...new Set(shows.map((s) => s.city))], [shows]);
  const months = useMemo(() => ["All", ...new Set(shows.map((s) => monthKey(s.startDate)))].sort(), [shows]);

  const filtered = shows.filter(
    (s) =>
      (city === "All" || s.city === city) &&
      (month === "All" || monthKey(s.startDate) === month) &&
      (status === "all" ||
        (status === "upcoming" && s.phase === "upcoming") ||
        (status === "past" && s.phase === "past") ||
        (status === "on-sale" && s.phase === "upcoming" && s.status === "on-sale"))
  );

  return (
    <div>
      <div className="glass sticky top-24 z-20 mb-10 flex flex-col gap-3 rounded-3xl p-3 md:flex-row md:items-center">
        <span className="hidden md:flex items-center gap-2 pl-3 pr-1 text-sm text-muted">
          <SlidersHorizontal size={16} /> Filter
        </span>
        <label className="flex-1">
          <span className="sr-only">City</span>
          <select className="input !rounded-full" value={city} onChange={(e) => setCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All cities" : c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1">
          <span className="sr-only">Month</span>
          <select className="input !rounded-full" value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>
                {m === "All" ? "Any date" : monthLabel(m)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1">
          <span className="sr-only">Status</span>
          <select className="input !rounded-full" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="on-sale">On sale</option>
            <option value="past">Past shows</option>
            <option value="all">All shows</option>
          </select>
        </label>
      </div>

      <p className="mb-6 text-sm text-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "show" : "shows"}
      </p>

      {filtered.length ? (
        <motion.div layout className="grid gap-5 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((s) => (
              <motion.div
                layout
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
              >
                <ShowCard show={s} phase={s.phase} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <p className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">
          No shows match these filters.
        </p>
      )}
    </div>
  );
}
