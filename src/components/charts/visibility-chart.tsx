"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/format";
import { monthLabel, shortMonthLabel } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import {
  CHART_AXIS,
  CHART_GRID,
  CHART_PRIMARY,
  CHART_SECONDARY,
  TooltipRow,
  TooltipShell,
} from "@/components/charts/chart-tooltip";

export type VisibilityPoint = { month: string; views: number; appearances: number };

export function VisibilityChart({ data, height = 240 }: { data: VisibilityPoint[]; height?: number }) {
  const { locale } = useLocale();
  const pt = locale === "pt";

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 0, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_AXIS, fontSize: 10.5 }}
            tickFormatter={(value: string) => shortMonthLabel(value, locale)}
            dy={6}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            width={42}
            tick={{ fill: CHART_AXIS, fontSize: 10 }}
            allowDecimals={false}
          />
          <YAxis yAxisId="right" orientation="right" hide />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.55 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <TooltipShell label={monthLabel(String(label), locale)}>
                  <TooltipRow
                    color={CHART_PRIMARY}
                    label={pt ? "Visualizações do perfil" : "Profile views"}
                    value={formatNumber(Number(payload.find((p) => p.dataKey === "views")?.value ?? 0), locale)}
                  />
                  <TooltipRow
                    color={CHART_SECONDARY}
                    label={pt ? "Aparições em buscas" : "Search appearances"}
                    value={formatNumber(Number(payload.find((p) => p.dataKey === "appearances")?.value ?? 0), locale)}
                  />
                </TooltipShell>
              );
            }}
          />
          <Bar
            yAxisId="right"
            dataKey="appearances"
            name={pt ? "Aparições em buscas" : "Search appearances"}
            fill={CHART_SECONDARY}
            fillOpacity={0.22}
            radius={[5, 5, 0, 0]}
            maxBarSize={38}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="views"
            name={pt ? "Visualizações do perfil" : "Profile views"}
            stroke={CHART_PRIMARY}
            strokeWidth={2.2}
            dot={{ r: 3, fill: CHART_PRIMARY, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
