"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  FileDown,
  FileText,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Printer,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { CandidateProfile, SkillGroupKey } from "@/types";
import { getProfile, hasStoredProfile } from "@/lib/mock-api";
import { MOCK_PROFILE } from "@/data/mock-profile";
import { availabilityLabel } from "@/lib/profile";
import { formatCurrency, formatDate } from "@/lib/format";
import { copyToClipboard } from "@/lib/utils";
import { regionName, seniorityLabel, workModelLabel } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/primitives";

const GROUP_LABELS: Record<SkillGroupKey, { pt: string; en: string }> = {
  core: { pt: "Engenharia principal", en: "Core engineering" },
  cloud: { pt: "Cloud e plataforma", en: "Cloud and platform" },
  data: { pt: "Dados e analytics", en: "Data and analytics" },
  avoid: { pt: "Prefiro evitar", en: "Prefer to avoid" },
};

export function ResumeView() {
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const [profile, setProfile] = React.useState<CandidateProfile>(MOCK_PROFILE);
  const [ownProfile, setOwnProfile] = React.useState(false);
  const [showSalary, setShowSalary] = React.useState(true);
  const [showLanguages, setShowLanguages] = React.useState(true);
  const [showCertifications, setShowCertifications] = React.useState(true);
  const [showAvailability, setShowAvailability] = React.useState(true);
  const [compact, setCompact] = React.useState(false);

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

  const copyLink = async () => {
    const ok = await copyToClipboard(profile.linkedin);
    if (ok) {
      toast.success(pt ? "LinkedIn copiado" : "LinkedIn address copied", {
        description: pt ? "Este é o único perfil externo armazenado." : "This is the only external profile stored.",
      });
    } else {
      toast.error(pt ? "Não foi possível copiar" : "Clipboard unavailable in this browser");
    }
  };

  const salaryParts = [
    profile.salary.clt > 0 ? `CLT ${formatCurrency(profile.salary.clt, locale)}` : null,
    profile.salary.pj > 0 ? `PJ ${formatCurrency(profile.salary.pj, locale)}` : null,
    profile.salary.btc > 0 ? `BTC ${formatCurrency(profile.salary.btc, locale)}` : null,
  ].filter(Boolean);

  const spacing = compact ? "mt-4" : "mt-5 sm:mt-6";

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-card no-print">
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
            <span className="text-foreground">{copy.nav.resume}</span>
          </nav>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {copy.nav.resume}
                </h1>
                <Badge variant="accent">
                  <FileText className="size-2.5" /> {pt ? "Documento" : "Document"}
                </Badge>
                <Badge variant="outline">
                  {pt ? "Baseado no seu perfil" : "Generated from your profile"}
                </Badge>
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "Uma prévia pronta para impressão, montada a partir do seu perfil. Nada é enviado: use o diálogo de impressão do navegador para salvar em PDF ou abrir a versão de uma página."
                  : "A print-ready summary generated from your profile. Nothing is uploaded: use the browser print dialog to save a PDF or check the one-page version."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/perfil">
                  <ArrowLeft /> {pt ? "Voltar ao perfil" : "Back to profile"}
                </Link>
              </Button>
              <Button variant="navy" size="sm" onClick={() => window.print()}>
                <Printer /> {pt ? "Imprimir / salvar PDF" : "Print / save PDF"}
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
        <div className="no-print mb-5 flex items-start gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-[11.5px] leading-5 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            <span className="font-semibold text-foreground">{pt ? "Sem upload." : "No upload."}</span>{" "}
            {pt
              ? "O currículo existe apenas como esta página. A ONIAS armazena campos do perfil e um link do LinkedIn, nunca um arquivo."
              : "The résumé exists only as this page. ONIAS stores profile fields and a LinkedIn link, never a file."}
          </span>
        </div>

        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_312px]">
          <div className="print-document overflow-hidden rounded-xl border border-border bg-white text-slate-900 shadow-card">
            <div className={compact ? "p-6 sm:p-8" : "p-7 sm:p-10"}>
              <header className="border-b-2 border-slate-900 pb-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[28px] font-semibold leading-none tracking-[-0.035em] text-slate-900">
                      {profile.name}
                    </h2>
                    <p className="mt-1.5 text-[13.5px] font-medium text-slate-600">{profile.title}</p>
                    <p className="mt-1 text-[11.5px] text-slate-500">
                      {seniorityLabel(profile.seniority, locale)} · {profile.experienceYears}{" "}
                      {pt ? "anos de experiência" : "years of experience"} ·{" "}
                      {workModelLabel(profile.workModel, locale)}
                    </p>
                  </div>
                  <div className="space-y-1 text-right text-[10.5px] text-slate-600 sm:text-[11px]">
                    <p className="flex items-center justify-end gap-1.5">
                      <MapPin className="size-3 text-slate-400" /> {profile.location}
                    </p>
                    <p className="flex items-center justify-end gap-1.5">
                      <Mail className="size-3 text-slate-400" /> {profile.email}
                    </p>
                    <p className="flex items-center justify-end gap-1.5">
                      <Phone className="size-3 text-slate-400" /> {profile.phone}
                    </p>
                    <p className="flex items-center justify-end gap-1.5">
                      <Linkedin className="size-3 text-slate-400" />{" "}
                      {profile.linkedin ? profile.linkedin.replace("https://www.", "") : "—"}
                    </p>
                  </div>
                </div>
              </header>

              <section className={spacing}>
                <SectionTitle>{pt ? "Resumo profissional" : "Professional summary"}</SectionTitle>
                <p className="mt-2 text-[12px] leading-6 text-slate-700">
                  {profile.summary || (
                    <span className="text-slate-400">
                      {pt ? "Nenhum resumo informado." : "No summary provided."}
                    </span>
                  )}
                </p>
              </section>

              <section className={spacing}>
                <SectionTitle>{pt ? "Experiência" : "Experience"}</SectionTitle>
                <div className="mt-3 space-y-4">
                  {profile.experiences.length === 0 && (
                    <p className="text-[11.5px] text-slate-400">
                      {pt ? "Nenhuma experiência declarada ainda." : "No work experience declared yet."}
                    </p>
                  )}
                  {profile.experiences.map((experience) => (
                    <article key={experience.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h4 className="text-[12.5px] font-semibold text-slate-900">{experience.role}</h4>
                        <span className="text-[10.5px] font-medium text-slate-500">{experience.period}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                        {experience.company} · {experience.location}
                      </p>
                      <p className="mt-1 text-[11.5px] leading-5 text-slate-600">{experience.summary}</p>
                      <ul className="mt-1.5 space-y-0.5">
                        {experience.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2 text-[11.5px] leading-5 text-slate-700">
                            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-slate-400" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section className={spacing}>
                <SectionTitle>{pt ? "Habilidades" : "Skills"}</SectionTitle>
                <div className="mt-2 space-y-2">
                  {profile.skillGroups.filter((group) => group.key !== "avoid").length === 0 && (
                    <p className="text-[11.5px] text-slate-400">
                      {pt ? "Nenhuma habilidade declarada." : "No skills declared."}
                    </p>
                  )}
                  {profile.skillGroups
                    .filter((group) => group.key !== "avoid")
                    .map((group) => (
                      <div key={group.key ?? group.label} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="w-full text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 sm:w-[132px]">
                          {group.key ? GROUP_LABELS[group.key][locale] : group.label}
                        </span>
                        <span className="text-[11.5px] text-slate-700">{group.skills.join(" · ")}</span>
                      </div>
                    ))}
                </div>
              </section>

              <div className={`grid gap-6 sm:grid-cols-2 ${spacing}`}>
                <section>
                  <SectionTitle>{pt ? "Formação" : "Education"}</SectionTitle>
                  <div className="mt-2 space-y-2.5">
                    {profile.education.length === 0 && (
                      <p className="text-[10.5px] text-slate-400">
                        {pt ? "Nenhuma formação declarada." : "No education declared."}
                      </p>
                    )}
                    {profile.education.map((item) => (
                      <div key={item.id}>
                        <p className="text-[11.5px] font-semibold text-slate-900">{item.degree}</p>
                        <p className="text-[10.5px] text-slate-500">
                          {item.institution} · {item.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {showCertifications && (
                  <section>
                    <SectionTitle>{pt ? "Certificações" : "Certifications"}</SectionTitle>
                    <div className="mt-2 space-y-2.5">
                      {profile.certifications.length === 0 && (
                        <p className="text-[10.5px] text-slate-400">
                          {pt ? "Nenhuma certificação declarada." : "No certifications declared."}
                        </p>
                      )}
                      {profile.certifications.map((item) => (
                        <div key={item.id}>
                          <p className="text-[11.5px] font-semibold text-slate-900">{item.name}</p>
                          <p className="text-[10.5px] text-slate-500">
                            {item.issuer} · {item.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {(showLanguages || showSalary || showAvailability) && (
                <div
                  className={`grid gap-6 border-t border-slate-200 pt-4 sm:grid-cols-2 ${
                    compact ? "mt-4" : "mt-5"
                  }`}
                >
                  {showLanguages && profile.languages.length > 0 && (
                    <section>
                      <SectionTitle>{pt ? "Idiomas" : "Languages"}</SectionTitle>
                      <p className="mt-1.5 text-[11px] leading-5 text-slate-700">
                        {profile.languages
                          .map(
                            (language) =>
                              `${language.name} (${
                                language.level === 2
                                  ? pt
                                    ? "fluente"
                                    : "fluent"
                                  : pt
                                    ? "intermediário"
                                    : "intermediate"
                              })`,
                          )
                          .join(" · ")}
                      </p>
                    </section>
                  )}
                  {showSalary && salaryParts.length > 0 && (
                    <section>
                      <SectionTitle>{pt ? "Expectativa salarial" : "Salary expectation"}</SectionTitle>
                      <p className="mt-1.5 text-[11px] leading-5 text-slate-700">
                        {salaryParts.join(" · ")}{" "}
                        {profile.salary.negotiable && (
                          <span className="text-slate-500">{pt ? "(negociável)" : "(negotiable)"}</span>
                        )}
                      </p>
                    </section>
                  )}
                  {showAvailability && (
                    <section className="sm:col-span-2">
                      <SectionTitle>{pt ? "Disponibilidade" : "Availability"}</SectionTitle>
                      <p className="mt-1.5 text-[11px] leading-5 text-slate-700">
                        {availabilityLabel(profile.availabilityDays, locale)}
                        {profile.regions.length > 0 && (
                          <> · {profile.regions.map((slug) => regionName(slug, locale)).join(" · ")}</>
                        )}
                        {profile.travel && <> · {pt ? "Disposto a viajar" : "Willing to travel"}</>}
                        {profile.pcd && <> · {pt ? "PCD" : "PCD"}</>}
                      </p>
                    </section>
                  )}
                </div>
              )}

              <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-[9px] text-slate-400">
                <span>
                  {pt ? "Gerado a partir do protótipo de redesenho da ONIAS · " : "Generated from the ONIAS redesign prototype · "}
                  {ownProfile
                    ? pt
                      ? "perfil salvo neste navegador · "
                      : "profile stored in this browser · "
                    : pt
                      ? "perfil fictício de demonstração · "
                      : "fictional demonstration profile · "}
                  {formatDate(profile.lastActive, locale)}
                </span>
                <span>onias.demo / {profile.id}</span>
              </footer>
            </div>
          </div>

          <aside className="no-print space-y-4 xl:sticky xl:top-[88px]">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Settings2 className="size-4 text-muted-foreground" />
                  <CardTitle>{pt ? "Opções do documento" : "Document options"}</CardTitle>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  {pt ? "As mudanças afetam apenas a prévia" : "Changes apply to the preview only"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <OptionRow
                  label={pt ? "Expectativa salarial" : "Salary expectation"}
                  description={pt ? "Inclui valores CLT, PJ e BTC." : "Includes CLT, PJ and BTC values."}
                  checked={showSalary}
                  onChange={setShowSalary}
                />
                <OptionRow
                  label={pt ? "Idiomas" : "Languages"}
                  description={pt ? "Exibe idiomas e níveis declarados." : "Shows declared languages and levels."}
                  checked={showLanguages}
                  onChange={setShowLanguages}
                />
                <OptionRow
                  label={pt ? "Certificações" : "Certifications"}
                  description={pt ? "Inclui a lista de certificações." : "Includes the certification list."}
                  checked={showCertifications}
                  onChange={setShowCertifications}
                />
                <OptionRow
                  label={pt ? "Disponibilidade" : "Availability"}
                  description={pt ? "Regiões, viagem e declaração PCD." : "Regions, travel and PCD status."}
                  checked={showAvailability}
                  onChange={setShowAvailability}
                />
                <OptionRow
                  label={pt ? "Layout compacto" : "Compact layout"}
                  description={pt ? "Reduz o espaçamento para caber em uma página." : "Tightens spacing to fit one page."}
                  checked={compact}
                  onChange={setCompact}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{pt ? "Exportar" : "Export"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="navy" onClick={() => window.print()}>
                  <Printer /> {pt ? "Imprimir ou salvar em PDF" : "Print or save as PDF"}
                </Button>
                <Button className="w-full" variant="outline" onClick={copyLink}>
                  <Copy /> {pt ? "Copiar endereço do LinkedIn" : "Copy LinkedIn address"}
                </Button>
                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() =>
                    toast.info(
                      pt ? "O PDF é gerado pelo diálogo de impressão do navegador." : "PDF is generated by your browser print dialog.",
                      {
                        description: pt
                          ? "Escolha “Salvar como PDF” como destino."
                          : "Choose “Save as PDF” as the destination.",
                      },
                    )
                  }
                >
                  <FileDown /> {pt ? "Como o PDF é gerado" : "How PDF export works"}
                </Button>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 text-[11.5px] font-semibold">
                <ShieldCheck className="size-3.5 text-primary" /> {pt ? "O que fica armazenado" : "What is stored"}
              </div>
              <ul className="mt-2 space-y-1.5 text-[10.5px] leading-4 text-muted-foreground">
                <li className="flex gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  {pt ? "Campos do perfil e um link do LinkedIn" : "Profile fields and a LinkedIn link"}
                </li>
                <li className="flex gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  {pt ? "Habilidades da lista que você declarou" : "Skills from your declared list"}
                </li>
                <li className="flex gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-success" />
                  {pt ? "Nenhum documento enviado ou armazenado" : "No uploaded or stored document"}
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-[10.5px] leading-5 text-muted-foreground">
              <Sparkles className="mb-1 size-3.5 text-primary" />
              {pt
                ? "Esta prévia é intencionalmente um documento, não mais um painel. É a tela de “prévia do currículo” do produto original."
                : "This preview is intentionally a document, not another dashboard. It mirrors the original product's résumé preview screen."}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{children}</h3>;
}

function OptionRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[12px] font-semibold">{label}</p>
        <p className="mt-0.5 text-[10.5px] leading-4 text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
