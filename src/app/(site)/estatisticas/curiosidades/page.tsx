import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Banknote, BarChart3, Clock, Globe2, MapPin, Radio, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MARKET_FACTS, MARKET_SOURCES, PIPELINE_STEPS } from "@/data/mock-market-extra";
import { getMarketSnapshot } from "@/lib/mock/market";
import { DEFAULT_FILTERS, monthLabel } from "@/lib/months";
import { formatCompact, formatCurrency, formatNumber } from "@/lib/format";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Curiosidades do mercado" : "Market curiosities",
    description:
      locale === "pt"
        ? "Seis leituras sobre o mercado brasileiro de tecnologia: salários, lacunas de habilidades, regiões e velocidade de contratação."
        : "Six readings of the Brazilian tech market: salaries, skill gaps, regions and hiring speed.",
  };
}

const SALARY_BANDS = [
  { key: "junior", pt: "Júnior", en: "Junior", value: 7400, share: 40 },
  { key: "pleno", pt: "Pleno", en: "Mid-level", value: 12800, share: 69 },
  { key: "senior", pt: "Sênior", en: "Senior", value: 18500, share: 100 },
  { key: "especialista", pt: "Especialista", en: "Specialist", value: 24200, share: 131 },
];

const HIRING_SPEED = [
  { key: "junior", pt: "Júnior", en: "Junior", days: 12 },
  { key: "pleno", pt: "Pleno", en: "Mid-level", days: 18 },
  { key: "senior", pt: "Sênior", en: "Senior", days: 26 },
  { key: "especialista", pt: "Especialista", en: "Specialist", days: 34 },
];

const REMOTE_REGIONS = [
  { pt: "Florianópolis", en: "Florianópolis", share: 62 },
  { pt: "Curitiba", en: "Curitiba", share: 57 },
  { pt: "São Paulo", en: "São Paulo", share: 48 },
  { pt: "Recife", en: "Recife", share: 44 },
  { pt: "Belo Horizonte", en: "Belo Horizonte", share: 39 },
];

