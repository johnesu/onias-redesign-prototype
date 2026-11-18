"use client";

import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { SkillDemand } from "@/types";
import { formatCompact, formatNumber } from "@/lib/format";
import { categoryName, skillName } from "@/lib/market-labels";
import { useLocale } from "@/components/i18n/locale-provider";
import {
  CHART_AXIS,
  CHART_GRID,
  CHART_PRIMARY,
  CHART_WARNING,
  TooltipRow,
  TooltipShell,
} from "@/components/charts/chart-tooltip";

export function SupplyDemandScatter({ data, height = 340 }: { data: SkillDemand[]; height?: number }) {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const medianSupply = [...data].sort((a, b) => a.supply - b.supply)[Math.floor(data.length / 2)]?.supply ?? 0;
  const medianDemand = [...data].sort((a, b) => a.demand - b.demand)[Math.floor(data.length / 2)]?.demand ?? 0;
  const chartData = data.map((skill) => ({ ...skill, gap: skill.demand - skill.supply }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 14, left: -8, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
          <XAxis
            type="number"
            dataKey="supply"
            name={pt ? "Oferta de candidatos" : "Candidate supply"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_AXIS, fontSize: 10 }}
            tickFormatter={(value: number) => formatCompact(value, locale)}
            domain={[0, "dataMax + 1200"]}
          />
          <YAxis
            type="number"
            dataKey="demand"
            name={pt ? "Demanda" : "Vacancy demand"}
            axisLine={false}
            tickLine={false}
            width={46}
            tick={{ fill: CHART_AXIS, fontSize: 10 }}
            tickFormatter={(value: number) => formatCompact(value, locale)}
            domain={[0, "dataMax + 1200"]}
          />
          <ZAxis type="number" dataKey="demand" range={[45, 190]} />
          <ReferenceLine x={medianSupply} stroke={CHART_GRID} strokeDasharray="4 4" />
          <ReferenceLine y={medianDemand} stroke={CHART_GRID} strokeDasharray="4 4" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const skill = payload[0].payload as SkillDemand & { gap: number };
              return (
                <TooltipShell label={categoryName(skill.category, locale)}>
                  <p className="mb-1 text-[12.5px] font-semibold">{skillName(skill.skill, locale)}</p>
                  <TooltipRow color={CHART_PRIMARY} label={pt ? "Demanda" : "Demand"} value={formatNumber(skill.demand, locale)} />
                  <TooltipRow color={CHART_WARNING} label={pt ? "Oferta" : "Supply"} value={formatNumber(skill.supply, locale)} />
                  <TooltipRow
                    label={pt ? "Lacuna" : "Gap"}
                    value={`${skill.gap > 0 ? "+" : ""}${formatNumber(skill.gap, locale)}`}
                  />
                </TooltipShell>
              );
            }}
          />
          <Scatter
            data={chartData}
            fill={CHART_PRIMARY}
            fillOpacity={0.62}
            stroke={CHART_PRIMARY}
            strokeOpacity={0.9}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
