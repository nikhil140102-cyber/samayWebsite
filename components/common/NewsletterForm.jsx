"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export const CONSENT_TEXT =
  "I agree to receive the SR Fan World newsletter and accept the Privacy Policy. I can unsubscribe anytime.";

export default function NewsletterForm({ compact = false, source = "site" }) {
  const [state, setState] = useState({ status: "idle", message: "" });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now(); // when the form became interactive (spam timing check)
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    body.consent = fd.get("consent") === "on";
    body.startedAt = startedAt.current;
    body.source = source;
    if (!body.consent) return setState({ status: "error", message: "Please tick the consent box." });
    setState({ status: "loading", message: "" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState({ status: "done", message: data.message });
      e.target.reset();
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  }

  if (state.status === "done") {
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
        <Check size={16} className="text-accent" /> {state.message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      {!compact && (
        <div>
          <label htmlFor={`nl-name-${source}`} className="label">
            Name (optional)
          </label>
          <input id={`nl-name-${source}`} name="name" className="input" autoComplete="name" maxLength={80} />
        </div>
      )}
      <div className="flex gap-2">
        <label htmlFor={`nl-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-email-${source}`}
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          autoComplete="email"
          className="input"
        />
        <button className="btn btn-primary shrink-0 !px-4" disabled={state.status === "loading"} aria-label="Subscribe">
          {state.status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
          {!compact && <span>Subscribe</span>}
        </button>
      </div>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex items-start gap-2.5 text-xs text-muted leading-relaxed cursor-pointer">
        <input type="checkbox" name="consent" className="mt-0.5 accent-[var(--accent)]" required />
        <span>{CONSENT_TEXT}</span>
      </label>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-accent">
          {state.message}
        </p>
      )}
    </form>
  );
}
