"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyPoint } from "@/types";
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

export function MarketTrendChart({
  data,
  height = 280,
  showCandidates = true,
  compact = false,
}: {
  data: MonthlyPoint[];
  height?: number;
  showCandidates?: boolean;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const pt = locale === "pt";

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 4, left: compact ? -18 : -6, bottom: 0 }}>
          <defs>
            <linearGradient id="vacancy-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.24} />
              <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_AXIS, fontSize: compact ? 9.5 : 10.5 }}
            interval={compact ? "preserveStartEnd" : 0}
            minTickGap={12}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={compact ? 36 : 44}
            tick={{ fill: CHART_AXIS, fontSize: 10 }}
            tickFormatter={(value: number) => formatCompact(value, locale)}
          />
          <Tooltip
            cursor={{ stroke: CHART_GRID, strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <TooltipShell label={label}>
                  {payload.map((entry) => (
                    <TooltipRow
                      key={String(entry.dataKey)}
                      color={entry.dataKey === "vacancies" ? CHART_PRIMARY : CHART_SUCCESS}
                      dashed={entry.dataKey === "candidates"}
                      label={
                        entry.dataKey === "vacancies"
                          ? pt
                            ? "Vagas"
                            : "Vacancies"
                          : pt
                            ? "Candidatos"
                            : "Candidate pool"
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
            dataKey="vacancies"
            name={pt ? "Vagas" : "Vacancies"}
            stroke={CHART_PRIMARY}
            strokeWidth={2.2}
            fill="url(#vacancy-fill)"
            activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
          />
          {showCandidates && (
            <Line
              type="monotone"
              dataKey="candidates"
              name={pt ? "Candidatos" : "Candidate pool"}
              stroke={CHART_SUCCESS}
              strokeWidth={1.6}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 3.5 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
