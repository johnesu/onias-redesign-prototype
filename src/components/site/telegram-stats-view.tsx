"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Banknote, BriefcaseBusiness, Radio, TrendingUp, Users, Wifi } from "lucide-react";
import type { MarketFilters, SeniorityFilter, WorkModelFilter } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { MarketTrendChart } from "@/components/charts/market-trend-chart";
import { RegionBarChart } from "@/components/charts/region-chart";
import { SeniorityDonut } from "@/components/charts/seniority-donut";
import { MARKET_SOURCES, HIRING_COMPANIES } from "@/data/mock-market-extra";
import { getMarketSnapshot } from "@/lib/mock/market";
import { ALL_MONTHS, DEFAULT_FILTERS, REGIONS, monthLabel, regionName, seniorityLabel, workModelLabel } from "@/lib/months";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";

const MONTH_OPTIONS = [...ALL_MONTHS].reverse().slice(0, 13);

export function TelegramStatsView() {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const [filters, setFilters] = React.useState<MarketFilters>(DEFAULT_FILTERS);

  const snapshot = React.useMemo(() => getMarketSnapshot(filters, locale), [filters, locale]);

  const update = <K extends keyof MarketFilters>(key: K, value: MarketFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const stats = [
    {
      label: pt ? "Vagas abertas" : "Open roles",
      value: formatNumber(snapshot.vacancies, locale),
      hint: `${formatPercent(snapshot.vacancyTrend, 1, locale)} ${pt ? "vs. mês anterior" : "vs. previous month"}`,
      icon: BriefcaseBusiness,
    },
    {
      label: pt ? "Habilidades monitoradas" : "Skills tracked",
      value: formatNumber(snapshot.skillsTracked, locale),
      hint: `${snapshot.newSkills} ${pt ? "novas neste mês" : "new this month"}`,
      icon: TrendingUp,
    },
    {
      label: pt ? "Salário mediano" : "Median salary",
      value: formatCurrency(snapshot.medianSalary, locale),
      hint: pt ? "Mensal, bruto CLT" : "Monthly, gross CLT",
      icon: Banknote,
    },
    {
      label: pt ? "Candidatos ativos" : "Active candidates",
      value: formatCompact(snapshot.candidatePool, locale),
      hint: `${snapshot.activeRecruiters} ${pt ? "recrutadores" : "recruiters"}`,
      icon: Users,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8 sm:py-12">
          <nav className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">
              {pt ? "Início" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/estatisticas/telegram" className="hover:text-foreground">
              {copy.nav.stats}
            </Link>
            <span>/</span>
            <span className="text-foreground">{copy.nav.telegram}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {copy.nav.telegram}
                </h1>
                <Badge variant="accent">{pt ? "Público" : "Public"}</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "Volume, fontes e geografia das vagas que passam por grupos públicos do Telegram. Todos os números são recalculados a partir do snapshot fictício de novembro de 2026."
                  : "Volume, sources and geography of the roles flowing through public Telegram groups. Every figure is recomputed from the fictional November 2026 snapshot."}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-canvas px-3 py-2 text-[10px] leading-5 text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatNumber(snapshot.skillsTracked, locale)} {pt ? "conceitos monitorados" : "concepts tracked"}
              </span>
              <br />
              {pt ? "26 amostrados neste protótipo" : "26 sampled in this prototype"}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-6 sm:px-8">
        <div className="sticky top-[68px] z-20 -mx-1 mb-5 rounded-xl border border-border bg-card/95 p-3 shadow-card backdrop-blur">
          <div className="flex flex-wrap items-end gap-2.5">
            <label className="min-w-[136px] flex-1">
              <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {copy.common.month}
              </span>
              <Select value={filters.month} onChange={(event) => update("month", event.target.value)} sizeVariant="sm" aria-label={copy.common.month}>
                {MONTH_OPTIONS.map((month) => (
                  <option key={month.key} value={month.key}>
                    {monthLabel(month.key, locale)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="min-w-[136px] flex-1">
              <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {copy.common.region}
              </span>
              <Select value={filters.region} onChange={(event) => update("region", event.target.value)} sizeVariant="sm" aria-label={copy.common.region}>
                <option value="all">{copy.common.allRegions}</option>
                {REGIONS.map((region) => (
                  <option key={region.slug} value={region.slug}>
                    {regionName(region.slug, locale)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="min-w-[136px] flex-1">
              <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {copy.common.seniority}
              </span>
              <Select
                value={filters.seniority}
                onChange={(event) => update("seniority", event.target.value as SeniorityFilter)}
                sizeVariant="sm"
                aria-label={copy.common.seniority}
              >
                <option value="all">{copy.common.allSeniorities}</option>
                {(["junior", "pleno", "senior", "especialista"] as const).map((value) => (
                  <option key={value} value={value}>
                    {seniorityLabel(value, locale)}
                  </option>
                ))}
              </Select>
            </label>
            <label className="min-w-[136px] flex-1">
              <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {copy.common.workModel}
              </span>
              <Select
                value={filters.workModel}
                onChange={(event) => update("workModel", event.target.value as WorkModelFilter)}
                sizeVariant="sm"
                aria-label={copy.common.workModel}
              >
                <option value="all">{copy.common.allModels}</option>
                {(["remote", "hybrid", "onsite"] as const).map((value) => (
                  <option key={value} value={value}>
                    {workModelLabel(value, locale)}
                  </option>
                ))}
              </Select>
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="shrink-0 text-[11.5px]"
            >
              {copy.common.reset}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  <Icon className="size-3.5" /> {item.label}
                </div>
                <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.035em] tabular-nums">{item.value}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{item.hint}</p>
              </div>
            );
          })}
        </div>

        <section className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-semibold">{pt ? "Evolução das vagas" : "Role volume over time"}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {pt ? "Doze meses até" : "Twelve months to"} {monthLabel(filters.month, locale)} · {regionName(filters.region, locale)}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-chart-1" /> {pt ? "Vagas" : "Roles"}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border border-dashed border-chart-3" /> {pt ? "Candidatos" : "Candidates"}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <MarketTrendChart data={snapshot.monthly} height={264} />
          </div>
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <section id="fontes" className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-5">
              <div>
                <h2 className="text-[14px] font-semibold">{pt ? "De onde vêm os sinais" : "Where the signals come from"}</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt ? "Grupos públicos monitorados neste snapshot" : "Public groups tracked in this snapshot"}
                </p>
              </div>
              <Badge variant="muted">
                {MARKET_SOURCES.length} {pt ? "grupos" : "groups"}
              </Badge>
            </div>
            <div className="divide-y divide-border">
              {MARKET_SOURCES.map((source) => (
                <div key={source.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#2AABEE]/12 text-[#1D8FC7]">
                    <Radio className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold">{source.channel}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{source.focus[locale]}</p>
                  </div>
                  <div className="hidden w-24 sm:block">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(source.share / MARKET_SOURCES[0].share) * 100}%` }} />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <p className="text-[11px] font-semibold tabular-nums">{source.share.toFixed(1)}%</p>
                    <p className="text-[9px] text-muted-foreground tabular-nums">{formatCompact(source.signal, locale)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border bg-muted/30 px-5 py-2.5 text-[10px] text-muted-foreground">
              {pt
                ? "Canais, membros e volumes são fictícios."
                : "Channels, members and volumes are fictional."}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border p-5">
              <h2 className="text-[14px] font-semibold">{pt ? "Vagas por região" : "Roles by region"}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {pt ? "Participação no total monitorado" : "Share of the tracked total"}
              </p>
            </div>
            <div className="p-5">
              <RegionBarChart data={snapshot.regions.slice(0, 8)} height={258} />
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[10.5px] text-muted-foreground">
              <span>
                {pt ? "Maior mercado" : "Largest market"}: {regionName(snapshot.regions[0]?.slug ?? "sao-paulo", locale)}
              </span>
              <Link href="/vagas" className="font-semibold text-primary hover:underline">
                {pt ? "Ver vagas" : "See roles"}
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-xl border border-border bg-card shadow-card">
            <div className="border-b border-border p-5">
              <h2 className="text-[14px] font-semibold">{pt ? "Senioridade" : "Seniority"}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {pt ? "Distribuição das vagas por nível" : "Distribution of roles by level"}
              </p>
            </div>
            <div className="p-5">
              <SeniorityDonut data={snapshot.senioritySplit} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-5">
              <div>
                <h2 className="text-[14px] font-semibold">{pt ? "Empresas contratando" : "Companies hiring"}</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt ? "Maiores volumes neste snapshot" : "Largest volumes in this snapshot"}
                </p>
              </div>
              <Badge variant="accent">{copy.common.fictional}</Badge>
            </div>
            <div className="divide-y divide-border">
              {HIRING_COMPANIES.map((company) => (
                <div key={company.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy text-[10px] font-semibold text-white">
                    {company.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold">{company.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{company.interval[locale]}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {company.openRoles} {pt ? "vagas" : "roles"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-card px-5 py-4">
          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Wifi className="size-3.5 text-primary" />
            {pt
              ? "Métricas determinísticas geradas localmente. Nenhum dado real do Telegram é acessado."
              : "Deterministic metrics generated locally. No real Telegram data is accessed."}
          </p>
          <Link href="/estatisticas/oferta-demanda" className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-primary hover:underline">
            {pt ? "Ver oferta × demanda" : "See supply × demand"} <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: pt ? "Índice de demanda" : "Demand index", value: `${snapshot.topSkillIndex}/100`, icon: TrendingUp },
            { label: pt ? "Ritmo de contratação" : "Market pace", value: `${snapshot.marketPace} ${pt ? "dias" : "days"}`, icon: BriefcaseBusiness },
            { label: pt ? "Participação remota" : "Remote share", value: `${snapshot.remoteShare}%`, icon: Wifi },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</p>
                  <p className="text-[15px] font-semibold tabular-nums">{item.value}</p>
                </div>
                <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
