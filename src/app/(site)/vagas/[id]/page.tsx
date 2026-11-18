import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobLogo } from "@/components/site/job-logo";
import { ApplyDialog } from "@/components/site/apply-dialog";
import { CopyLinkButton } from "@/components/site/copy-link-button";
import { SaveJobButton } from "@/components/site/save-job-button";
import { JobCard } from "@/components/site/job-card";
import { getJob, JOBS, relatedJobs } from "@/data/mock-jobs";
import { getProfile } from "@/lib/mock-api";
import { jobSalary, jobSkillLabel } from "@/lib/jobs";
import { formatDate, formatNumber } from "@/lib/format";
import { seniorityLabel, workModelLabel } from "@/lib/months";
import { getLocale } from "@/lib/locale-server";
import { siteCopy } from "@/lib/site-copy";

export function generateStaticParams() {
  return JOBS.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return { title: "Vaga não encontrada" };
  const locale = await getLocale();
  return {
    title: `${job.title[locale]} · ${job.company}`,
    description: job.summary[locale],
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const locale = await getLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const profile = getProfile();
  const overlap = job.skills.filter((skill) =>
    profile.skills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase()),
  );
  const matchPercent = Math.round((overlap.length / job.skills.length) * 100);
  const related = relatedJobs(job, 3);

  const facts = [
    { label: copy.common.salary, value: `${jobSalary(job, locale)}${copy.common.perMonth}`, icon: Banknote },
    { label: copy.common.workModel, value: workModelLabel(job.workModel, locale), icon: Wifi },
    { label: copy.common.seniority, value: seniorityLabel(job.seniority, locale), icon: BriefcaseBusiness },
    { label: copy.common.location, value: job.location[locale], icon: MapPin },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-60" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">
          <nav className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-foreground">
              {pt ? "Início" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/vagas" className="hover:text-foreground">
              {copy.nav.jobs}
            </Link>
            <span>/</span>
            <span className="max-w-[240px] truncate text-foreground sm:max-w-none">{job.title[locale]}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <JobLogo job={job} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="accent">{job.company}</Badge>
                  {job.featured && (
                    <Badge variant="warning" className="gap-1">
                      <Sparkles className="size-3" /> {copy.common.featured}
                    </Badge>
                  )}
                  {overlap.length > 0 && (
                    <Badge variant="success" className="gap-1">
                      <Check className="size-3" /> {matchPercent}% {pt ? "de match" : "match"}
                    </Badge>
                  )}
                </div>
                <h1 className="mt-3 text-balance text-[28px] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-[38px]">
                  {job.title[locale]}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-3.5" /> {job.company} · {job.companySize[locale]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {job.location[locale]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> {formatDate(job.postedAt, locale)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link href="/vagas">
                  <ArrowLeft /> {copy.common.back}
                </Link>
              </Button>
              <SaveJobButton id={job.id} title={job.title[locale]} withLabel />
              <CopyLinkButton />
              <ApplyDialog job={job} className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_336px]">
          <div className="min-w-0 space-y-4">
            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                {pt ? "Sobre a vaga" : "About the role"}
              </p>
              <p className="mt-3 text-[14px] leading-7 text-foreground/90">{job.summary[locale]}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {job.skills.map((skill) => {
                  const known = overlap.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={
                        known
                          ? "inline-flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[10.5px] font-semibold text-accent-foreground"
                          : "inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[10.5px] font-medium text-muted-foreground"
                      }
                    >
                      {known && <Check className="size-2.5" />}
                      {jobSkillLabel(skill, locale)}
                    </span>
                  );
                })}
              </div>
              {overlap.length > 0 && (
                <p className="mt-2.5 text-[10.5px] text-muted-foreground">
                  {pt
                    ? `${overlap.length} de ${job.skills.length} habilidades já estão no seu perfil.`
                    : `${overlap.length} of ${job.skills.length} skills are already on your profile.`}
                </p>
              )}
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                {pt ? "O que você vai fazer" : "What you will do"}
              </h2>
              <ul className="mt-4 space-y-3">
                {job.responsibilities[locale].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-foreground/90">
                    <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Check className="size-2.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                {pt ? "O que esperamos" : "What we expect"}
              </h2>
              <ul className="mt-4 space-y-3">
                {job.requirements[locale].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13px] leading-6 text-foreground/90">
                    <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Check className="size-2.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                {pt ? "Benefícios" : "Benefits"}
              </h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {job.benefits[locale].map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 rounded-lg border border-border bg-canvas/60 px-3 py-2.5 text-[12px] leading-5">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                    {benefit}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                {pt ? "Sobre a empresa" : "About the company"}
              </h2>
              <div className="mt-4 flex items-start gap-3">
                <JobLogo job={job} size="md" />
                <div>
                  <p className="text-[13px] font-semibold">{job.company}</p>
                  <p className="mt-1 text-[12.5px] leading-6 text-muted-foreground">{job.companyDescription[locale]}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Users className="size-3" /> {job.companySize[locale]}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-dashed border-border bg-card p-5">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-[#2AABEE]/12 text-[#1D8FC7]">
                  <Radio className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold">
                    {pt ? "Fonte original" : "Original source"}: {job.sourceChannel}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                    {formatNumber(job.sourceMembers, locale)} {pt ? "membros" : "members"} · {job.sourceNote[locale]}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl border border-border bg-card p-5 shadow-card">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {copy.common.salary}
                </p>
                <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em] tabular-nums">
                  {jobSalary(job, locale)}
                </p>
                <p className="text-[10.5px] text-muted-foreground">{pt ? "Mensal, bruto" : "Monthly, gross"}</p>

                <div className="mt-4 grid gap-2">
                  {facts.slice(1).map((fact) => {
                    const Icon = fact.icon;
                    return (
                      <div key={fact.label} className="flex items-center gap-2.5 rounded-lg border border-border bg-canvas/60 px-3 py-2.5">
                        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-[11px] text-muted-foreground">{fact.label}</span>
                        <span className="ml-auto text-[11.5px] font-semibold">{fact.value}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-2.5 rounded-lg border border-border bg-canvas/60 px-3 py-2.5">
                    <Users className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{pt ? "Candidaturas" : "Applicants"}</span>
                    <span className="ml-auto text-[11.5px] font-semibold tabular-nums">{job.applicants}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg border border-border bg-canvas/60 px-3 py-2.5">
                    <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{pt ? "Publicada" : "Posted"}</span>
                    <span className="ml-auto text-[11.5px] font-semibold">{formatDate(job.postedAt, locale)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <ApplyDialog job={job} className="w-full" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <SaveJobButton id={job.id} title={job.title[locale]} withLabel className="flex-1" />
                  <CopyLinkButton />
                </div>

                <p className="mt-3 flex items-start gap-2 rounded-lg bg-muted/60 p-2.5 text-[10px] leading-5 text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
                  {pt
                    ? "Fluxo simulado. Nenhuma mensagem ou dado sai deste navegador."
                    : "Simulated flow. No message or data leaves this browser."}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-navy p-5 text-white">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  {pt ? "Contexto de mercado" : "Market context"}
                </p>
                <p className="mt-2 text-[13px] leading-6 text-white/80">
                  {pt
                    ? "Veja quanto essa combinação de habilidades aparece nas estatísticas e onde estão as maiores lacunas."
                    : "See how this skill combination shows up in the statistics and where the biggest gaps are."}
                </p>
                <Link
                  href="/estatisticas/oferta-demanda"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-white hover:underline"
                >
                  {pt ? "Explorar oferta × demanda" : "Explore supply × demand"} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {pt ? "Vagas relacionadas" : "Related roles"}
                </p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">
                  {pt ? "Continue explorando" : "Keep exploring"}
                </h2>
              </div>
              <Link href="/vagas" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary hover:underline">
                {copy.common.viewAll} <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <JobCard key={item.id} job={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
