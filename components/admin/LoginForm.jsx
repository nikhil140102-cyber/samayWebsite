"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setError(data.error || "Sign in failed");
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" required autoComplete="username" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="input" required autoComplete="current-password" />
      </div>
      {error && <p role="alert" className="text-sm text-accent">{error}</p>}
      <button className="btn btn-primary w-full" disabled={loading}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Sign in
      </button>
    </form>
  );
}
