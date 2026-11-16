export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-label="Loading">
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/40" />
        <span className="absolute inset-3 rounded-full bg-accent" />
      </div>
    </div>
  );
}
