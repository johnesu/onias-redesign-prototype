"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Ban,
  Building2,
  CalendarDays,
  Check,
  Eye,
  Fingerprint,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Unlock,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { CandidateProfile, ProfileViewEvent, ViewerDomain } from "@/types";
import { getProfile, saveProfile } from "@/lib/mock-api";
import {
  getProfileEvents,
  getProfileVisibilityHistory,
  getViewersForMonth,
  viewerRoleLabel,
  VISIBILITY_MONTHS,
} from "@/data/mock-activity";
import { MOCK_PROFILE, PROFILE_STATS } from "@/data/mock-profile";
import { formatDateShort, formatDateTime, formatNumber, relativeTime } from "@/lib/format";
import { monthLabel } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/ui/chart-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { VisibilityChart } from "@/components/charts/visibility-chart";
import { cn } from "@/lib/utils";

const UNLOCK_KEY = "onias.demo.v1.who-viewed-unlocked";

const KIND_LABELS: Record<ViewerDomain["kind"], { pt: string; en: string }> = {
  company: { pt: "Empresa contratante", en: "Hiring company" },
  consultancy: { pt: "Consultoria de recrutamento", en: "Recruitment consultancy" },
  independent: { pt: "Recrutador independente", en: "Independent recruiter" },
};

const EVENT_LABELS: Record<ProfileViewEvent["kind"], { pt: string; en: string }> = {
  view: { pt: "Abriu seu perfil", en: "Opened your profile" },
  search: { pt: "Encontrou você em uma busca", en: "Found you in a search" },
  save: { pt: "Salvou seu perfil", en: "Saved your profile" },
  match: { pt: "Marcou um match com vaga", en: "Flagged a role match" },
};

const EVENT_ICONS: Record<ProfileViewEvent["kind"], React.ComponentType<{ className?: string }>> = {
  view: Eye,
  search: Search,
  save: Fingerprint,
  match: Sparkles,
};

