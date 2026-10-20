export default function AdminLoading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-48 animate-pulse rounded-sm bg-black/5" />
      <div className="h-32 animate-pulse rounded-sm bg-black/5" />
      <div className="h-32 animate-pulse rounded-sm bg-black/5" />
    </div>
  );
}
