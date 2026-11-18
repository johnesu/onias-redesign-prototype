import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)} {...props}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <Skeleton className="mt-6 h-8 w-32" />
      <Skeleton className="mt-3 h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("panel p-5", className)}>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-2 h-3 w-56" />
      <div className="mt-6 flex h-48 items-end gap-3">
        {[42, 58, 48, 66, 72, 84, 92, 88].map((height, index) => (
          <Skeleton key={index} className="w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-border p-5">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-2 h-3 w-64" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4 p-4">
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <Skeleton
                key={columnIndex}
                className={cn("h-4", columnIndex === 0 ? "w-1/3" : "flex-1")}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
