import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 p-6 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function StatSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 p-5 space-y-3", className)}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-border/50">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-border/30 last:border-0">
          <Skeleton className="size-8 rounded-full shrink-0" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 p-6 space-y-4", className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex items-end gap-2 h-40 pt-4">
        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 68].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
