"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RegionPoint } from "@/types";
import { formatCompact, formatNumber } from "@/lib/format";
import { regionName } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import { CHART_AXIS, CHART_PRIMARY, TooltipRow, TooltipShell } from "@/components/charts/chart-tooltip";

export function RegionBarChart({ data, height = 300 }: { data: RegionPoint[]; height?: number }) {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const chartData = data.map((point) => ({ ...point, displayName: regionName(point.slug, locale) }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 12, left: 4, bottom: 0 }} barCategoryGap={8}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="displayName"
            axisLine={false}
            tickLine={false}
            width={104}
            tick={{ fill: CHART_AXIS, fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.6 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as RegionPoint;
              return (
                <TooltipShell label={`${regionName(point.slug, locale)}, ${point.state}`}>
                  <TooltipRow color={CHART_PRIMARY} label={pt ? "Vagas" : "Roles"} value={formatNumber(point.vacancies, locale)} />
                  <TooltipRow label={pt ? "Fatia do mercado" : "Share of market"} value={`${point.share.toFixed(1)}%`} />
                  <TooltipRow label={pt ? "Índice de demanda" : "Demand index"} value={`${point.demandIndex}/100`} />
                </TooltipShell>
              );
            }}
          />
          <Bar dataKey="vacancies" radius={[0, 5, 5, 0]} maxBarSize={16}>
            {data.map((point, index) => (
              <Cell key={point.slug} fill={CHART_PRIMARY} fillOpacity={1 - index * 0.055} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegionShareList({ data }: { data: RegionPoint[] }) {
  const { locale } = useLocale();
  const max = Math.max(...data.map((point) => point.vacancies), 1);
  return (
    <ul className="space-y-3">
      {data.map((point) => (
        <li key={point.slug}>
          <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
            <span className="font-medium">
              {regionName(point.slug, locale)} <span className="text-muted-foreground">· {point.state}</span>
            </span>
            <span className="tabular-nums text-muted-foreground">{formatCompact(point.vacancies, locale)}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max(4, (point.vacancies / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
