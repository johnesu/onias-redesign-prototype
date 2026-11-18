"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  Circle,
  Copy,
  Eye,
  FileText,
  GraduationCap,
  Languages as LanguagesIcon,
  Linkedin,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import type { CandidateProfile, SkillGroupKey } from "@/types";
import { getProfile, hasStoredProfile } from "@/lib/mock-api";
import { MOCK_PROFILE, PROFILE_STATS } from "@/data/mock-profile";
import { availabilityLabel, completionItems, linkedinHandle, type CompletionKey } from "@/lib/profile";
import { formatCurrency, formatDate, formatNumber, relativeTime } from "@/lib/format";
import { copyToClipboard } from "@/lib/utils";
import { regionName, seniorityLabel, workModelLabel } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RingProgress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const SKILL_GROUP_LABELS: Record<SkillGroupKey, { pt: string; en: string }> = {
  core: { pt: "Engenharia principal", en: "Core engineering" },
  cloud: { pt: "Cloud e plataforma", en: "Cloud and platform" },
  data: { pt: "Dados e analytics", en: "Data and analytics" },
  avoid: { pt: "Prefiro evitar", en: "Prefer to avoid" },
};

const STATUS_LABELS = {
  open: { pt: "Aberto a propostas", en: "Open to offers" },
  interviewing: { pt: "Em processos seletivos", en: "Interviewing" },
  "not-looking": { pt: "Não buscando agora", en: "Not looking right now" },
} as const;

const LANGUAGE_LEVEL = {
  1: { pt: "Intermediário", en: "Intermediate" },
  2: { pt: "Fluente / profissional", en: "Fluent / professional" },
} as const;

const COMPLETION_LABELS: Record<CompletionKey, { pt: string; en: string }> = {
  core: { pt: "Informações principais", en: "Core information" },
  summary: { pt: "Resumo profissional", en: "Professional summary" },
  experience: { pt: "Experiência profissional", en: "Work experience" },
  skills: { pt: "Habilidades principais", en: "Core skills" },
  salary: { pt: "Expectativa salarial", en: "Salary expectations" },
  languages: { pt: "Idiomas", en: "Spoken languages" },
  linkedin: { pt: "LinkedIn verificado", en: "Verified LinkedIn" },
  regions: { pt: "Regiões aceitas", en: "Accepted regions" },
  education: { pt: "Formação", en: "Education" },
  certification: { pt: "Certificação", en: "Certification" },
};

const COMPLETION_HINTS: Record<CompletionKey, { pt: string; en: string }> = {
  core: { pt: "Nome, cargo, e-mail, telefone e DDD", en: "Name, role, email, phone and area code" },
  summary: { pt: "Ao menos 40 caracteres", en: "At least 40 characters" },
  experience: { pt: "Adicione um cargo no editor", en: "Add one role in the editor" },
  skills: { pt: "Ao menos três habilidades", en: "At least three skills" },
  salary: { pt: "Uma referência CLT, PJ ou BTC", en: "One CLT, PJ or BTC reference" },
  languages: { pt: "Um idioma declarado", en: "One declared language" },
  linkedin: { pt: "Endereço linkedin.com/in/…", en: "A linkedin.com/in/… address" },
  regions: { pt: "Onde você aceita trabalhar", en: "Where you accept work" },
  education: { pt: "Curso e instituição", en: "Course and institution" },
  certification: { pt: "Nome, emissora e ano", en: "Name, issuer and year" },
};

