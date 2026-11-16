import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default function AdminLogin() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent font-display font-bold text-white">SR</span>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted">SR Fan World</p>
        </div>
        <Suspense fallback={<div className="skeleton h-64 rounded-3xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
