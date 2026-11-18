"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Bookmark, MapPin, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { Job, SeniorityFilter, WorkModelFilter } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { JobCard } from "@/components/site/job-card";
import { JOBS } from "@/data/mock-jobs";
import { REGIONS, regionName, seniorityLabel, workModelLabel } from "@/lib/months";
import { getSavedJobIds, jobSkillLabel } from "@/lib/jobs";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

type SortKey = "relevance" | "recent" | "salary";

const INITIAL_VISIBLE = 8;

export type JobsInitialState = {
  q?: string;
  regiao?: string;
  senioridade?: string;
  modelo?: string;
  salvas?: string;
  ordenar?: string;
};

function filterJobs({
  jobs,
  query,
  region,
  seniority,
  workModel,
  savedOnly,
  savedIds,
  sort,
}: {
  jobs: Job[];
  query: string;
  region: string;
  seniority: SeniorityFilter;
  workModel: WorkModelFilter;
  savedOnly: boolean;
  savedIds: string[];
  sort: SortKey;
}) {
  const term = query.trim().toLowerCase();
  return jobs
    .filter((job) => {
      if (term) {
        const haystack = [
          job.title.pt,
          job.title.en,
          job.company,
          job.location.pt,
          ...job.skills,
          ...job.skills.map((skill) => jobSkillLabel(skill, "en")),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (region !== "all" && job.region !== region) return false;
      if (seniority !== "all" && job.seniority !== seniority) return false;
      if (workModel !== "all" && job.workModel !== workModel) return false;
      if (savedOnly && !savedIds.includes(job.id)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "salary") return b.salaryMax - a.salaryMax;
      if (sort === "recent") return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      return (
        Number(b.featured) - Number(a.featured) ||
        new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
    });
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function FilterPanel({
  region,
  setRegion,
  seniority,
  setSeniority,
  workModel,
  setWorkModel,
  savedOnly,
  setSavedOnly,
  savedCount,
  onReset,
  copy,
  locale,
}: {
  region: string;
  setRegion: (value: string) => void;
  seniority: SeniorityFilter;
  setSeniority: (value: SeniorityFilter) => void;
  workModel: WorkModelFilter;
  setWorkModel: (value: WorkModelFilter) => void;
  savedOnly: boolean;
  setSavedOnly: (value: boolean) => void;
  savedCount: number;
  onReset: () => void;
  copy: ReturnType<typeof siteCopy>;
  locale: "pt" | "en";
}) {
  const selectClass =
    "h-9 w-full cursor-pointer appearance-none rounded-lg border border-border bg-card px-2.5 text-[12.5px] text-foreground outline-none focus:border-primary/50";

  return (
    <div className="space-y-5">
      <FilterField label={copy.common.region}>
        <select value={region} onChange={(event) => setRegion(event.target.value)} className={selectClass} aria-label={copy.common.region}>
          <option value="all">{copy.common.allRegions}</option>
          {REGIONS.map((item) => (
            <option key={item.slug} value={item.slug}>
              {regionName(item.slug, locale)}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label={copy.common.seniority}>
        <select
          value={seniority}
          onChange={(event) => setSeniority(event.target.value as SeniorityFilter)}
          className={selectClass}
          aria-label={copy.common.seniority}
        >
          <option value="all">{copy.common.allSeniorities}</option>
          {(["junior", "pleno", "senior", "especialista"] as const).map((value) => (
            <option key={value} value={value}>
              {seniorityLabel(value, locale)}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField label={copy.common.workModel}>
        <select
          value={workModel}
          onChange={(event) => setWorkModel(event.target.value as WorkModelFilter)}
          className={selectClass}
          aria-label={copy.common.workModel}
        >
          <option value="all">{copy.common.allModels}</option>
          {(["remote", "hybrid", "onsite"] as const).map((value) => (
            <option key={value} value={value}>
              {workModelLabel(value, locale)}
            </option>
          ))}
        </select>
      </FilterField>

      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setSavedOnly(!savedOnly)}
          aria-pressed={savedOnly}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-[12px] font-medium transition-colors",
            savedOnly
              ? "border-primary/30 bg-accent text-accent-foreground"
              : "border-border bg-card text-muted-foreground hover:bg-muted",
          )}
        >
          <Bookmark className="size-3.5" />
          {copy.common.savedJobs}
          <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums">{savedCount}</span>
        </button>
      </div>

      <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3">
        <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-foreground">
          <MapPin className="size-3 text-primary" />
          {locale === "pt" ? "9 grupos · 11 regiões" : "9 groups · 11 regions"}
        </p>
        <p className="mt-1 text-[10.5px] leading-5 text-muted-foreground">
          {locale === "pt"
            ? "Vagas fictícias, estruturadas a partir de sinais públicos simulados."
            : "Fictional roles structured from simulated public signals."}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 text-[11.5px] font-semibold text-primary hover:underline"
      >
        <RotateCcw className="size-3" /> {copy.common.reset}
      </button>
    </div>
  );
}

export function JobsView({ initial = {} }: { initial?: JobsInitialState }) {
  const { locale } = useLocale();
  const copy = siteCopy(locale);
  const pathname = usePathname();

  const [query, setQuery] = React.useState(initial.q ?? "");
  const [region, setRegion] = React.useState(initial.regiao ?? "all");
  const [seniority, setSeniority] = React.useState<SeniorityFilter>(
    (initial.senioridade as SeniorityFilter) ?? "all",
  );
  const [workModel, setWorkModel] = React.useState<WorkModelFilter>((initial.modelo as WorkModelFilter) ?? "all");
  const [savedOnly, setSavedOnly] = React.useState(initial.salvas === "1");
  const [sort, setSort] = React.useState<SortKey>(
    initial.ordenar === "recentes" ? "recent" : initial.ordenar === "salario" ? "salary" : "relevance",
  );
  const [visible, setVisible] = React.useState(INITIAL_VISIBLE);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [savedIds, setSavedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const sync = () => setSavedIds(getSavedJobIds());
    sync();
    window.addEventListener("onias:saved-jobs", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("onias:saved-jobs", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (region !== "all") params.set("regiao", region);
    if (seniority !== "all") params.set("senioridade", seniority);
    if (workModel !== "all") params.set("modelo", workModel);
    if (savedOnly) params.set("salvas", "1");
    if (sort !== "relevance") params.set("ordenar", sort === "recent" ? "recentes" : "salario");
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    window.history.replaceState(null, "", next);
  }, [query, region, seniority, workModel, savedOnly, sort, pathname]);

  const results = React.useMemo(
    () => filterJobs({ jobs: JOBS, query, region, seniority, workModel, savedOnly, savedIds, sort }),
    [query, region, seniority, workModel, savedOnly, savedIds, sort],
  );

  const reset = () => {
    setQuery("");
    setRegion("all");
    setSeniority("all");
    setWorkModel("all");
    setSavedOnly(false);
    setSort("relevance");
    setVisible(INITIAL_VISIBLE);
  };

  const activeFilters =
    Number(Boolean(query)) +
    Number(region !== "all") +
    Number(seniority !== "all") +
    Number(workModel !== "all") +
    Number(savedOnly);

  const filterProps = {
    region,
    setRegion,
    seniority,
    setSeniority,
    workModel,
    setWorkModel,
    savedOnly,
    setSavedOnly,
    savedCount: savedIds.length,
    onReset: reset,
    copy,
    locale,
  };

  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "relevance", label: copy.common.relevance },
    { value: "recent", label: copy.common.newest },
    { value: "salary", label: copy.common.highestSalary },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1200px] px-5 py-10 sm:px-8 sm:py-12">
          <nav className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">
              {locale === "pt" ? "Início" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-foreground">{copy.nav.jobs}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {locale === "pt" ? "Vagas no Telegram" : "Telegram jobs"}
                </h1>
                <Badge variant="accent">
                  {JOBS.length} {locale === "pt" ? "ativas" : "live"}
                </Badge>
              </div>
              <p className="mt-3 max-w-xl text-[13px] leading-6 text-muted-foreground">
                {locale === "pt"
                  ? "Vagas de tecnologia do mercado brasileiro, estruturadas a partir de sinais públicos. Filtre pelo que importa, salve o que faz sentido e leia o mercado por trás de cada vaga."
                  : "Brazilian tech roles structured from public signals. Filter by what matters, save what fits, and read the market behind each listing."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              {locale === "pt" ? "Snapshot de 15 nov 2026 · dados fictícios" : "Snapshot 15 Nov 2026 · fictional data"}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-border bg-canvas px-3 focus-within:border-primary/50">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <span className="sr-only">{copy.common.searchRole}</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisible(INITIAL_VISIBLE);
                }}
                placeholder={copy.common.searchRole}
                className="w-full border-0 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label={locale === "pt" ? "Limpar busca" : "Clear search"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </label>
            <Button variant="outline" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <SlidersHorizontal /> {copy.common.filters}
              {activeFilters > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeFilters}</span>
              )}
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[12px] font-semibold">{copy.common.filters}</p>
                {activeFilters > 0 && (
                  <Badge variant="accent">
                    {activeFilters} {locale === "pt" ? "ativos" : "active"}
                  </Badge>
                )}
              </div>
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] text-muted-foreground">
                <span className="font-semibold text-foreground">{results.length}</span>{" "}
                {results.length === 1
                  ? locale === "pt"
                    ? "vaga encontrada"
                    : "role matches"
                  : locale === "pt"
                    ? "vagas encontradas"
                    : "roles match"}
                {query ? ` “${query}”` : ""}
              </p>
              <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                {copy.common.sort}
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="h-8 cursor-pointer rounded-lg border border-border bg-card px-2 text-[11.5px] font-medium text-foreground outline-none"
                  aria-label={copy.common.sort}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {activeFilters > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-medium text-foreground hover:bg-muted"
                  >
                    “{query}” <X className="size-3" />
                  </button>
                )}
                {region !== "all" && (
                  <button
                    type="button"
                    onClick={() => setRegion("all")}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-medium text-foreground hover:bg-muted"
                  >
                    {regionName(region, locale)} <X className="size-3" />
                  </button>
                )}
                {seniority !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSeniority("all")}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-medium text-foreground hover:bg-muted"
                  >
                    {seniorityLabel(seniority, locale)} <X className="size-3" />
                  </button>
                )}
                {workModel !== "all" && (
                  <button
                    type="button"
                    onClick={() => setWorkModel("all")}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-medium text-foreground hover:bg-muted"
                  >
                    {workModelLabel(workModel, locale)} <X className="size-3" />
                  </button>
                )}
                {savedOnly && (
                  <button
                    type="button"
                    onClick={() => setSavedOnly(false)}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10.5px] font-medium text-foreground hover:bg-muted"
                  >
                    {copy.common.savedJobs} <X className="size-3" />
                  </button>
                )}
              </div>
            )}

            {results.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Search className="size-5" />
                </div>
                <p className="mt-3 text-[14px] font-semibold">{copy.common.noResults}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">{copy.common.noResultsHint}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
                  <RotateCcw /> {copy.common.reset}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {results.slice(0, visible).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                {visible < results.length && (
                  <div className="mt-5 flex justify-center">
                    <Button variant="outline" onClick={() => setVisible((count) => count + INITIAL_VISIBLE)}>
                      {copy.common.showMore} <ArrowRight />
                    </Button>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-[10.5px] text-muted-foreground">
              <Badge variant="muted">{copy.common.demo}</Badge>
              {locale === "pt"
                ? "As vagas são fictícias. Salvar uma vaga grava apenas no localStorage deste navegador."
                : "Listings are fictional. Saving a role only writes to localStorage in this browser."}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="max-h-[88dvh]">
          <SheetHeader>
            <SheetTitle>{copy.common.filters}</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <FilterPanel {...filterProps} />
          </SheetBody>
          <SheetFooter className="pb-6">
            <Button variant="outline" className="flex-1" onClick={reset}>
              {copy.common.reset}
            </Button>
            <Button className="flex-1" onClick={() => setMobileOpen(false)}>
              {copy.common.showResults} ({results.length})
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
