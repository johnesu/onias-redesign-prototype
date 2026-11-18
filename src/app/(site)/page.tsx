import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  BriefcaseBusiness,
  CircleCheck,
  Eye,
  Layers3,
  Radio,
  Sparkles,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MarketTrendChart } from "@/components/charts/market-trend-chart";
import { Sparkline } from "@/components/ui/sparkline";
import { SiteSearch } from "@/components/site/site-search";
import { JobCard } from "@/components/site/job-card";
import { JobLogo } from "@/components/site/job-logo";
import { featuredJobs, JOBS } from "@/data/mock-jobs";
import { HIRING_COMPANIES, MARKET_FACTS, PIPELINE_STEPS } from "@/data/mock-market-extra";
import { getMarketSnapshot } from "@/lib/mock/market";
import { skillName } from "@/lib/market-labels";
import { DEFAULT_FILTERS, monthLabel } from "@/lib/months";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { jobSalaryShort } from "@/lib/jobs";
import { getLocale } from "@/lib/locale-server";
import { siteCopy } from "@/lib/site-copy";

export default async function SiteHomePage() {
  const locale = await getLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const snapshot = getMarketSnapshot(DEFAULT_FILTERS, locale);
  const featured = featuredJobs(6);
  const heroJob = featured[0];

  const stats = [
    {
      label: pt ? "Vagas abertas no mês" : "Open roles this month",
      value: formatNumber(snapshot.vacancies, locale),
      hint: `${formatPercent(snapshot.vacancyTrend, 1, locale)} ${pt ? "vs. outubro" : "vs. October"}`,
      icon: BriefcaseBusiness,
    },
    {
      label: pt ? "Habilidades monitoradas" : "Skills tracked",
      value: formatNumber(snapshot.skillsTracked, locale),
      hint: `${snapshot.newSkills} ${pt ? "novas neste mês" : "new this month"}`,
      icon: Layers3,
    },
    {
      label: pt ? "Salário mediano" : "Median salary",
      value: formatCurrency(snapshot.medianSalary, locale),
      hint: pt ? "Mensal, bruto CLT" : "Monthly, gross CLT",
      icon: Banknote,
    },
    {
      label: pt ? "Vagas remotas" : "Remote-friendly",
      value: `${snapshot.remoteShare}%`,
      hint: pt ? "Das vagas monitoradas" : "Of tracked roles",
      icon: Wifi,
    },
  ];

  const statsPages = [
    {
      href: "/estatisticas/telegram",
      title: pt ? "Vagas no Telegram" : "Telegram jobs",
      body: pt
        ? "Volume, fontes, regiões e a evolução mensal dos sinais de contratação."
        : "Volume, sources, regions and the monthly evolution of hiring signals.",
      icon: Radio,
      metric: `${formatNumber(snapshot.vacancies, locale)} ${pt ? "vagas" : "roles"}`,
    },
    {
      href: "/estatisticas/oferta-demanda",
      title: pt ? "Oferta × demanda" : "Supply × demand",
      body: pt
        ? "As habilidades que o mercado pede, o que os candidatos oferecem e onde está a lacuna."
        : "The skills the market asks for, what candidates offer, and where the gap sits.",
      icon: BarChart3,
      metric: `${snapshot.skills.length} ${pt ? "habilidades em destaque" : "highlighted skills"}`,
    },
    {
      href: "/estatisticas/curiosidades",
      title: pt ? "Curiosidades" : "Curiosities",
      body: pt
        ? "Padrões que só aparecem quando você olha os sinais por outro ângulo."
        : "Patterns that only surface when you look at the signals from another angle.",
      icon: Sparkles,
      metric: pt ? "6 leituras do mercado" : "6 market readings",
    },
  ];

  const steps = PIPELINE_STEPS;

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="pointer-events-none absolute inset-0 site-hero-grid" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 top-[-18rem] size-[42rem] rounded-full bg-primary/20 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-52 bottom-[-26rem] size-[38rem] rounded-full bg-[#1E9E8A]/10 blur-[120px]" aria-hidden="true" />

        <div className="relative mx-auto grid w-full max-w-[1200px] gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-28 lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1 pl-2 pr-3 text-[10.5px] font-medium text-white/70 backdrop-blur">
              <span className="flex size-4 items-center justify-center rounded-full bg-[#2DD4A7]/15">
                <span className="size-1.5 animate-pulse rounded-full bg-[#2DD4A7]" />
              </span>
              {pt ? "Demonstração ao vivo · 48.251 sinais neste mês" : "Live demo · 48,251 hiring signals this month"}
            </div>

            <h1 className="mt-6 max-w-[17ch] text-balance text-[42px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[56px] lg:text-[64px]">
              {pt ? "O mercado de trabalho," : "The job market,"}
              <span className="block text-white/45">{pt ? "antes do ruído." : "before the noise."}</span>
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-[14.5px] leading-7 text-white/64 sm:text-[15.5px]">
              {pt
                ? "A ONIAS transforma mensagens públicas de vagas no Telegram em um mercado legível: habilidades, salários, regiões e vagas que merecem sua atenção. Sem spam de recrutador. Sem vaga misteriosa."
                : "ONIAS turns public Telegram hiring messages into a readable market: skills, salaries, regions and roles worth your attention. No recruiter spam. No mystery listings."}
            </p>

            <div className="mt-8">
              <SiteSearch />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/45">
              <span className="flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-[#2DD4A7]" /> {pt ? "Toda vaga tem uma fonte pública" : "Every role has a public source"}
              </span>
              <span className="flex items-center gap-1.5">
                <CircleCheck className="size-3.5 text-[#2DD4A7]" /> {pt ? "Dados fictícios de demonstração" : "Fictional demo data"}
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute -inset-4 rounded-[28px] border border-white/5 bg-white/[0.02]" aria-hidden="true" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-xl bg-card text-foreground">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <Sparkles className="size-3.5" />
                    </span>
                    <span className="text-[11.5px] font-semibold">{pt ? "Pulso do mercado" : "Market pulse"}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-success" /> {monthLabel(DEFAULT_FILTERS.month, locale)}
                  </span>
                </div>

                <div className="px-4 pb-4 pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {pt ? "Habilidade mais demandada" : "Highest-demand skill"}
                  </p>
                  <div className="mt-1.5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[23px] font-semibold leading-tight tracking-[-0.035em]">
                        {skillName(snapshot.topSkill.skill, locale)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatNumber(snapshot.topSkill.demand, locale)} {pt ? "vagas abertas" : "open roles"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{snapshot.topSkillIndex}</p>
                      <p className="text-[10px] text-muted-foreground">/ 100</p>
                    </div>
                  </div>
                  <Sparkline data={snapshot.monthly.map((point) => point.vacancies)} tone="primary" className="mt-4 h-10" strokeWidth={2} />
                  <div className="mt-3 flex items-center justify-between rounded-md bg-success-soft px-2.5 py-1.5 text-[10.5px] font-medium text-success">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="size-3" /> {pt ? "Demanda em 12 meses" : "12-month demand"}
                    </span>
                    <span>{formatPercent(snapshot.topSkill.trend, 1, locale)}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border p-2.5">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {pt ? "Salário mediano" : "Median salary"}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold tabular-nums">{formatCurrency(snapshot.medianSalary, locale)}</p>
                    </div>
                    <div className="rounded-lg border border-border p-2.5">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {pt ? "Candidatos" : "Candidate pool"}
                      </p>
                      <p className="mt-1 text-[13px] font-semibold tabular-nums">{formatCompact(snapshot.candidatePool, locale)}</p>
                    </div>
                  </div>
                </div>

                {heroJob && (
                  <Link
                    href={`/vagas/${heroJob.id}`}
                    className="group flex items-center gap-3 border-t border-border bg-muted/45 px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <JobLogo job={heroJob} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        {pt ? "Destaque da semana" : "Featured this week"}
                      </p>
                      <p className="truncate text-[12px] font-semibold">{heroJob.title[locale]}</p>
                      <p className="truncate text-[10.5px] text-muted-foreground">
                        {heroJob.company} · {jobSalaryShort(heroJob, locale)}
                        {copy.common.perMonth}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </div>

            <div className="absolute -left-4 bottom-20 hidden items-center gap-2 rounded-lg border border-white/10 bg-navy/90 px-3 py-2 shadow-xl backdrop-blur lg:flex">
              <span className="flex size-7 items-center justify-center rounded-md bg-[#2DD4A7]/12 text-[#5BE7BF]">
                <Radio className="size-3.5" />
              </span>
              <div>
                <p className="text-[9px] uppercase tracking-[0.1em] text-white/40">{pt ? "Sinais hoje" : "Signals today"}</p>
                <p className="text-[12px] font-semibold tabular-nums text-white">1.284</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 w-full max-w-[1200px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-lift lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  <Icon className="size-3.5" /> {stat.label}
                </div>
                <p className="mt-2 text-[22px] font-semibold tracking-[-0.035em] tabular-nums sm:text-[26px]">{stat.value}</p>
                <p className="mt-0.5 text-[10.5px] text-muted-foreground">{stat.hint}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-b border-border py-20 lg:py-24" id="vagas">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                {pt ? "Direto do sinal" : "Fresh from the signal"}
              </p>
              <h2 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">
                {pt ? "Vagas que merecem uma segunda olhada." : "Roles worth a closer look."}
              </h2>
              <p className="mt-3 max-w-xl text-[13.5px] leading-6 text-muted-foreground">
                {pt
                  ? "Descrições completas em português e inglês, faixa salarial realista e a fonte pública de cada vaga."
                  : "Full descriptions in Portuguese and English, a realistic salary band and the public source of every role."}
              </p>
            </div>
            <Link href="/vagas" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline">
              {pt ? `Todas as ${JOBS.length} vagas` : `All ${JOBS.length} open roles`} <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <BadgeCheck className="size-3.5 text-primary" />
              {pt
                ? "Vagas fictícias criadas para este estudo de redesenho. Nenhuma candidatura sai do navegador."
                : "Fictional roles created for this redesign study. No application leaves the browser."}
            </span>
            <Link href="/vagas" className="font-semibold text-primary hover:underline">
              {pt ? "Abrir a vitrine" : "Browse the board"}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {pt ? "Pulso do mercado" : "Market pulse"}
            </p>
            <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">
              {pt ? "Leia o mercado antes de se candidatar." : "Read the market before you apply."}
            </h2>
            <p className="mt-3 text-[13.5px] leading-6 text-muted-foreground">
              {pt
                ? "Demanda, salário e participação remota para cada habilidade monitorada — recalculados a partir dos mesmos sinais públicos por trás das vagas."
                : "Demand, salary and remote share for every tracked skill — recomputed from the same public signals behind the job board."}
            </p>
          </div>
          <Link href="/estatisticas/telegram" className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline">
            {pt ? "Abrir estatísticas" : "Open statistics"} <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.55fr_1fr]">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[12.5px] font-semibold">
                  {pt ? "Volume de contratação nos últimos doze meses" : "Hiring volume, last twelve months"}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt ? "Vagas deduplicadas em todos os grupos monitorados." : "Deduplicated roles across all tracked groups."}
                </p>
              </div>
              <div className="flex items-center gap-3 text-[10.5px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-chart-1" /> {pt ? "Vagas" : "Roles"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-dashed border-chart-3" /> {pt ? "Candidatos" : "Candidates"}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <MarketTrendChart data={snapshot.monthly} height={252} />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[10.5px] text-muted-foreground">
              <span>{pt ? "Snapshot de demonstração · novembro de 2026" : "Demo snapshot · November 2026"}</span>
              <Link href="/estatisticas/telegram" className="font-semibold text-primary hover:underline">
                {pt ? "Aprofundar" : "Deep dive"}
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-semibold">{pt ? "Habilidades em demanda" : "Skills in demand"}</p>
              <Badge variant="accent">Top 6</Badge>
            </div>
            <div className="mt-4 space-y-3.5">
              {snapshot.skills.slice(0, 6).map((skill) => (
                <Link key={skill.id} href={`/vagas?q=${encodeURIComponent(skill.skill)}`} className="group block">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold group-hover:text-primary">
                        {skillName(skill.skill, locale)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11.5px] font-semibold tabular-nums">{formatCompact(skill.demand, locale)}</p>
                      <p className="text-[9.5px] font-medium text-success">{formatPercent(skill.trend, 1, locale)}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.max(18, (skill.demand / snapshot.skills[0].demand) * 100)}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/estatisticas/oferta-demanda"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[11.5px] font-semibold text-foreground hover:bg-muted"
            >
              {pt ? `Explorar ${snapshot.skillsTracked} habilidades` : `Explore ${snapshot.skillsTracked} tracked skills`}{" "}
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-20 lg:py-24" id="estatisticas">
        <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {pt ? "Estatísticas públicas" : "Public statistics"}
            </p>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">
              {pt ? "Três formas de ler o mesmo mercado." : "Three ways to read the same market."}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {statsPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-px hover:border-input hover:shadow-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-5 text-[16px] font-semibold tracking-[-0.02em]">{page.title}</p>
                  <p className="mt-2 flex-1 text-[12.5px] leading-6 text-muted-foreground">{page.body}</p>
                  <p className="mt-4 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                    {page.metric}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28" id="como-funciona">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {pt ? "Como funciona" : "How it works"}
            </p>
            <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">
              {pt ? "De uma mensagem no Telegram a uma decisão." : "From a Telegram message to a decision."}
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-6 text-muted-foreground">
              {pt
                ? "O protótipo mantém a premissa do produto original — sinais públicos de contratação transformados em inteligência de mercado — e reconstrói a experiência em torno de clareza, não de ruído."
                : "The prototype keeps the original product's premise — public hiring signals turned into market intelligence — and rebuilds the experience around clarity instead of noise."}
            </p>

            <div className="mt-7 overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-[#2AABEE]" /> {pt ? "Sinal do Telegram" : "Telegram signal"}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                  {pt ? "bruto → estruturado" : "raw → structured"}
                </span>
              </div>
              <div className="p-4">
                <p className="font-mono text-[10.5px] leading-5 text-muted-foreground">
                  <span className="text-foreground">[VAGA]</span> Sênior · Python, AWS, Kafka · Remoto · R$ 22–28k
                  <br />
                  <span className="text-muted-foreground/70">
                    {pt ? "Empresa de dados climáticos · 3+ anos · início imediato" : "Climate data company · 3+ years · immediate start"}
                  </span>
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Python", "AWS", "Kafka", "Sênior", pt ? "Remoto" : "Remote", "R$ 22–28k"].map((token) => (
                    <span key={token} className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-[9.5px] text-foreground">
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border border-t border-border">
            {steps.map((step) => (
              <div key={step.number} className="group grid gap-4 py-7 sm:grid-cols-[64px_1fr] sm:py-8">
                <span className="font-mono text-[12px] font-medium text-primary">{step.number}</span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{step.title[locale]}</h3>
                  <p className="mt-2 max-w-lg text-[13px] leading-6 text-muted-foreground">{step.body[locale]}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {step.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-7">
              <Link href="/estatisticas/curiosidades" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
                {pt ? "Ver curiosidades do mercado" : "Read the market curiosities"} <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60 py-20 lg:py-24">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {pt ? "Área do candidato" : "Candidate area"}
            </p>
            <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">
              {pt ? "Seu perfil também é um sinal." : "Your profile is a signal too."}
            </h2>
            <p className="mt-4 max-w-md text-[13.5px] leading-6 text-muted-foreground">
              {pt
                ? "Mantenha um perfil estruturado, veja quais empresas abriram seu currículo e entenda o que o mercado procura em você. Tudo local, tudo fictício, tudo sob seu controle."
                : "Keep a structured profile, see which companies opened your résumé and understand what the market looks for in you. All local, all fictional, all under your control."}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href="/perfil/criar"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy px-4 text-[13px] font-semibold text-white transition-colors hover:bg-navy/92 dark:border dark:border-white/10"
              >
                {pt ? "Criar meu perfil" : "Create my profile"} <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/perfil"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-[13px] font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {pt ? "Ver perfil de demonstração" : "View demo profile"} <Eye className="size-4" />
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { value: "24", label: pt ? "Visitas no mês" : "Views this month" },
                { value: "+18%", label: pt ? "Vs. outubro" : "Vs. October" },
                { value: "100%", label: pt ? "Perfil completo" : "Profile complete" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-[20px] font-semibold tracking-[-0.03em] tabular-nums">{item.value}</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[12px] font-semibold">
                <Users className="size-3.5 text-primary" /> {pt ? "Quem abriu seu perfil" : "Who opened your profile"}
              </p>
              <Badge variant="success">+18%</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { name: "Northwind Talent", role: pt ? "Engenharia Backend Staff" : "Staff Backend Engineering", views: 8, color: "bg-navy" },
                { name: "Atlas People", role: pt ? "Full-Stack Sênior" : "Senior Full-Stack", views: 6, color: "bg-[#0B5FBE]" },
                { name: "Lumen Search", role: pt ? "Tech Lead, Pagamentos" : "Tech Lead, Payments", views: 4, color: "bg-[#0F766E]" },
                { name: "Aurora Finance", role: pt ? "Full-Stack Sênior" : "Senior Full-Stack", views: 3, color: "bg-[#5B3FA8]" },
              ].map((viewer) => (
                <div key={viewer.name} className="flex items-center gap-3 rounded-lg border border-border bg-canvas/60 p-3">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold text-white ${viewer.color}`}>
                    {viewer.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-semibold">{viewer.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{viewer.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9.5px] font-semibold tabular-nums text-muted-foreground">
                    {viewer.views}×
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/quem-me-viu"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-[11.5px] font-semibold hover:bg-muted"
            >
              {pt ? "Ver domínios completos" : "See full domains"} <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {pt ? "Curiosidades" : "Curiosities"}
            </p>
            <h2 className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[38px]">
              {pt ? "Três coisas que o mercado está dizendo." : "Three things the market is telling you."}
            </h2>
          </div>
          <Link
            href="/estatisticas/curiosidades"
            className="hidden items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline sm:inline-flex"
          >
            {pt ? "Todas as leituras" : "All readings"} <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {MARKET_FACTS.slice(0, 3).map((fact) => (
            <Link
              key={fact.id}
              href="/estatisticas/curiosidades"
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-px hover:border-input hover:shadow-lift"
            >
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{fact.label[locale]}</p>
              <p className="mt-5 text-[26px] font-semibold tracking-[-0.04em] tabular-nums">{fact.value}</p>
              <p className="mt-2 flex-1 text-[12px] leading-6 text-muted-foreground">{fact.detail[locale]}</p>
              <ArrowUpRight className="mt-4 size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-semibold">{pt ? "Empresas com mais vagas abertas" : "Companies with the most open roles"}</p>
            <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
              {pt ? "snapshot fictício" : "fictional snapshot"}
            </span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {HIRING_COMPANIES.slice(0, 6).map((company) => (
              <div key={company.id} className="flex items-center gap-3 rounded-lg border border-border bg-canvas/60 px-3 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-navy text-[10px] font-semibold text-white">
                  {company.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-semibold">{company.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{company.sector[locale]}</p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold tabular-nums text-primary">{company.openRoles}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 pb-20 sm:px-8 lg:pb-24">
        <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 site-hero-grid" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/25 blur-[90px]" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white/65">
                <Users className="size-3" /> {pt ? "Feito para candidatos e curiosos" : "Built for candidates and the curious"}
              </div>
              <h2 className="mt-5 max-w-[18ch] text-balance text-[32px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[44px]">
                {pt ? "Sua próxima vaga já está no sinal." : "Your next role is already in the signal."}
              </h2>
              <p className="mt-4 max-w-lg text-[13px] leading-6 text-white/55">
                {pt
                  ? "Navegue pela vitrine, abra uma vaga e veja o mercado por trás dela. Quando estiver pronto, organize seu perfil e acompanhe quem se interessou."
                  : "Browse the board, open a role and see the market behind it. When you're ready, organise your profile and track who took an interest."}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link
                  href="/vagas"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-[13px] font-semibold text-navy transition-colors hover:bg-white/90"
                >
                  {pt ? "Explorar vagas" : "Explore open roles"} <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/perfil"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.09]"
                >
                  {pt ? "Abrir meu perfil" : "Open my profile"} <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="text-[26px] font-semibold tracking-[-0.04em] tabular-nums">48k+</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/40">
                  {pt ? "Sinais / mês" : "Signals / month"}
                </p>
              </div>
              <div>
                <p className="text-[26px] font-semibold tracking-[-0.04em] tabular-nums">358</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/40">
                  {pt ? "Habilidades" : "Tracked skills"}
                </p>
              </div>
              <div>
                <p className="text-[26px] font-semibold tracking-[-0.04em] tabular-nums">11</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/40">
                  {pt ? "Regiões" : "Regions"}
                </p>
              </div>
              <div>
                <p className="text-[26px] font-semibold tracking-[-0.04em] tabular-nums">0</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/40">
                  {pt ? "Spam de recrutador" : "Recruiter spam"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
