import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[80vh] place-items-center pt-28 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 text-[clamp(3.2rem,11vw,8rem)]">
          Blun<span className="text-accent">der.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">This page doesn&apos;t exist. Even Stockfish couldn&apos;t find it.</p>
        <Link href="/" className="btn btn-primary mt-8">Back to the board</Link>
      </div>
    </section>
  );
}
