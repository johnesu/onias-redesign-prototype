import * as React from "react";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  action,
  children,
  footer,
  className,
  contentClassName,
  legend,
  id,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  legend?: { label: string; color: string; dashed?: boolean }[];
  id?: string;
}) {
  return (
    <section id={id} className={cn("flex flex-col rounded-lg border border-border bg-card shadow-card", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold leading-6 tracking-[-0.01em]">{title}</h2>
          {description && <p className="mt-0.5 text-[12.5px] leading-5 text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className={cn("flex-1 px-5 pb-5", contentClassName)}>{children}</div>
      {legend && legend.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-5 py-3">
          {legend.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.dashed ? "transparent" : item.color, border: item.dashed ? `1.5px dashed ${item.color}` : undefined }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
      {footer && <div className="border-t border-border px-5 py-3 text-[11.5px] leading-5 text-muted-foreground">{footer}</div>}
    </section>
  );
}
