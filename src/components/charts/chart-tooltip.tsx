"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipShell({
  label,
  children,
  className,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-[148px] rounded-lg border border-border bg-popover p-2.5 text-popover-foreground shadow-lift",
        className,
      )}
    >
      {label !== undefined && (
        <p className="mb-1.5 border-b border-border pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function TooltipRow({
  color,
  label,
  value,
  dashed,
}: {
  color?: string;
  label: React.ReactNode;
  value: React.ReactNode;
  dashed?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[12px]">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {color && (
          <span
            className="size-2 rounded-full"
            style={{
              backgroundColor: dashed ? "transparent" : color,
              border: dashed ? `1.5px dashed ${color}` : undefined,
            }}
          />
        )}
        {label}
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export const CHART_GRID = "hsl(var(--border))";
export const CHART_AXIS = "hsl(var(--muted-foreground))";
export const CHART_PRIMARY = "hsl(var(--chart-1))";
export const CHART_SECONDARY = "hsl(var(--chart-2))";
export const CHART_SUCCESS = "hsl(var(--chart-3))";
export const CHART_WARNING = "hsl(var(--chart-4))";
export const CHART_VIOLET = "hsl(var(--chart-5))";
export const CHART_ROSE = "hsl(var(--chart-6))";
