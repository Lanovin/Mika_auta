export function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-soft">
      <div className="h-52 w-full animate-pulse bg-slate-200"></div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200"></div>
          <div className="mt-1 h-5 w-32 animate-pulse rounded bg-slate-200"></div>
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200"></div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200"></div>
          <div className="h-6 w-18 animate-pulse rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}