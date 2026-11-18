"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { SeniorityPoint } from "@/types";
import { formatNumber } from "@/lib/format";
import { useLocale } from "@/components/i18n/locale-provider";
import {
  CHART_PRIMARY,
  CHART_ROSE,
  CHART_SUCCESS,
  CHART_WARNING,
  TooltipRow,
  TooltipShell,
} from "@/components/charts/chart-tooltip";

const COLORS = [CHART_PRIMARY, CHART_SUCCESS, CHART_WARNING, CHART_ROSE];

export function SeniorityDonut({ data, height = 190 }: { data: SeniorityPoint[]; height?: number }) {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const total = data.reduce((sum, point) => sum + point.vacancies, 0);
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative mx-auto w-full max-w-[210px] shrink-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="vacancies"
              nameKey="label"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={2}
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((point, index) => (
                <Cell key={point.seniority} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as SeniorityPoint;
                return (
                  <TooltipShell label={point.label}>
                    <TooltipRow color={payload[0].color} label={pt ? "Vagas" : "Roles"} value={formatNumber(point.vacancies, locale)} />
                    <TooltipRow label={pt ? "Participação" : "Share"} value={`${point.share.toFixed(0)}%`} />
                  </TooltipShell>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="metric text-[22px] font-semibold leading-none">{formatNumber(total, locale)}</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {pt ? "vagas" : "roles"}
          </span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2.5">
        {data.map((point, index) => (
          <li key={point.seniority} className="flex items-center gap-2.5 text-[12.5px]">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="flex-1 font-medium">{point.label}</span>
            <span className="tabular-nums font-semibold">{point.share.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
