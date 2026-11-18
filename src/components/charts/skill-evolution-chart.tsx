"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SkillEvolutionPoint } from "@/lib/mock/market";
import { formatCompact, formatNumber } from "@/lib/format";
import { useLocale } from "@/components/i18n/locale-provider";
import {
  CHART_AXIS,
  CHART_GRID,
  CHART_PRIMARY,
  CHART_SUCCESS,
  TooltipRow,
  TooltipShell,
} from "@/components/charts/chart-tooltip";

export function SkillEvolutionChart({ data, height = 220 }: { data: SkillEvolutionPoint[]; height?: number }) {
  const { locale } = useLocale();
  const pt = locale === "pt";

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 6, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="evolution-demand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="evolution-supply" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_SUCCESS} stopOpacity={0.14} />
              <stop offset="100%" stopColor={CHART_SUCCESS} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_AXIS, fontSize: 10 }}
            interval="preserveStartEnd"
            minTickGap={14}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={40}
            tick={{ fill: CHART_AXIS, fontSize: 10 }}
            tickFormatter={(value: number) => formatCompact(value, locale)}
          />
          <Tooltip
            cursor={{ stroke: CHART_GRID }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <TooltipShell label={label}>
                  {payload.map((entry) => (
                    <TooltipRow
                      key={String(entry.dataKey)}
                      color={entry.dataKey === "demand" ? CHART_PRIMARY : CHART_SUCCESS}
                      label={
                        entry.dataKey === "demand"
                          ? pt
                            ? "Demanda"
                            : "Demand"
                          : pt
                            ? "Oferta de candidatos"
                            : "Candidate supply"
                      }
                      value={formatNumber(Number(entry.value), locale)}
                    />
                  ))}
                </TooltipShell>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="demand"
            name={pt ? "Demanda" : "Demand"}
            stroke={CHART_PRIMARY}
            strokeWidth={2}
            fill="url(#evolution-demand)"
          />
          <Area
            type="monotone"
            dataKey="supply"
            name={pt ? "Oferta de candidatos" : "Candidate supply"}
            stroke={CHART_SUCCESS}
            strokeWidth={1.6}
            fill="url(#evolution-supply)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
