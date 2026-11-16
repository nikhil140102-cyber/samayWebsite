"use client";

export default function Error({ error, reset }) {
  return (
    <section className="container-x grid min-h-[70vh] place-items-center pt-28 text-center">
      <div>
        <p className="eyebrow">Something broke</p>
        <h1 className="display mt-4 text-5xl md:text-6xl">Technical difficulties.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">An unexpected error happened while loading this page.</p>
        {error?.digest && <p className="mt-2 font-mono text-xs text-muted">Ref: {error.digest}</p>}
        <button onClick={reset} className="btn btn-primary mt-8">Try again</button>
      </div>
    </section>
  );
}
