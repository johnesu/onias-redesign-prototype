import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/ui/sparkline";
import { formatNumber } from "@/lib/format";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  footer,
  sparkline,
  tone = "primary",
  className,
  valueSuffix,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  footer?: React.ReactNode;
  sparkline?: number[];
  tone?: "primary" | "success" | "warning" | "navy" | "violet";
  className?: string;
  valueSuffix?: string;
}) {
  const iconTones = {
    primary: "bg-accent text-accent-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    navy: "bg-navy/[0.06] text-navy dark:bg-white/5 dark:text-white",
    violet: "bg-[hsl(258_60%_58%/0.1)] text-[hsl(258_60%_48%)] dark:text-[hsl(258_70%_72%)]",
  };
  const sparkTones = {
    primary: "primary",
    success: "success",
    warning: "warning",
    navy: "primary",
    violet: "primary",
  } as const;
  const isPositive = (trend ?? 0) > 0;
  const isNeutral = (trend ?? 0) === 0;

  return (
    <div className={cn("group relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-lift", className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">{label}</span>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", iconTones[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-4 flex items-end gap-1.5">
        <span className="metric text-[30px] font-semibold leading-none">{typeof value === "number" ? formatNumber(value) : value}</span>
        {valueSuffix && <span className="mb-0.5 text-xs font-medium text-muted-foreground">{valueSuffix}</span>}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        {trend !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              isNeutral
                ? "bg-muted text-muted-foreground"
                : isPositive
                  ? "bg-success-soft text-success"
                  : "bg-danger-soft text-danger",
            )}
          >
            {isNeutral ? <Minus className="size-2.5" /> : isPositive ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {trendLabel && <span className="text-[11px] text-muted-foreground">{trendLabel}</span>}
      </div>
      {sparkline && (
        <div className="mt-3 opacity-80 transition-opacity group-hover:opacity-100">
          <Sparkline data={sparkline} tone={sparkTones[tone]} className="h-6" />
        </div>
      )}
      {footer && <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">{footer}</div>}
    </div>
  );
}
