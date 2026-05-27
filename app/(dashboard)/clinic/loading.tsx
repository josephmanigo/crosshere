import { StatSkeleton, CardSkeleton, ChartSkeleton } from "@/components/shared/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pt-2">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-muted/60 rounded-lg animate-pulse" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatSkeleton key={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/50 h-[300px] animate-pulse bg-muted/30" />
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}
