import * as React from "react";
import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  tone = "primary",
  className,
  fill = true,
  strokeWidth = 1.8,
}: {
  data: number[];
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
  className?: string;
  fill?: boolean;
  strokeWidth?: number;
}) {
  const colors = {
    primary: "hsl(var(--primary))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
    danger: "hsl(var(--danger))",
    muted: "hsl(var(--muted-foreground))",
  };
  const values = data.length > 1 ? data : [1, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 30 - ((value - min) / range) * 26 - 2;
    return `${x},${y}`;
  });
  const id = `spark-${tone}-${Math.round(values.reduce((sum, value) => sum + value, 0))}`;
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={cn("h-8 w-full overflow-visible", className)} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colors[tone]} stopOpacity="0.16" />
          <stop offset="100%" stopColor={colors[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <polygon points={`0,32 ${points.join(" ")} 100,32`} fill={`url(#${id})`} />}
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={colors[tone]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