export default async function CuriositiesPage() {
  const locale = await getLocale();
  const pt = locale === "pt";
  const snapshot = getMarketSnapshot(DEFAULT_FILTERS, locale);
  const [hero, ...rest] = MARKET_FACTS;

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
              {pt ? "Estatísticas" : "Statistics"}
            </Link>
            <span>/</span>
            <span className="text-foreground">{pt ? "Curiosidades" : "Curiosities"}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {pt ? "Curiosidades do mercado" : "Market curiosities"}
                </h1>
                <Badge variant="accent">{pt ? "6 leituras" : "6 readings"}</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "Padrões que só aparecem quando você olha os mesmos sinais por outro ângulo. Salários, lacunas, geografia e velocidade de contratação — todos fictícios, todos consistentes."
                  : "Patterns that only surface when you look at the same signals from another angle. Salaries, gaps, geography and hiring speed — all fictional, all internally consistent."}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-canvas px-3 py-2 text-[10px] leading-5 text-muted-foreground">
              <span className="font-semibold text-foreground">{monthLabel(DEFAULT_FILTERS.month, locale)}</span>
              <br />
              {pt ? "Snapshot fictício" : "Fictional snapshot"}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="relative overflow-hidden rounded-xl border border-border bg-navy p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute inset-0 site-hero-grid" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/25 blur-[80px]" aria-hidden="true" />
            <div className="relative">
              <Badge variant="navy" className="gap-1">
                <Sparkles className="size-3" /> {pt ? "Leitura principal" : "Headline reading"}
              </Badge>
              <p className="mt-6 text-[54px] font-semibold leading-none tracking-[-0.05em] tabular-nums sm:text-[68px]">
                {hero.value}
              </p>
              <p className="mt-3 max-w-md text-[20px] font-medium leading-7 tracking-[-0.02em] sm:text-[24px]">
                {hero.label[locale]}
              </p>
              <p className="mt-3 max-w-lg text-[12.5px] leading-6 text-white/60">{hero.detail[locale]}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  href="/estatisticas/oferta-demanda"
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-[12px] font-semibold text-navy transition-colors hover:bg-white/90"
                >
                  {pt ? "Ver oferta × demanda" : "See supply × demand"} <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/vagas"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/[0.09]"
                >
                  {pt ? "Explorar vagas" : "Explore roles"} <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((fact) => (
              <div key={fact.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {fact.label[locale]}
                  </p>
                  <TrendingUp className="size-3.5 shrink-0 text-primary" />
                </div>
                <p className="mt-4 text-[32px] font-semibold leading-none tracking-[-0.045em] tabular-nums">{fact.value}</p>
                <p className="mt-2 text-[11.5px] leading-5 text-muted-foreground">{fact.detail[locale]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((fact, index) => (
            <div key={fact.id} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {fact.label[locale]}
                </p>
                <span className="font-mono text-[9px] text-muted-foreground">0{index + 3}</span>
              </div>
              <p className="mt-4 text-[30px] font-semibold leading-none tracking-[-0.045em] tabular-nums">{fact.value}</p>
              <p className="mt-2 text-[11.5px] leading-5 text-muted-foreground">{fact.detail[locale]}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Banknote className="size-3.5 text-primary" /> {pt ? "Salário mediano por nível" : "Median salary by level"}
              </h2>
              <Badge variant="muted">CLT</Badge>
            </div>
            <ul className="mt-5 space-y-4">
              {SALARY_BANDS.map((band) => (
                <li key={band.key}>
                  <div className="flex items-baseline justify-between text-[11.5px]">
                    <span className="font-medium">{band[locale]}</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(band.value, locale)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(band.share / 131) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-[10px] leading-5 text-muted-foreground">
              {pt
                ? "Faixa usada como referência para vagas de engenharia em novembro de 2026."
                : "Reference band for engineering roles in November 2026."}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Globe2 className="size-3.5 text-primary" /> {pt ? "Participação remota" : "Remote share"}
              </h2>
              <Badge variant="muted">{snapshot.remoteShare}%</Badge>
            </div>
            <ul className="mt-5 space-y-3.5">
              {REMOTE_REGIONS.map((region) => (
                <li key={region.en}>
                  <div className="flex items-baseline justify-between text-[11.5px]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="size-3 text-muted-foreground" /> {region[locale]}
                    </span>
                    <span className="font-semibold tabular-nums">{region.share}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-[#0F766E]" style={{ width: `${region.share}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-[10px] leading-5 text-muted-foreground">
              {pt
                ? "Percentual de vagas abertas com modelo remoto ou híbrido por praça."
                : "Share of open roles with a remote or hybrid model per city."}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Clock className="size-3.5 text-primary" /> {pt ? "Tempo até a contratação" : "Time to hire"}
              </h2>
              <Badge variant="muted">{pt ? "dias" : "days"}</Badge>
            </div>
            <div className="mt-5 flex h-[168px] items-end gap-3">
              {HIRING_SPEED.map((item) => (
                <div key={item.key} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold tabular-nums">{item.days}</span>
                  <div
                    className="w-full rounded-t-md bg-primary/85"
                    style={{ height: `${(item.days / 34) * 100}%` }}
                    aria-hidden="true"
                  />
                  <span className="text-[9px] leading-3 text-muted-foreground">{item[locale]}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-border pt-3 text-[10px] leading-5 text-muted-foreground">
              {pt
                ? "Da publicação do sinal ao aceite, no snapshot fictício."
                : "From signal publication to offer acceptance, in the fictional snapshot."}
            </p>
          </section>
        </div>

        <section className="mt-4 rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-1.5 text-[14px] font-semibold">
                <Radio className="size-3.5 text-primary" /> {pt ? "Onde o sinal nasce" : "Where the signal starts"}
              </h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {pt ? "Distribuição dos sinais por grupo público" : "Distribution of signals per public group"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">{formatNumber(snapshot.vacancies, locale)}</span>
              {pt ? "vagas no snapshot" : "roles in the snapshot"}
            </div>
          </div>
          <div className="mt-5 flex flex-col overflow-hidden rounded-lg border border-border sm:flex-row sm:h-4">
            {MARKET_SOURCES.slice(0, 6).map((source, index) => (
              <div
                key={source.id}
                className="h-2 sm:h-full"
                style={{
                  width: `${source.share}%`,
                  backgroundColor: ["#003A8C", "#0B5FBE", "#0F766E", "#B45309", "#5B3FA8", "#A3325A"][index],
                }}
                title={`${source.channel} · ${source.share}%`}
              />
            ))}
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MARKET_SOURCES.slice(0, 6).map((source, index) => (
              <div key={source.id} className="flex items-center gap-2 text-[10.5px] text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ["#003A8C", "#0B5FBE", "#0F766E", "#B45309", "#5B3FA8", "#A3325A"][index] }}
                />
                <span className="truncate font-medium text-foreground">{source.channel}</span>
                <span className="ml-auto tabular-nums">{source.share.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-1.5 text-[14px] font-semibold">
              <BarChart3 className="size-3.5 text-primary" /> {pt ? "Como ler estes números" : "How to read these numbers"}
            </h2>
            <p className="mt-2 text-[11.5px] leading-6 text-muted-foreground">
              {pt
                ? "Nenhuma métrica vem de uma fonte real. Os valores são gerados de forma determinística a partir de uma semente fixa, para que capturas de tela e comparações permaneçam consistentes."
                : "No metric comes from a real source. Values are generated deterministically from a fixed seed so screenshots and comparisons stay consistent."}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[pt ? "Semente fixa" : "Fixed seed", pt ? "Sem API" : "No API", pt ? "Frontend estático" : "Static frontend"].map((tag) => (
                <span key={tag} className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border rounded-xl border border-border bg-card px-5">
            {PIPELINE_STEPS.map((step) => (
              <div key={step.number} className="flex gap-4 py-4">
                <span className="font-mono text-[11px] font-medium text-primary">{step.number}</span>
                <div>
                  <p className="text-[12.5px] font-semibold">{step.title[locale]}</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{step.body[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-card px-5 py-4">
          <p className="text-[11px] text-muted-foreground">
            {pt
              ? `Snapshot com ${formatCompact(snapshot.candidatePool, locale)} candidatos simulados e ${formatNumber(snapshot.skillsTracked, locale)} habilidades monitoradas.`
              : `Snapshot with ${formatCompact(snapshot.candidatePool, locale)} simulated candidates and ${formatNumber(snapshot.skillsTracked, locale)} tracked skills.`}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/estatisticas/telegram" className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-primary hover:underline">
              {pt ? "Vagas no Telegram" : "Telegram jobs"} <ArrowRight className="size-3.5" />
            </Link>
            <Link href="/estatisticas/oferta-demanda" className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-primary hover:underline">
              {pt ? "Oferta × demanda" : "Supply × demand"} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
