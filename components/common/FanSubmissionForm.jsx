"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

/** Generic public form posting JSON to an API route, with honeypot + timing spam checks. */
export function useJsonForm(endpoint) {
  const [state, setState] = useState({ status: "idle", message: "" });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now(); // when the form became interactive (spam timing check)
  }, []);
  async function submit(e, transform = (b) => b) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = transform({ ...Object.fromEntries(fd.entries()), startedAt: startedAt.current }, fd);
    setState({ status: "loading", message: "" });
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setState({ status: "done", message: data.message });
      form.reset();
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  }
  return { state, submit };
}

export const Honeypot = () => (
  <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
);

export function FormStatus({ state, idle, icon: Icon = Send }) {
  return (
    <>
      {state.status === "error" && <p role="alert" className="text-sm text-accent">{state.message}</p>}
      <button className="btn btn-primary" disabled={state.status === "loading"}>
        {state.status === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />} {idle}
      </button>
    </>
  );
}

export function Success({ message }) {
  return (
    <p className="flex items-start gap-3 rounded-2xl border border-line bg-surface-2 p-5">
      <Check className="shrink-0 text-accent" /> {message}
    </p>
  );
}

export default function FanSubmissionForm() {
  const { state, submit } = useJsonForm("/api/fan-submissions");
  if (state.status === "done") return <Success message={state.message} />;
  return (
    <form onSubmit={(e) => submit(e, (b, fd) => ({ ...b, consent: fd.get("consent") === "on" }))} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="fs-name">Your name</label>
          <input id="fs-name" name="name" className="input" required maxLength={80} />
        </div>
        <div>
          <label className="label" htmlFor="fs-email">Email</label>
          <input id="fs-email" name="email" type="email" className="input" required />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="fs-url">Image link (Instagram post, Drive, Imgur…)</label>
        <input id="fs-url" name="imageUrl" type="url" className="input" required placeholder="https://" />
      </div>
      <div>
        <label className="label" htmlFor="fs-caption">Caption (optional)</label>
        <textarea id="fs-caption" name="caption" className="input min-h-24" maxLength={300} />
      </div>
      <Honeypot />
      <label className="flex items-start gap-2.5 text-xs text-muted leading-relaxed">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-[var(--accent)]" />
        I created this work (or have the right to share it) and allow SR Fan World to display it with credit. I accept
        the Privacy Policy.
      </label>
      <FormStatus state={state} idle="Submit for review" />
    </form>
  );
}
