// Shown the instant a link is tapped, while the server renders the real page.
// Without it a tap looked like nothing had happened until the data arrived.
export default function PageSkeleton() {
  return (
    <div className="px-5 pt-safe" aria-busy="true" aria-label="Loading">
      <div className="py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-2 animate-pulse" />
        <div className="h-5 w-40 rounded-full bg-surface-2 animate-pulse" />
      </div>
      <div className="mt-2 h-44 rounded-3xl bg-surface border border-line animate-pulse" />
      <div className="mt-3 h-20 rounded-3xl bg-surface border border-line animate-pulse" />
      <div className="mt-3 h-20 rounded-3xl bg-surface border border-line animate-pulse" />
      <div className="mt-3 h-20 rounded-3xl bg-surface border border-line animate-pulse" />
    </div>
  );
}