export function ProfileView() {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const [profile, setProfile] = React.useState<CandidateProfile>(MOCK_PROFILE);
  const [ownProfile, setOwnProfile] = React.useState(false);

  React.useEffect(() => {
    const sync = () => {
      setProfile(getProfile());
      setOwnProfile(hasStoredProfile());
    };
    sync();
    window.addEventListener("onias:profile", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("onias:profile", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const completion = completionItems(profile);
  const completionDone = completion.filter((item) => item.done).length;
  const visibleSkills = profile.skills.slice(0, 18);
  const hasSalary = profile.salary.clt > 0 || profile.salary.pj > 0 || profile.salary.btc > 0;
  const hasContact = Boolean(profile.email || profile.phone || profile.location);

  const copyLink = async () => {
    const ok = await copyToClipboard(profile.linkedin);
    if (ok) {
      toast.success(pt ? "LinkedIn copiado" : "LinkedIn address copied", {
        description: ownProfile
          ? pt
            ? "Endereço salvo neste perfil local."
            : "Address stored in this local profile."
          : pt
            ? "Endereço fictício de demonstração."
            : "Fictional demonstration URL only.",
      });
    } else {
      toast.error(pt ? "Não foi possível copiar" : "Could not access the clipboard");
    }
  };

  const quickStats = [
    {
      icon: Eye,
      label: pt ? "Visitas de recrutadores" : "Recruiter views",
      value: formatNumber(PROFILE_STATS.recruiterViews, locale),
      detail: `${PROFILE_STATS.recruiterViewsTrend > 0 ? "+" : ""}${PROFILE_STATS.recruiterViewsTrend}% ${pt ? "vs. outubro" : "vs. October"}`,
      href: "/quem-me-viu",
    },
    {
      icon: Sparkles,
      label: pt ? "Matches inteligentes" : "Smart matches",
      value: formatNumber(PROFILE_STATS.smartMatches, locale),
      detail: pt ? "Vagas compatíveis com suas skills" : "Roles matching your skills",
      href: "/estatisticas/oferta-demanda",
    },
    {
      icon: Users,
      label: pt ? "Aparições em buscas" : "Search appearances",
      value: formatNumber(PROFILE_STATS.searchAppearances, locale),
      detail: pt ? "Últimos 30 dias" : "Last 30 days",
    },
    {
      icon: Star,
      label: pt ? "Salvo por recrutadores" : "Saved by recruiters",
      value: formatNumber(PROFILE_STATS.savedByRecruiters, locale),
      detail: pt ? "Em 4 domínios" : "Across 4 domains",
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
            <span className="text-foreground">{copy.nav.profile}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {copy.nav.profile}
                </h1>
                <Badge variant="accent">{copy.nav.candidate}</Badge>
                {profile.verifiedLinkedin && (
                  <Badge variant="success" className="gap-1">
                    <BadgeCheck className="size-3" /> LinkedIn
                  </Badge>
                )}
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "É isto que um recrutador vê quando seu perfil aparece em uma busca. O modelo é o mesmo do produto original: um link do LinkedIn, nenhum arquivo de currículo enviado."
                  : "This is what a recruiter sees when your profile appears in a search. The model mirrors the original product: a LinkedIn link, no uploaded CV file."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/curriculo">
                  <FileText /> {copy.nav.resume}
                </Link>
              </Button>
              <Button asChild variant="navy" size="sm">
                <Link href="/perfil/editar">
                  <Pencil /> {pt ? "Editar perfil" : "Edit profile"}
                </Link>
              </Button>
            </div>
          </div>

          {!pt && (
            <p className="mt-4 max-w-2xl rounded-lg border border-dashed border-border bg-canvas px-3 py-2 text-[10.5px] leading-5 text-muted-foreground">
              {copy.common.profileContentNote}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        {!ownProfile && (
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-primary/25 bg-accent px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2.5 text-[12px] leading-5">
              <Wand2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-semibold">
                  {pt ? "Este é o perfil de demonstração de Daniel Martins." : "This is Daniel Martins' demonstration profile."}
                </span>{" "}
                {pt
                  ? "Crie o seu em três passos para substituí-lo neste navegador."
                  : "Create yours in three steps to replace it in this browser."}
              </span>
            </p>
            <Button asChild variant="navy" size="sm" className="shrink-0">
              <Link href="/perfil/criar">
                <Wand2 /> {pt ? "Criar meu perfil" : "Create my profile"}
              </Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            const body = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{stat.label}</span>
                  <Icon className="size-3.5 text-muted-foreground" />
                </div>
                <p className="mt-2.5 text-[24px] font-semibold leading-none tracking-[-0.035em] tabular-nums">{stat.value}</p>
                <p className="mt-1.5 text-[10.5px] leading-4 text-muted-foreground">{stat.detail}</p>
              </>
            );
            return stat.href ? (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-px hover:border-input hover:shadow-lift"
              >
                {body}
              </Link>
            ) : (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                {body}
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid items-start gap-5 xl:grid-cols-[312px_minmax(0,1fr)]">
          <div className="space-y-4 xl:sticky xl:top-24">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="h-20 bg-navy sidebar-grid" />
              <div className="-mt-10 px-5 pb-5">
                <Avatar name={profile.name} size="xl" verified={profile.verifiedLinkedin} className="ring-4 ring-card" />
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge variant="success">
                    <span className="size-1.5 rounded-full bg-success" /> {STATUS_LABELS[profile.status][locale]}
                  </Badge>
                  <Badge variant="outline">{seniorityLabel(profile.seniority, locale)}</Badge>
                </div>
                <h2 className="mt-2.5 text-[20px] font-semibold tracking-[-0.03em]">{profile.name}</h2>
                <p className="mt-0.5 text-[12.5px] font-medium text-muted-foreground">{profile.title}</p>

                <dl className="mt-4 space-y-2 text-[12px]">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                    <span>
                      {profile.location || (pt ? "Local não informado" : "Location not provided")}
                      <span className="block text-[10.5px] text-muted-foreground">
                        {pt ? "Aceita" : "Open to"}:{" "}
                        {profile.regions.length
                          ? profile.regions.map((slug) => regionName(slug, locale)).join(" · ")
                          : profile.region
                            ? regionName(profile.region, locale)
                            : pt
                              ? "não informado"
                              : "not provided"}
                      </span>
                    </span>
                  </div>
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                      <a href={`mailto:${profile.email}`} className="truncate hover:text-primary hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                      <span>
                        {profile.phone}
                        {profile.ddd ? ` · DDD ${profile.ddd}` : ""}
                      </span>
                    </div>
                  )}
                  {profile.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="size-3.5 shrink-0 text-muted-foreground" />
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="truncate text-primary hover:underline"
                      >
                        {linkedinHandle(profile.linkedin)}
                      </a>
                      <button
                        type="button"
                        onClick={copyLink}
                        className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={pt ? "Copiar endereço do LinkedIn" : "Copy LinkedIn address"}
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                  )}
                  {!hasContact && (
                    <p className="rounded-md border border-dashed border-border px-2.5 py-2 text-[10.5px] leading-4 text-muted-foreground">
                      {pt
                        ? "Nenhum dado de contato informado ainda."
                        : "No contact details provided yet."}
                    </p>
                  )}
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border p-2.5">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {pt ? "Experiência" : "Experience"}
                    </p>
                    <p className="mt-0.5 text-[14px] font-semibold tabular-nums">
                      {profile.experienceYears} {pt ? "anos" : "yrs"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-2.5">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {pt ? "Disponibilidade" : "Availability"}
                    </p>
                    <p className="mt-0.5 text-[13px] font-semibold">
                      {availabilityLabel(profile.availabilityDays, locale)}
                    </p>
                  </div>
                </div>

                <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                  <Link href="/perfil/editar">
                    <Pencil /> {pt ? "Melhorar este perfil" : "Improve this profile"}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold">{pt ? "Força do perfil" : "Profile strength"}</p>
                <RingProgress value={profile.completion} size={42} stroke={4} />
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {pt ? "Campos completos melhoram sua posição na busca" : "Complete fields improve recruiter search placement"}
              </p>
              <div className="mt-2">
                {completion.map((item) => (
                  <div key={item.key} className="flex items-start gap-2 border-b border-border py-2 last:border-0">
                    {item.done ? (
                      <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                    ) : (
                      <Circle className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/50" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[11.5px]", item.done ? "font-medium" : "font-semibold text-foreground")}>
                        {COMPLETION_LABELS[item.key][locale]}
                      </p>
                      <p className="mt-0.5 text-[9.5px] leading-4 text-muted-foreground">
                        {COMPLETION_HINTS[item.key][locale]}
                      </p>
                    </div>
                    {!item.done && (
                      <span className="mt-0.5 shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        +{item.weight}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10.5px] text-muted-foreground">
                {completionDone} {pt ? "de" : "of"} {completion.length}{" "}
                {pt ? "verificações concluídas." : "profile checks complete."}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${profile.completion}%` }} />
              </div>
              {completionDone < completion.length && (
                <Button asChild variant="outline" size="xs" className="mt-3 w-full">
                  <Link href="/perfil/editar">
                    <Pencil /> {pt ? "Completar perfil" : "Complete profile"}
                  </Link>
                </Button>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <p className="text-[13px] font-semibold">{pt ? "Privacidade" : "Privacy"}</p>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {pt ? "Quem não deve receber seu LinkedIn" : "Who must not receive your LinkedIn"}
              </p>
              {profile.notAllowedCompanies.length ? (
                <ul className="mt-2.5 space-y-1.5">
                  {profile.notAllowedCompanies.map((domain) => (
                    <li
                      key={domain}
                      className="flex items-center gap-2 rounded-md bg-muted/60 px-2.5 py-1.5 font-mono text-[10.5px]"
                    >
                      <span className="size-1.5 rounded-full bg-danger" />
                      {domain}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {pt ? "Nenhum domínio bloqueado." : "No blocked domains."}
                </p>
              )}
              <p className="mt-2.5 text-[10px] leading-4 text-muted-foreground">
                {pt
                  ? "Domínios de e-mail pessoal não podem ser filtrados. Recrutadores de domínios bloqueados veem o perfil sem os dados de contato."
                  : "Personal email domains cannot be filtered. Recruiters from blocked domains still see the profile without contact details."}
              </p>
              <Link
                href="/perfil/editar"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                {pt ? "Gerenciar privacidade" : "Manage privacy"} <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Resumo profissional" : "Professional summary"}</h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {pt ? "Atualizado" : "Updated"} {relativeTime(profile.lastActive, locale)}
                  </p>
                </div>
                <Button asChild variant="ghost" size="xs">
                  <Link href="/perfil/editar">
                    <Pencil /> {pt ? "Editar" : "Edit"}
                  </Link>
                </Button>
              </div>
              <p className="mt-3 text-[13.5px] leading-7 text-foreground/85">
                {profile.summary || (
                  <span className="text-muted-foreground">
                    {pt
                      ? "Nenhum resumo profissional ainda. Conte em um parágrafo o que você construiu e os problemas que resolve."
                      : "No professional summary yet. Describe in one paragraph what you have built and the problems you solve."}
                  </span>
                )}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <InfoBlock
                  icon={BriefcaseBusiness}
                  label={pt ? "Buscando" : "Looking for"}
                  value={profile.desiredJob || (pt ? "Não informado" : "Not provided")}
                />
                <InfoBlock
                  icon={Building2}
                  label={pt ? "Último cargo" : "Last role"}
                  value={profile.lastJob || (pt ? "Não informado" : "Not provided")}
                />
                <InfoBlock icon={MapPin} label={pt ? "Modelo de trabalho" : "Work model"} value={workModelLabel(profile.workModel, locale)} />
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-card sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Experiência" : "Experience"}</h2>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {profile.experiences.length
                      ? pt
                        ? `${profile.experienceYears} ${profile.experienceYears === 1 ? "ano" : "anos"} de experiência declarada`
                        : `${profile.experienceYears} ${profile.experienceYears === 1 ? "year" : "years"} of declared experience`
                      : pt
                        ? "Nenhum cargo declarado ainda"
                        : "No roles declared yet"}
                  </p>
                </div>
                <Button asChild variant="ghost" size="xs">
                  <Link href="/perfil/editar">{pt ? "Gerenciar" : "Manage"}</Link>
                </Button>
              </div>
              {profile.experiences.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-border px-4 py-5 text-center">
                  <BriefcaseBusiness className="mx-auto size-5 text-muted-foreground/60" />
                  <p className="mt-2 text-[12px] font-medium">{pt ? "Adicione seu primeiro cargo" : "Add your first role"}</p>
                  <p className="mx-auto mt-1 max-w-md text-[10.5px] leading-5 text-muted-foreground">
                    {pt
                      ? "Experiências dão contexto ao seu resumo e aparecem na prévia do currículo."
                      : "Roles give your summary context and appear in the résumé preview."}
                  </p>
                  <Button asChild variant="outline" size="xs" className="mt-3">
                    <Link href="/perfil/editar">
                      <Pencil /> {pt ? "Adicionar experiência" : "Add experience"}
                    </Link>
                  </Button>
                </div>
              ) : (
                <ol className="mt-4 space-y-5 border-l border-border pl-5">
                  {profile.experiences.map((experience, index) => (
                    <li key={experience.id} className="relative">
                      <span className="absolute -left-[26px] top-1 flex size-3 items-center justify-center rounded-full border-2 border-card bg-primary ring-1 ring-primary/20" />
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h3 className="text-[13.5px] font-semibold">{experience.role}</h3>
                        <span className="text-[10.5px] font-medium text-muted-foreground">{experience.period}</span>
                      </div>
                      <p className="mt-0.5 text-[11.5px] font-medium text-primary">
                        {experience.company}
                        {experience.location && <span className="text-muted-foreground"> · {experience.location}</span>}
                      </p>
                      {experience.summary && (
                        <p className="mt-1.5 text-[12px] leading-6 text-muted-foreground">{experience.summary}</p>
                      )}
                      {index === 0 && experience.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {experience.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-2 text-[11.5px] leading-5 text-foreground/80">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Habilidades" : "Skills"}</h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt ? "Usadas nos filtros de recrutadores" : "Used by recruiter filters"}
                </p>
                <div className="mt-3.5 space-y-3">
                  {profile.skillGroups.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border px-3 py-2.5 text-[11px] leading-5 text-muted-foreground">
                      {pt
                        ? "Nenhuma habilidade declarada. Adicione pelo menos três no editor para aparecer nos filtros."
                        : "No skills declared. Add at least three in the editor to appear in filters."}
                    </p>
                  )}
                  {profile.skillGroups.map((group) => (
                    <div key={group.key ?? group.label}>
                      <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                        {group.key ? SKILL_GROUP_LABELS[group.key][locale] : group.label}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant={group.key === "avoid" ? "outline" : "secondary"}
                            className={
                              group.key === "avoid" ? "text-muted-foreground line-through decoration-border" : undefined
                            }
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {visibleSkills.length === 0 && (
                  <Link
                    href="/perfil/editar"
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    {pt ? "Adicionar habilidades" : "Add skills"} <ArrowRight className="size-3" />
                  </Link>
                )}
              </section>

              <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <LanguagesIcon className="size-4 text-muted-foreground" />
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Idiomas" : "Languages"}</h2>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt ? "Níveis declarados pelo candidato" : "Levels declared by the candidate"}
                </p>
                <div className="mt-4 space-y-3">
                  {profile.languages.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border px-3 py-2.5 text-[11px] leading-5 text-muted-foreground">
                      {pt ? "Nenhum idioma declarado ainda." : "No languages declared yet."}
                    </p>
                  )}
                  {profile.languages.map((language) => (
                    <div key={language.name}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium">{language.name}</span>
                        <span className="text-[10.5px] text-muted-foreground">{LANGUAGE_LEVEL[language.level][locale]}</span>
                      </div>
                      <div className="mt-1 flex gap-1">
                        <span className="h-1.5 flex-1 rounded-full bg-primary" />
                        <span className={cn("h-1.5 flex-1 rounded-full", language.level === 2 ? "bg-primary" : "bg-muted")} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-lg bg-muted/60 p-2.5 text-[10px] leading-4 text-muted-foreground">
                  {pt
                    ? "Os níveis são opcionais. O produto original usa duas faixas: intermediário e fluente."
                    : "Language levels are optional. The original product uses two bands: intermediate and fluent."}
                </p>
              </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Formação" : "Education"}</h2>
                </div>
                <div className="mt-3.5 space-y-3">
                  {profile.education.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border px-3 py-2.5 text-[11px] leading-5 text-muted-foreground">
                      {pt
                        ? "Nenhuma formação declarada. Adicione curso e instituição no editor."
                        : "No education declared. Add a course and institution in the editor."}
                    </p>
                  )}
                  {profile.education.map((item) => (
                    <div key={item.id}>
                      <p className="text-[12px] font-semibold">{item.degree}</p>
                      <p className="text-[10.5px] text-muted-foreground">
                        {item.institution} · {item.year}
                      </p>
                      {item.detail && <p className="mt-0.5 text-[10px] text-muted-foreground">{item.detail}</p>}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-muted-foreground" />
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Certificações" : "Certifications"}</h2>
                </div>
                <div className="mt-3.5 space-y-3">
                  {profile.certifications.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border px-3 py-2.5 text-[11px] leading-5 text-muted-foreground">
                      {pt ? "Nenhuma certificação declarada ainda." : "No certifications declared yet."}
                    </p>
                  )}
                  {profile.certifications.map((item) => (
                    <div key={item.id}>
                      <p className="text-[12px] font-semibold leading-5">{item.name}</p>
                      <p className="text-[10.5px] text-muted-foreground">
                        {item.issuer} · {item.year}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/perfil/editar"
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  {pt ? "Adicionar certificação" : "Add certification"} <ArrowRight className="size-3" />
                </Link>
              </section>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <Wallet className="size-4 text-muted-foreground" />
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{pt ? "Expectativa salarial" : "Salary expectations"}</h2>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {pt ? "Valores mensais brutos em BRL" : "Monthly gross values in BRL"}
                </p>
                <div className="mt-3.5 grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
                  {[
                    { label: "CLT", value: profile.salary.clt },
                    { label: "PJ", value: profile.salary.pj },
                    { label: "BTC", value: profile.salary.btc },
                  ].map((item) => (
                    <div key={item.label} className="p-3 text-center">
                      <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-[12px] font-semibold tabular-nums">
                        {item.value > 0 ? formatCurrency(item.value, locale) : "—"}
                      </p>
                    </div>
                  ))}
                </div>
                {!hasSalary ? (
                  <p className="mt-2.5 rounded-lg border border-dashed border-border px-3 py-2 text-[10.5px] leading-4 text-muted-foreground">
                    {pt
                      ? "Nenhuma expectativa informada. Recrutadores veem “a combinar”."
                      : "No expectations provided. Recruiters see “to be discussed”."}
                  </p>
                ) : (
                  profile.salary.negotiable && (
                    <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
                      <Check className="size-3 text-success" /> {pt ? "Aberto a negociação" : "Open to negotiation"}
                    </p>
                  )
                )}
              </section>

              <section className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
                    {pt ? "Disponibilidade e preferências" : "Availability and preferences"}
                  </h2>
                </div>
                <div className="mt-3.5 space-y-2.5 text-[11.5px]">
                  <PreferenceRow
                    label={pt ? "Aviso prévio" : "Notice period"}
                    value={availabilityLabel(profile.availabilityDays, locale)}
                  />
                  <PreferenceRow
                    label={pt ? "Vaga temporária" : "Temporary role"}
                    value={
                      profile.temporaryJobMonths > 0
                        ? `${profile.temporaryJobMonths} ${pt ? "meses" : "months"}`
                        : pt
                          ? "Não"
                          : "Not open"
                    }
                  />
                  <PreferenceRow label={pt ? "Disposto a viajar" : "Willing to travel"} value={profile.travel ? (pt ? "Sim" : "Yes") : pt ? "Não" : "No"} />
                  <PreferenceRow
                    label={pt ? "PCD" : "PCD status"}
                    value={profile.pcd ? (pt ? "Autodeclarado" : "Self-declared") : pt ? "Não declarado" : "Not declared"}
                  />
                  <PreferenceRow label={pt ? "Modelo" : "Work model"} value={workModelLabel(profile.workModel, locale)} />
                  <PreferenceRow label={pt ? "Perfil criado" : "Profile added"} value={formatDate(profile.insertionDate, locale)} last />
                </div>
              </section>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Banknote className="size-4" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold">{pt ? "Guarde uma cópia do seu perfil" : "Keep a copy of your profile"}</p>
                  <p className="text-[10.5px] leading-5 text-muted-foreground">
                    {pt
                      ? "A prévia do currículo pode ser impressa em PDF. Nenhum arquivo sai do navegador."
                      : "The résumé preview can be printed to PDF. Files never leave your browser."}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/curriculo">
                  {pt ? "Abrir prévia" : "Open preview"} <ArrowUpRight />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/quem-me-viu"
                className="inline-flex flex-1 items-center justify-between gap-2 rounded-xl border border-border bg-card p-4 text-[12px] font-semibold shadow-card transition-colors hover:bg-muted sm:flex-none"
              >
                <span className="flex items-center gap-2">
                  <Eye className="size-4 text-primary" /> {copy.nav.whoViewed}
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Link>
              <Link
                href="/vagas"
                className="inline-flex flex-1 items-center justify-between gap-2 rounded-xl border border-border bg-card p-4 text-[12px] font-semibold shadow-card transition-colors hover:bg-muted sm:flex-none"
              >
                <span className="flex items-center gap-2">
                  <BriefcaseBusiness className="size-4 text-primary" /> {copy.nav.jobs}
                </span>
                <ArrowRight className="size-3.5 text-muted-foreground" />
              </Link>
            </div>

            <p className="text-[10px] leading-5 text-muted-foreground">
              {ownProfile
                ? pt
                  ? "Perfil salvo apenas no localStorage deste navegador. Nada é enviado a um servidor; limpar os dados do site apaga o perfil."
                  : "Profile stored only in this browser's localStorage. Nothing is sent to a server; clearing site data deletes it."
                : pt
                  ? "Perfil fictício de demonstração. Crie o seu para substituí-lo; as edições ficam salvas apenas no localStorage deste navegador."
                  : "Fictional demonstration profile. Create yours to replace it; edits are stored only in this browser's localStorage."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" />
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em]">{label}</span>
      </div>
      <p className="mt-1 text-[11.5px] font-medium">{value}</p>
    </div>
  );
}

function PreferenceRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn("flex items-center justify-between gap-3", !last && "border-b border-border pb-2.5")}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