export function WhoViewedView() {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);

  const [profile, setProfile] = React.useState<CandidateProfile>(MOCK_PROFILE);
  const [month, setMonth] = React.useState(VISIBILITY_MONTHS[0]);
  const [unlocked, setUnlocked] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    const current = getProfile();
    setProfile(current);
    setEmail(current.email);
    try {
      setUnlocked(window.sessionStorage.getItem(UNLOCK_KEY) === "1");
    } catch {
      setUnlocked(false);
    }
  }, []);

  const history = React.useMemo(() => getProfileVisibilityHistory(), []);
  const viewers = React.useMemo(() => getViewersForMonth(month), [month]);
  const events = React.useMemo(() => getProfileEvents(month), [month]);

  const current = history.find((item) => item.month === month) ?? history[history.length - 1];
  const index = history.findIndex((item) => item.month === month);
  const previous = index > 0 ? history[index - 1] : undefined;
  const viewsDelta = previous ? Math.round(((current.views - previous.views) / previous.views) * 100) : 0;
  const blocked = React.useMemo(
    () => new Set(profile.notAllowedCompanies.map((domain) => domain.toLowerCase())),
    [profile.notAllowedCompanies],
  );

  const unlock = (event: React.FormEvent) => {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(pt ? "Informe um e-mail válido para continuar." : "Enter a valid email to continue.");
      return;
    }
    setError("");
    setSending(true);
    window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(UNLOCK_KEY, "1");
      } catch {
        /* session storage may be unavailable; the gate still opens for this render */
      }
      setUnlocked(true);
      setSending(false);
      toast.success(pt ? "Identidade confirmada" : "Identity confirmed", {
        description: pt
          ? "Simulação: nenhum e-mail foi enviado. O acesso fica liberado nesta aba."
          : "Simulation: no email was sent. Access stays unlocked in this tab.",
      });
    }, 850);
  };

  const lockAgain = () => {
    try {
      window.sessionStorage.removeItem(UNLOCK_KEY);
    } catch {
      /* ignore */
    }
    setUnlocked(false);
    toast.info(pt ? "Domínios ocultados novamente" : "Domains hidden again");
  };

  const toggleBlock = async (viewer: ViewerDomain) => {
    const isBlocked = blocked.has(viewer.domain.toLowerCase());
    const nextDomains = isBlocked
      ? profile.notAllowedCompanies.filter((domain) => domain.toLowerCase() !== viewer.domain.toLowerCase())
      : [...profile.notAllowedCompanies, viewer.domain];
    const next: CandidateProfile = { ...profile, notAllowedCompanies: nextDomains };
    setProfile(next);
    await saveProfile(next);
    toast.success(
      isBlocked
        ? pt
          ? "Domínio desbloqueado"
          : "Domain unblocked"
        : pt
          ? "Domínio bloqueado"
          : "Domain blocked",
      {
        description: isBlocked
          ? pt
            ? `${viewer.domain} volta a ver seus dados de contato.`
            : `${viewer.domain} can see your contact details again.`
          : pt
            ? `${viewer.domain} verá seu perfil sem os dados de contato.`
            : `${viewer.domain} will see your profile without contact details.`,
      },
    );
  };

  const kpis = [
    {
      icon: Eye,
      label: pt ? "Visualizações" : "Profile views",
      value: formatNumber(current.views, locale),
      detail:
        previous && viewsDelta !== 0
          ? `${viewsDelta > 0 ? "+" : ""}${viewsDelta}% ${pt ? "vs. mês anterior" : "vs. previous month"}`
          : pt
            ? "No mês selecionado"
            : "In the selected month",
      tone: viewsDelta >= 0 ? "success" : "danger",
      direction: viewsDelta >= 0 ? "up" : "down",
    },
    {
      icon: Search,
      label: pt ? "Aparições em buscas" : "Search appearances",
      value: formatNumber(current.appearances, locale),
      detail: pt ? "Quando seu perfil apareceu em filtros" : "When your profile surfaced in filters",
    },
    {
      icon: Users,
      label: pt ? "Domínios únicos" : "Unique domains",
      value: formatNumber(viewers.length, locale),
      detail: pt ? "Empresas e consultorias distintas" : "Distinct companies and consultancies",
    },
    {
      icon: Fingerprint,
      label: pt ? "Salvo por recrutadores" : "Saved by recruiters",
      value: formatNumber(PROFILE_STATS.savedByRecruiters, locale),
      detail: pt ? "Acumulado nos últimos 90 dias" : "Rolling 90-day total",
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
            <Link href="/perfil" className="hover:text-foreground">
              {copy.nav.profile}
            </Link>
            <span>/</span>
            <span className="text-foreground">{copy.nav.whoViewed}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {copy.nav.whoViewed}
                </h1>
                <Badge variant="accent">
                  <Eye className="size-2.5" /> {pt ? "Visibilidade do perfil" : "Profile visibility"}
                </Badge>
                {unlocked && (
                  <Badge variant="success" className="gap-1">
                    <Unlock className="size-2.5" /> {pt ? "Acesso liberado" : "Unlocked"}
                  </Badge>
                )}
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "Empresas e consultorias que consultaram seu perfil. A ONIAS revela o domínio do e-mail corporativo, nunca o nome da pessoa que clicou."
                  : "Companies and consultancies that opened your profile. ONIAS reveals the corporate email domain, never the name of the person who clicked."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                aria-label={pt ? "Mês de referência" : "Reference month"}
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                containerClassName="w-[184px]"
                sizeVariant="sm"
              >
                {VISIBILITY_MONTHS.map((key) => (
                  <option key={key} value={key}>
                    {monthLabel(key, locale)}
                  </option>
                ))}
              </Select>
              <Button asChild variant="outline" size="sm">
                <Link href="/perfil">{pt ? "Voltar ao perfil" : "Back to profile"}</Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const DirectionIcon = kpi.direction === "down" ? TrendingDown : TrendingUp;
            return (
              <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {kpi.label}
                  </span>
                  <Icon className="size-3.5 text-muted-foreground" />
                </div>
                <p className="mt-2.5 text-[24px] font-semibold leading-none tracking-[-0.035em] tabular-nums">
                  {kpi.value}
                </p>
                <p
                  className={cn(
                    "mt-1.5 flex items-center gap-1 text-[10.5px] leading-4",
                    kpi.tone === "success"
                      ? "text-success"
                      : kpi.tone === "danger"
                        ? "text-danger"
                        : "text-muted-foreground",
                  )}
                >
                  {kpi.direction && <DirectionIcon className="size-3" />}
                  {kpi.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <ChartCard
              title={pt ? "Visibilidade ao longo do tempo" : "Visibility over time"}
              description={
                pt
                  ? "Visualizações do perfil e aparições em buscas nos últimos seis meses."
                  : "Profile views and search appearances across the last six months."
              }
              action={<Badge variant="outline">{monthLabel(month, locale)}</Badge>}
              legend={[
                { label: pt ? "Visualizações" : "Profile views", color: "hsl(var(--primary))" },
                {
                  label: pt ? "Aparições em buscas" : "Search appearances",
                  color: "hsl(var(--chart-2, 215 60% 62%))",
                },
              ]}
              footer={
                pt
                  ? "Série fictícia de demonstração. O eixo de aparições usa uma escala própria, mais ampla."
                  : "Fictional demo series. Search appearances use their own, wider scale."
              }
            >
              <VisibilityChart data={history} height={250} />
            </ChartCard>

            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
                    {pt ? "Empresas que viram você" : "Companies that viewed you"}
                  </h2>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {unlocked
                      ? pt
                        ? "Domínios corporativos no mês selecionado."
                        : "Corporate domains in the selected month."
                      : pt
                        ? "Confirme seu e-mail para revelar os domínios."
                        : "Confirm your email to reveal the domains."}
                  </p>
                </div>
                {unlocked ? (
                  <Button variant="ghost" size="xs" onClick={lockAgain}>
                    <Lock /> {pt ? "Ocultar domínios" : "Hide domains"}
                  </Button>
                ) : (
                  <Badge variant="warning" className="gap-1">
                    <Lock className="size-2.5" /> {pt ? "Bloqueado" : "Locked"}
                  </Badge>
                )}
              </div>

              {unlocked ? (
                <ul className="divide-y divide-border">
                  {viewers.map((viewer) => {
                    const isBlocked = blocked.has(viewer.domain.toLowerCase());
                    return (
                      <li key={viewer.id} className="p-5">
                        <div className="flex flex-wrap items-start gap-3">
                          <Avatar name={viewer.company} size="md" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h3 className="text-[13.5px] font-semibold">{viewer.company}</h3>
                              <Badge variant={viewer.kind === "company" ? "secondary" : "outline"}>
                                {KIND_LABELS[viewer.kind][locale]}
                              </Badge>
                              {isBlocked && (
                                <Badge variant="danger" className="gap-1">
                                  <Ban className="size-2.5" /> {pt ? "Bloqueado" : "Blocked"}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">{viewer.domain}</p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="size-3" /> {viewer.location}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Eye className="size-3" /> {viewer.views} {pt ? "visitas" : "views"}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays className="size-3" /> {relativeTime(viewer.lastViewed, locale)}
                              </span>
                            </div>
                            {viewer.hiringFor.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {viewer.hiringFor.map((role) => (
                                  <span
                                    key={role}
                                    className="rounded-md border border-border bg-canvas px-1.5 py-0.5 text-[10px] text-muted-foreground"
                                  >
                                    {viewerRoleLabel(role, locale)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button
                            variant={isBlocked ? "outline" : "ghost"}
                            size="xs"
                            onClick={() => toggleBlock(viewer)}
                            className={isBlocked ? undefined : "text-muted-foreground hover:text-danger"}
                          >
                            {isBlocked ? <Check /> : <Ban />}
                            {isBlocked ? (pt ? "Desbloquear" : "Unblock") : pt ? "Bloquear" : "Block"}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="relative">
                  <div aria-hidden="true" className="pointer-events-none space-y-0 divide-y divide-border opacity-60">
                    {viewers.slice(0, 4).map((viewer) => (
                      <div key={viewer.id} className="flex items-start gap-3 p-5">
                        <div className="size-11 shrink-0 rounded-full bg-muted" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-3 w-40 rounded bg-muted" />
                          <div className="h-2.5 w-52 rounded bg-muted/70" />
                          <div className="h-2.5 w-32 rounded bg-muted/60" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-card/40 via-card/85 to-card p-5">
                    <form
                      onSubmit={unlock}
                      className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-lift"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                          <Mail className="size-4" />
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold">
                            {pt ? "Confirme seu e-mail corporativo" : "Confirm your work email"}
                          </p>
                          <p className="text-[10.5px] text-muted-foreground">
                            {pt ? "O mesmo e-mail do seu perfil" : "The same email on your profile"}
                          </p>
                        </div>
                      </div>
                      <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        aria-label={pt ? "E-mail para liberar os domínios" : "Email to unlock domains"}
                        invalid={Boolean(error)}
                        className="mt-3"
                        autoComplete="email"
                      />
                      {error && <p className="mt-1 text-[11px] font-medium text-danger">{error}</p>}
                      <Button type="submit" variant="navy" size="sm" className="mt-3 w-full" disabled={sending}>
                        {sending ? <Loader2 className="animate-spin" /> : <Unlock />}
                        {sending
                          ? pt
                            ? "Verificando…"
                            : "Checking…"
                          : pt
                            ? "Revelar domínios"
                            : "Reveal domains"}
                      </Button>
                      <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-4 text-muted-foreground">
                        <Info className="mt-0.5 size-3 shrink-0" />
                        {pt
                          ? "Simulação: nenhum e-mail é enviado e nenhum dado sai do navegador. O acesso vale apenas para esta aba."
                          : "Simulation: no email is sent and no data leaves your browser. Access lasts for this tab only."}
                      </p>
                    </form>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
                  {pt ? "Atividade recente" : "Recent activity"}
                </h2>
                <Badge variant="outline">{monthLabel(month, locale)}</Badge>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {pt ? "Sinais agregados, sem identificar pessoas." : "Aggregated signals, never individual people."}
              </p>
              <ol className="mt-3 space-y-0">
                {events.map((event) => {
                  const Icon = EVENT_ICONS[event.kind];
                  return (
                    <li key={event.id} className="relative flex gap-3 border-l border-border pb-3.5 pl-4 last:pb-0">
                      <span className="absolute -left-[7px] top-0.5 flex size-3.5 items-center justify-center rounded-full border-2 border-card bg-accent">
                        <Icon className="size-2 text-accent-foreground" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11.5px] font-medium leading-5">{EVENT_LABELS[event.kind][locale]}</p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {unlocked ? event.domain : pt ? "dominio-oculto.com.br" : "hidden-domain.com"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{formatDateShort(event.date, locale)}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-3 rounded-lg bg-muted/60 p-2.5 text-[10px] leading-4 text-muted-foreground">
                {pt
                  ? "Os horários são arredondados e os nomes de recrutadores nunca são exibidos."
                  : "Timestamps are rounded and recruiter names are never shown."}
              </p>
            </section>

            <section id="privacidade" className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h2 className="text-[13px] font-semibold">{pt ? "Domínios bloqueados" : "Blocked domains"}</h2>
              </div>
              <p className="mt-1 text-[10.5px] leading-4 text-muted-foreground">
                {pt
                  ? "Essas empresas veem seu perfil, mas sem os dados de contato."
                  : "These companies still see your profile, but without contact details."}
              </p>
              {profile.notAllowedCompanies.length ? (
                <ul className="mt-2.5 space-y-1.5">
                  {profile.notAllowedCompanies.map((domain) => (
                    <li
                      key={domain}
                      className="flex items-center gap-2 rounded-md bg-muted/60 px-2.5 py-1.5 font-mono text-[10.5px]"
                    >
                      <Ban className="size-3 text-danger" />
                      <span className="truncate">{domain}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {pt ? "Nenhum domínio bloqueado." : "No blocked domains."}
                </p>
              )}
              <Link
                href="/perfil/editar"
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                {pt ? "Gerenciar no perfil" : "Manage in profile"} <ArrowUpRight className="size-3" />
              </Link>
            </section>

            <section className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                <h2 className="text-[13px] font-semibold">{pt ? "Como a ONIAS mostra isso" : "How ONIAS shows this"}</h2>
              </div>
              <ul className="mt-2.5 space-y-2 text-[10.5px] leading-4 text-muted-foreground">
                <li className="flex gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  {pt
                    ? "O domínio do e-mail corporativo, para você saber quem procurou."
                    : "The corporate email domain, so you know who reached out."}
                </li>
                <li className="flex gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  {pt
                    ? "Nunca o nome, o e-mail ou o telefone de quem viu."
                    : "Never the name, email or phone number of the viewer."}
                </li>
                <li className="flex gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  {pt
                    ? "Nenhum arquivo de currículo é armazenado ou compartilhado."
                    : "No résumé file is stored or shared."}
                </li>
              </ul>
              <p className="mt-2.5 border-t border-border pt-2.5 text-[9.5px] leading-4 text-muted-foreground">
                {pt
                  ? "Base legal de demonstração inspirada na LGPD: minimização de dados e transparência sobre o tratamento."
                  : "Demo rationale inspired by Brazil's LGPD: data minimisation and transparency about processing."}
              </p>
            </section>

            <p className="text-[10px] leading-5 text-muted-foreground">
              {pt
                ? `Atualizado em ${formatDateTime("2026-11-15T09:30:00", locale)}. Todos os domínios e métricas são fictícios.`
                : `Updated ${formatDateTime("2026-11-15T09:30:00", locale)}. All domains and metrics are fictional.`}
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
