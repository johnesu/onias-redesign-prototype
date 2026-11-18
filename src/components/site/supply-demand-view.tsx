"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Layers3, Search, Sparkles, TrendingUp } from "lucide-react";
import type { MarketFilters, SeniorityFilter, SkillDemand } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SkillEvolutionChart } from "@/components/charts/skill-evolution-chart";
import { SupplyDemandScatter } from "@/components/charts/supply-demand-scatter";
import { getMarketSnapshot, getSkillEvolution } from "@/lib/mock/market";
import { getProfile } from "@/lib/mock-api";
import { ALL_MONTHS, DEFAULT_FILTERS, REGIONS, monthLabel, regionName, seniorityLabel } from "@/lib/months";
import { categoryName, skillName, SKILL_CATEGORY_ORDER } from "@/lib/market-labels";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

type SortKey = "demand" | "gap" | "trend" | "salary";

const MONTH_OPTIONS = [...ALL_MONTHS].reverse().slice(0, 13);

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function SupplyDemandView() {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);

  const [filters, setFilters] = React.useState<MarketFilters>(DEFAULT_FILTERS);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState<SortKey>("demand");
  const [selected, setSelected] = React.useState<SkillDemand | null>(null);
  const [profile] = React.useState(() => getProfile());

  const snapshot = React.useMemo(() => getMarketSnapshot(filters, locale), [filters, locale]);
  const evolution = React.useMemo(
    () => (selected ? getSkillEvolution(selected.id, filters, 12, locale) : []),
    [selected, filters, locale],
  );

  const categories = React.useMemo(() => {
    const present = new Set(snapshot.skills.map((skill) => skill.category));
    return SKILL_CATEGORY_ORDER.filter((key) => present.has(key));
  }, [snapshot.skills]);

  const skills = React.useMemo(() => {
    const term = normalize(query.trim());
    return snapshot.skills
      .filter((skill) => (category === "all" ? true : skill.category === category))
      .filter((skill) =>
        term
          ? normalize(`${skill.skill} ${categoryName(skill.category, locale)}`).includes(term)
          : true,
      )
      .sort((a, b) => {
        if (sort === "trend") return b.trend - a.trend;
        if (sort === "salary") return b.medianSalary - a.medianSalary;
        if (sort === "gap") return b.demand - b.supply - (a.demand - a.supply);
        return b.demand - a.demand;
      });
  }, [snapshot.skills, query, category, sort, locale]);

  const top = snapshot.skills.slice(0, 10);
  const profileSkills = profile.skills.map(normalize);
  const matched = top.filter((skill) =>
    profileSkills.some((owned) => normalize(skill.skill).includes(owned) || owned.includes(normalize(skill.skill))),
  );
  const gaps = top.filter((skill) => !matched.includes(skill));
  const coverage = Math.round((matched.length / top.length) * 100);

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "demand", label: copy.common.demand },
    { value: "gap", label: pt ? "Maior lacuna" : "Biggest gap" },
    { value: "trend", label: copy.common.trend },
    { value: "salary", label: copy.common.salary },
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
            <span className="text-foreground">{copy.nav.demand}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {copy.nav.demand}
                </h1>
                <Badge variant="accent">{pt ? "Público" : "Public"}</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "Quanto o mercado pede de cada habilidade, quanto os candidatos oferecem e onde a lacuna fica mais cara. A mesma visão que alimenta a vitrine de vagas."
                  : "How much of each skill the market asks for, how much candidates offer, and where the gap gets expensive. The same view that powers the job board."}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-canvas px-3 py-2 text-[10px] leading-5 text-muted-foreground">
              <span className="font-semibold text-foreground">
                {snapshot.skills.length} {pt ? "habilidades nesta amostra" : "skills in this sample"}
              </span>
              <br />
              {pt ? "de 358 monitoradas no total" : "of 358 tracked overall"}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-6 sm:px-8">
        <div className="flex flex-wrap items-end gap-2.5 rounded-xl border border-border bg-card p-3 shadow-card">
          <label className="min-w-[150px] flex-1">
            <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {copy.common.month}
            </span>
            <Select
              value={filters.month}
              onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))}
              sizeVariant="sm"
              aria-label={copy.common.month}
            >
              {MONTH_OPTIONS.map((month) => (
                <option key={month.key} value={month.key}>
                  {monthLabel(month.key, locale)}
                </option>
              ))}
            </Select>
          </label>
          <label className="min-w-[150px] flex-1">
            <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {copy.common.region}
            </span>
            <Select
              value={filters.region}
              onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}
              sizeVariant="sm"
              aria-label={copy.common.region}
            >
              <option value="all">{copy.common.allRegions}</option>
              {REGIONS.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {regionName(region.slug, locale)}
                </option>
              ))}
            </Select>
          </label>
          <label className="min-w-[150px] flex-1">
            <span className="mb-1 block text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {copy.common.seniority}
            </span>
            <Select
              value={filters.seniority}
              onChange={(event) => setFilters((current) => ({ ...current, seniority: event.target.value as SeniorityFilter }))}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters(DEFAULT_FILTERS);
              setQuery("");
              setCategory("all");
            }}
            className="shrink-0 text-[11.5px]"
          >
            {copy.common.reset}
          </Button>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[14px] font-semibold">{pt ? "Mapa de lacunas" : "Gap map"}</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt
                    ? "Eixo X: oferta de candidatos. Eixo Y: demanda das vagas."
                    : "X axis: candidate supply. Y axis: vacancy demand."}
                </p>
              </div>
              <Badge variant="muted">{monthLabel(filters.month, locale)}</Badge>
            </div>
            <div className="mt-3">
              <SupplyDemandScatter data={snapshot.skills} height={318} />
            </div>
            <div className="mt-2 grid gap-2 border-t border-border pt-3 text-[10.5px] text-muted-foreground sm:grid-cols-2">
              <p className="flex items-start gap-1.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                {pt ? "Acima da linha: demanda supera a oferta." : "Above the line: demand exceeds supply."}
              </p>
              <p className="flex items-start gap-1.5">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-warning" />
                {pt ? "À direita: mais candidatos do que vagas." : "To the right: more candidates than roles."}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold">
                <BadgeCheck className="size-3.5 text-primary" /> {pt ? "Seu perfil no mercado" : "Your profile in the market"}
              </p>
              <Badge variant={coverage >= 60 ? "success" : "warning"}>{coverage}%</Badge>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              {pt
                ? `${matched.length} das 10 habilidades mais demandadas já estão no seu perfil.`
                : `${matched.length} of the 10 most in-demand skills are already on your profile.`}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.max(4, coverage)}%` }} />
            </div>

            <div className="mt-4 space-y-2">
              {top.slice(0, 5).map((skill) => {
                const known = matched.includes(skill);
                return (
                  <div key={skill.id} className="flex items-center gap-2 text-[11px]">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full",
                        known ? "bg-success-soft text-success" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {known ? <BadgeCheck className="size-2.5" /> : <Sparkles className="size-2.5" />}
                    </span>
                    <span className={cn("min-w-0 flex-1 truncate font-medium", !known && "text-muted-foreground")}>
                      {skillName(skill.skill, locale)}
                    </span>
                    <span className={cn("text-[9.5px] font-semibold", known ? "text-success" : "text-warning")}>
                      {known ? (pt ? "no perfil" : "on profile") : pt ? "lacuna" : "gap"}
                    </span>
                  </div>
                );
              })}
            </div>

            {gaps.length > 0 && (
              <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {pt ? "Lacuna mais cara" : "Most expensive gap"}
                </p>
                <p className="mt-1 text-[12px] font-semibold">{skillName(gaps[0].skill, locale)}</p>
                <p className="mt-0.5 text-[10.5px] leading-5 text-muted-foreground">
                  {pt
                    ? `${formatCompact(gaps[0].demand, locale)} vagas contra ${formatCompact(gaps[0].supply, locale)} candidatos.`
                    : `${formatCompact(gaps[0].demand, locale)} roles against ${formatCompact(gaps[0].supply, locale)} candidates.`}
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/perfil/editar">{pt ? "Editar perfil" : "Edit profile"}</Link>
              </Button>
              <Button asChild variant="navy" size="sm" className="flex-1">
                <Link href={`/vagas?q=${encodeURIComponent(gaps[0]?.skill ?? top[0].skill)}`}>
                  {pt ? "Ver vagas" : "See roles"} <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[13px] font-semibold">{pt ? "Habilidades por demanda" : "Skills ranked by demand"}</p>
              <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                {skills.length} {pt ? "habilidades nesta visão" : "skills in this view"} · {monthLabel(filters.month, locale)}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-border bg-canvas px-2.5 sm:w-52">
                <Search className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="sr-only">{copy.common.searchSkills}</span>
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.common.searchSkills}
                  className="h-auto border-0 bg-transparent px-0 py-0 text-[12px] shadow-none focus-visible:ring-0"
                />
              </label>
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                sizeVariant="sm"
                className="w-[150px]"
                aria-label={copy.common.sort}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto border-b border-border px-4 py-2.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                category === "all"
                  ? "border-primary/30 bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {copy.common.allCategories}
            </button>
            {categories.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={cn(
                  "shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition-colors",
                  category === key
                    ? "border-primary/30 bg-accent text-accent-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {categoryName(key, locale)}
              </button>
            ))}
          </div>

          {skills.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-[13px] font-semibold">
                {pt ? `Nenhuma habilidade para “${query}”` : `No skills match “${query}”`}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                {pt ? "Limpar busca" : "Clear search"}
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      <th className="px-4 py-2.5">#</th>
                      <th className="px-4 py-2.5">{pt ? "Habilidade" : "Skill"}</th>
                      <th className="px-4 py-2.5">{copy.common.demand}</th>
                      <th className="px-4 py-2.5">{copy.common.supply}</th>
                      <th className="px-4 py-2.5">{copy.common.trend}</th>
                      <th className="px-4 py-2.5">{copy.common.medianSalary}</th>
                      <th className="px-4 py-2.5">{copy.common.remoteShare}</th>
                      <th className="px-4 py-2.5 text-right">{copy.common.evolution}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill, index) => (
                      <tr key={skill.id} className="group border-b border-border last:border-0 hover:bg-muted/35">
                        <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-[12px] font-semibold">{skillName(skill.skill, locale)}</p>
                          <p className="text-[10px] text-muted-foreground">{categoryName(skill.category, locale)}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-12 text-[11.5px] font-semibold tabular-nums">
                              {formatCompact(skill.demand, locale)}
                            </span>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.max(8, (skill.demand / snapshot.skills[0].demand) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[11px] tabular-nums text-muted-foreground">
                          {formatCompact(skill.supply, locale)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-[11px] font-semibold tabular-nums", skill.trend >= 0 ? "text-success" : "text-danger")}>
                            {formatPercent(skill.trend, 1, locale)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11.5px] font-medium tabular-nums">
                          {formatCurrency(skill.medianSalary, locale)}
                        </td>
                        <td className="px-4 py-3 text-[11px] tabular-nums text-muted-foreground">{skill.remoteShare}%</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelected(skill)}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-accent"
                          >
                            {pt ? "Evolução" : "Evolution"} <ArrowUpRight className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              <div className="divide-y divide-border md:hidden">
                {skills.map((skill, index) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelected(skill)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/35"
                  >
                    <span className="font-mono text-[9.5px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold">{skillName(skill.skill, locale)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {categoryName(skill.category, locale)} · {skill.remoteShare}% {copy.common.remoteShare.toLowerCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11.5px] font-semibold tabular-nums">{formatCompact(skill.demand, locale)}</p>
                      <p className={cn("text-[10px] font-medium", skill.trend >= 0 ? "text-success" : "text-danger")}>
                        {formatPercent(skill.trend, 1, locale)}
                      </p>
                    </div>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-4 py-2.5 text-[10px] text-muted-foreground">
            <span>
              {pt ? "Agregados determinísticos de demonstração." : "Deterministic demo aggregates."}
            </span>
            <Link href="/vagas" className="font-semibold text-primary hover:underline">
              {pt ? "Ver vagas com essas habilidades" : "Browse roles using these skills"}
            </Link>
          </div>
        </div>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{categoryName(selected.category, locale)}</Badge>
                  <span className={cn("text-[10px] font-semibold", selected.trend >= 0 ? "text-success" : "text-danger")}>
                    {formatPercent(selected.trend, 1, locale)} {pt ? "em 12 meses" : "over 12 months"}
                  </span>
                </div>
                <SheetTitle className="text-[22px] tracking-[-0.03em]">{skillName(selected.skill, locale)}</SheetTitle>
              </SheetHeader>
              <SheetBody className="space-y-5">
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: pt ? "Vagas abertas" : "Open roles", value: formatNumber(selected.demand, locale) },
                    { label: pt ? "Oferta de candidatos" : "Candidate supply", value: formatNumber(selected.supply, locale) },
                    { label: copy.common.medianSalary, value: formatCurrency(selected.medianSalary, locale) },
                    { label: pt ? "Vagas remotas" : "Remote roles", value: `${selected.remoteShare}%` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border bg-canvas p-3">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-[15px] font-semibold tabular-nums">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[11.5px] font-semibold">{pt ? "Demanda vs. oferta" : "Demand vs. candidate supply"}</p>
                  <p className="mb-2 text-[10.5px] text-muted-foreground">
                    {pt ? "Doze meses até" : "Twelve months to"} {monthLabel(filters.month, locale)}.
                  </p>
                  <div className="rounded-lg border border-border p-3">
                    <SkillEvolutionChart data={evolution} height={210} />
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3 text-[10.5px] leading-5 text-muted-foreground">
                  {selected.demand > selected.supply
                    ? pt
                      ? "A demanda está à frente da oferta de candidatos. Espere mais competição por profissionais e pressão de alta nos salários."
                      : "Demand is ahead of candidate supply. Expect more competition for candidates and upward salary pressure."
                    : pt
                      ? "A oferta de candidatos está à frente da demanda. Diferenciar a especialização importa mais do que a habilidade isolada."
                      : "Candidate supply is ahead of demand. Differentiating your specialisation matters more than the skill alone."}
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-[10px] text-muted-foreground">
                  <Layers3 className="size-3.5 shrink-0 text-primary" />
                  {pt ? "Posição no ranking geral:" : "Overall rank:"} #{selected.rank} · {pt ? "tier" : "tier"} {selected.tier}
                </div>

                <Button asChild variant="navy" className="w-full">
                  <Link href={`/vagas?q=${encodeURIComponent(selected.skill)}`}>
                    {pt ? `Ver vagas com ${skillName(selected.skill, locale)}` : `See roles using ${skillName(selected.skill, locale)}`}{" "}
                    <ArrowRight />
                  </Link>
                </Button>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
