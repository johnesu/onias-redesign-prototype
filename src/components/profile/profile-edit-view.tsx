"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CircleAlert,
  Globe2,
  GraduationCap,
  Languages as LanguagesIcon,
  Loader2,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import type { CandidateProfile, LanguageLevel } from "@/types";
import { getProfile, resetProfile, saveProfile } from "@/lib/mock-api";
import { createProfileSchema, type ProfileFormValues } from "@/lib/validation";
import { profileFromForm } from "@/lib/profile";
import { REGIONS, SENIORITIES, WORK_MODELS, regionName, seniorityLabel, workModelLabel } from "@/lib/months";
import { MOCK_PROFILE } from "@/data/mock-profile";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Field, Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/primitives";
import { RegionPicker, SwitchRow } from "@/components/profile/profile-fields";
import { cn } from "@/lib/utils";

function toFormValues(profile: CandidateProfile): ProfileFormValues {
  return {
    name: profile.name,
    title: profile.title,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    ddd: profile.ddd,
    linkedin: profile.linkedin,
    summary: profile.summary,
    desiredJob: profile.desiredJob,
    lastJob: profile.lastJob,
    experienceYears: profile.experienceYears,
    seniority: profile.seniority,
    workModel: profile.workModel,
    skillsText: profile.skills.join(", "),
    languages: profile.languages,
    salaryClt: profile.salary.clt,
    salaryPj: profile.salary.pj,
    salaryBtc: profile.salary.btc,
    negotiable: profile.salary.negotiable,
    availabilityDays: profile.availabilityDays,
    temporaryJobMonths: profile.temporaryJobMonths,
    travel: profile.travel,
    pcd: profile.pcd,
    regions: profile.regions.length ? profile.regions : profile.region ? [profile.region] : [],
    notAllowedCompaniesText: profile.notAllowedCompanies.join(", "),
    experiences: profile.experiences.map((experience) => ({
      id: experience.id,
      role: experience.role,
      company: experience.company,
      period: experience.period,
      location: experience.location,
      summary: experience.summary,
      highlightsText: experience.highlights.join("\n"),
    })),
    education: profile.education.map((item) => ({
      id: item.id,
      degree: item.degree,
      institution: item.institution,
      year: item.year,
      detail: item.detail ?? "",
    })),
    certifications: profile.certifications.map((item) => ({
      id: item.id,
      name: item.name,
      issuer: item.issuer,
      year: item.year,
    })),
  };
}

export function ProfileEditView() {
  const router = useRouter();
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const [loaded, setLoaded] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const schema = React.useMemo(() => createProfileSchema(locale), [locale]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(MOCK_PROFILE),
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = form;

  const languages = useFieldArray({ control, name: "languages" });
  const experienceFields = useFieldArray({ control, name: "experiences" });
  const educationFields = useFieldArray({ control, name: "education" });
  const certificationFields = useFieldArray({ control, name: "certifications" });
  const [confirmReset, setConfirmReset] = React.useState(false);
  const skillsText = watch("skillsText") ?? "";
  const summary = watch("summary") ?? "";
  const selectedRegions = watch("regions") ?? [];
  const skills = skillsText
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  React.useEffect(() => {
    const profile = getProfile();
    reset(toFormValues(profile));
    setLoaded(true);
  }, [reset]);

  React.useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const current = getProfile();
      const next = profileFromForm(values, current, locale);

      await saveProfile(next);
      toast.success(pt ? "Perfil atualizado" : "Profile updated", {
        description: pt
          ? "As alterações foram salvas no armazenamento de demonstração deste navegador."
          : "Changes were saved to this browser's demo storage.",
      });
      reset(toFormValues(next));
      router.push("/perfil");
      router.refresh();
    } catch {
      toast.error(pt ? "Não foi possível salvar o perfil" : "Could not save the profile", {
        description: pt
          ? "Esta simulação grava localmente; verifique as permissões de armazenamento do navegador."
          : "This simulation stores data locally; check browser storage permissions.",
      });
    } finally {
      setSaving(false);
    }
  });

  const restoreDemo = () => {
    resetProfile();
    reset(toFormValues(MOCK_PROFILE));
    setConfirmReset(false);
    toast.success(pt ? "Demonstração restaurada" : "Demo restored", {
      description: pt
        ? "O perfil fictício original voltou a ser exibido neste navegador."
        : "The original fictional profile is shown in this browser again.",
    });
    router.push("/perfil");
    router.refresh();
  };

  const errorCount = Object.keys(errors).length;

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
            <span className="text-foreground">{pt ? "Editar" : "Edit"}</span>
          </nav>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[40px]">
                  {pt ? "Editar perfil" : "Edit profile"}
                </h1>
                <Badge variant="accent">
                  <Sparkles className="size-2.5" /> {pt ? "Demonstração editável" : "Editable demo"}
                </Badge>
                {isDirty && <Badge variant="warning">{pt ? "Alterações não salvas" : "Unsaved changes"}</Badge>}
              </div>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                {pt
                  ? "Atualize como você aparece para recrutadores. Salvar grava apenas no localStorage deste navegador; nenhuma requisição sai do protótipo."
                  : "Update how you appear to recruiters. Saving writes only to localStorage in this browser; no request leaves the prototype."}
              </p>
              <p className="mt-2 text-[11.5px] text-muted-foreground">
                {pt ? "Quer um perfil novo em vez de editar o atual?" : "Want a fresh profile instead of editing this one?"}{" "}
                <Link href="/perfil/criar" className="font-semibold text-primary hover:underline">
                  {pt ? "Criar do zero" : "Start from scratch"}
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/perfil">
                  <ArrowLeft /> {pt ? "Cancelar" : "Cancel"}
                </Link>
              </Button>
              <Button type="button" size="sm" variant="navy" onClick={onSubmit} disabled={saving || !loaded}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? (pt ? "Salvando…" : "Saving…") : pt ? "Salvar perfil" : "Save profile"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">
        <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-border bg-card px-3.5 py-2.5 text-[11.5px] leading-5 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            <span className="font-semibold text-foreground">
              {pt ? "Privacidade por padrão." : "Privacy-first by design."}
            </span>{" "}
            {pt
              ? "A ONIAS guarda um endereço de LinkedIn e as habilidades que você declara, nunca um arquivo de currículo. Campos com asterisco são obrigatórios para publicar."
              : "ONIAS stores a LinkedIn address and the skills you declare, never an uploaded CV file. Fields marked with an asterisk are required to publish."}
          </span>
        </div>

        {errorCount > 0 && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger-soft px-3.5 py-3 text-[12px] text-danger">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>
              {pt
                ? "Alguns campos precisam de atenção. Revise os campos destacados antes de salvar."
                : "Some fields need attention. Review the highlighted inputs below before saving."}
            </p>
          </div>
        )}

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-5 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-start gap-2.5 pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <UserRound className="size-4" />
                </span>
                <div>
                  <CardTitle>{pt ? "Identidade e contato" : "Identity and contact"}</CardTitle>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {pt ? "Como recrutadores reconhecem e falam com você" : "How recruiters recognise and reach you"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label={pt ? "Nome completo" : "Full name"} htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" {...register("name")} autoComplete="name" invalid={Boolean(errors.name)} />
                </Field>
                <Field label={pt ? "Cargo profissional" : "Professional title"} htmlFor="title" required error={errors.title?.message}>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder={pt ? "Desenvolvedor Full-Stack Sênior" : "Senior Full-Stack Developer"}
                    invalid={Boolean(errors.title)}
                  />
                </Field>
                <Field label={pt ? "E-mail" : "Email"} htmlFor="email" required error={errors.email?.message}>
                  <Input id="email" type="email" {...register("email")} autoComplete="email" invalid={Boolean(errors.email)} />
                </Field>
                <Field
                  label={pt ? "Telefone" : "Phone"}
                  htmlFor="phone"
                  hint={pt ? "Inclua o código do país e o DDD" : "Include country and area code"}
                  required
                  error={errors.phone?.message}
                >
                  <Input id="phone" {...register("phone")} autoComplete="tel" invalid={Boolean(errors.phone)} />
                </Field>
                <Field label={pt ? "Cidade e estado" : "City and state"} htmlFor="location" required error={errors.location?.message}>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder={pt ? "São Paulo, SP" : "São Paulo, SP"}
                    invalid={Boolean(errors.location)}
                  />
                </Field>
                <Field label={pt ? "DDD / região" : "DDD / region"} htmlFor="ddd" required error={errors.ddd?.message}>
                  <Select id="ddd" {...register("ddd")} invalid={Boolean(errors.ddd)}>
                    <option value="">{pt ? "Selecione uma região" : "Select a region"}</option>
                    {REGIONS.map((region) => (
                      <option key={region.slug} value={region.ddd}>
                        {regionName(region.slug, locale)} · DDD {region.ddd}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field
                  label={pt ? "Endereço do LinkedIn" : "LinkedIn address"}
                  htmlFor="linkedin"
                  hint={pt ? "Apenas o link do perfil é armazenado, nunca um arquivo." : "Only the profile link is stored, never a CV file."}
                  required
                  error={errors.linkedin?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    id="linkedin"
                    {...register("linkedin")}
                    placeholder="https://www.linkedin.com/in/seu-perfil"
                    invalid={Boolean(errors.linkedin)}
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start gap-2.5 pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <CardTitle>{pt ? "História profissional" : "Professional story"}</CardTitle>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {pt ? "O resumo é a primeira coisa que um recrutador lê" : "The summary is the first thing a recruiter reads"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label={pt ? "Cargo que você procura" : "Role you are looking for"} htmlFor="desiredJob" required error={errors.desiredJob?.message}>
                  <Input id="desiredJob" {...register("desiredJob")} invalid={Boolean(errors.desiredJob)} />
                </Field>
                <Field label={pt ? "Último cargo" : "Last role"} htmlFor="lastJob" error={errors.lastJob?.message}>
                  <Input id="lastJob" {...register("lastJob")} invalid={Boolean(errors.lastJob)} />
                </Field>
                <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                  <Field label={copy.common.seniority} htmlFor="seniority" required error={errors.seniority?.message}>
                    <Select id="seniority" {...register("seniority")} invalid={Boolean(errors.seniority)}>
                      {SENIORITIES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {seniorityLabel(item.value, locale)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label={copy.common.workModel} htmlFor="workModel" required error={errors.workModel?.message}>
                    <Select id="workModel" {...register("workModel")} invalid={Boolean(errors.workModel)}>
                      {WORK_MODELS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {workModelLabel(item.value, locale)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field
                  label={pt ? "Anos de experiência" : "Years of experience"}
                  htmlFor="experienceYears"
                  required
                  error={errors.experienceYears?.message}
                >
                  <Input
                    id="experienceYears"
                    type="number"
                    min={0}
                    max={70}
                    {...register("experienceYears")}
                    invalid={Boolean(errors.experienceYears)}
                  />
                </Field>
                <div className="hidden sm:block" />
                <Field
                  label={pt ? "Resumo profissional" : "Professional summary"}
                  htmlFor="summary"
                  required
                  error={errors.summary?.message}
                  counter={`${summary.length} / 800`}
                  className="sm:col-span-2"
                >
                  <Textarea
                    id="summary"
                    rows={6}
                    {...register("summary")}
                    invalid={Boolean(errors.summary)}
                    placeholder={
                      pt
                        ? "Descreva os produtos que construiu, os problemas que resolve e a forma como trabalha."
                        : "Describe the products you have built, the problems you solve and the way you work."
                    }
                  />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start gap-2.5 pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <BadgeCheck className="size-4" />
                </span>
                <div>
                  <CardTitle>{pt ? "Habilidades e idiomas" : "Skills and languages"}</CardTitle>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {pt ? "As habilidades alimentam filtros de recrutadores e o match de mercado" : "Skills power recruiter filters and market matching"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field
                  label={pt ? "Habilidades" : "Skills"}
                  htmlFor="skillsText"
                  hint={pt ? "Separe as habilidades por vírgula. Pelo menos três são obrigatórias." : "Separate skills with commas. At least three are required."}
                  required
                  error={errors.skillsText?.message}
                >
                  <Input id="skillsText" {...register("skillsText")} invalid={Boolean(errors.skillsText)} />
                </Field>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{pt ? "Idiomas falados" : "Spoken languages"}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => languages.append({ name: "", level: 2 as LanguageLevel })}
                    >
                      <Plus /> {pt ? "Adicionar idioma" : "Add language"}
                    </Button>
                  </div>
                  {languages.fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <Field className="flex-1" error={errors.languages?.[index]?.name?.message}>
                        <Input
                          aria-label={`${pt ? "Idioma" : "Language"} ${index + 1}`}
                          {...register(`languages.${index}.name`)}
                          placeholder={pt ? "Idioma" : "Language"}
                          invalid={Boolean(errors.languages?.[index]?.name)}
                        />
                      </Field>
                      <Field className="w-[150px]">
                        <Select
                          aria-label={`${pt ? "Nível do idioma" : "Level for language"} ${index + 1}`}
                          {...register(`languages.${index}.level`, { valueAsNumber: true })}
                        >
                          <option value={1}>{pt ? "Intermediário" : "Intermediate"}</option>
                          <option value={2}>{pt ? "Fluente" : "Fluent"}</option>
                        </Select>
                      </Field>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="mt-1 text-muted-foreground hover:text-danger"
                        onClick={() => languages.remove(index)}
                        disabled={languages.fields.length <= 1}
                        aria-label={`${pt ? "Remover idioma" : "Remove language"} ${index + 1}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                  {errors.languages?.message && (
                    <p className="text-[12px] font-medium text-danger">{errors.languages.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start gap-2.5 pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <BriefcaseBusiness className="size-4" />
                </span>
                <div>
                  <CardTitle>{pt ? "Trajetória e credenciais" : "Background and credentials"}</CardTitle>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {pt
                      ? "Opcional, mas é o que dá contexto ao seu resumo. Adicione cargos, formação e certificações."
                      : "Optional, but it gives your summary context. Add roles, education and certifications."}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-semibold">{pt ? "Experiências" : "Work experience"}</p>
                      <p className="text-[10.5px] text-muted-foreground">
                        {pt ? "Do cargo mais recente para o mais antigo." : "Newest role first."}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        experienceFields.append({
                          role: "",
                          company: "",
                          period: "",
                          location: "",
                          summary: "",
                          highlightsText: "",
                        })
                      }
                    >
                      <Plus /> {pt ? "Adicionar" : "Add"}
                    </Button>
                  </div>
                  {experienceFields.fields.length === 0 && (
                    <p className="rounded-lg border border-dashed border-border px-3 py-2.5 text-[11px] leading-5 text-muted-foreground">
                      {pt
                        ? "Nenhuma experiência declarada. Perfis com ao menos um cargo aparecem melhor nas buscas."
                        : "No work experience declared. Profiles with at least one role rank better in searches."}
                    </p>
                  )}
                  {experienceFields.fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 rounded-lg border border-border bg-canvas/40 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                          {pt ? `Experiência ${index + 1}` : `Experience ${index + 1}`}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-danger"
                          onClick={() => experienceFields.remove(index)}
                          aria-label={pt ? "Remover experiência" : "Remove experience"}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label={pt ? "Cargo" : "Role"} error={errors.experiences?.[index]?.role?.message}>
                          <Input
                            {...register(`experiences.${index}.role`)}
                            aria-label={`${pt ? "Cargo" : "Role"} ${index + 1}`}
                            invalid={Boolean(errors.experiences?.[index]?.role)}
                          />
                        </Field>
                        <Field label={pt ? "Empresa" : "Company"} error={errors.experiences?.[index]?.company?.message}>
                          <Input
                            {...register(`experiences.${index}.company`)}
                            aria-label={`${pt ? "Empresa" : "Company"} ${index + 1}`}
                            invalid={Boolean(errors.experiences?.[index]?.company)}
                          />
                        </Field>
                        <Field
                          label={pt ? "Período" : "Period"}
                          hint={pt ? "Ex.: 2022 — hoje" : "E.g. 2022 — present"}
                          error={errors.experiences?.[index]?.period?.message}
                        >
                          <Input
                            {...register(`experiences.${index}.period`)}
                            aria-label={`${pt ? "Período" : "Period"} ${index + 1}`}
                            placeholder={pt ? "2022 — hoje" : "2022 — present"}
                            invalid={Boolean(errors.experiences?.[index]?.period)}
                          />
                        </Field>
                        <Field label={pt ? "Local" : "Location"}>
                          <Input
                            {...register(`experiences.${index}.location`)}
                            aria-label={`${pt ? "Local" : "Location"} ${index + 1}`}
                            placeholder={pt ? "São Paulo, SP ou Remoto" : "São Paulo, SP or Remote"}
                          />
                        </Field>
                        <Field label={pt ? "Resumo do cargo" : "Role summary"} className="sm:col-span-2">
                          <Textarea
                            rows={2}
                            {...register(`experiences.${index}.summary`)}
                            aria-label={`${pt ? "Resumo do cargo" : "Role summary"} ${index + 1}`}
                            placeholder={
                              pt
                                ? "O que você construiu e qual era o contexto do time."
                                : "What you built and the team context."
                            }
                          />
                        </Field>
                        <Field
                          label={pt ? "Conquistas" : "Highlights"}
                          hint={pt ? "Uma por linha." : "One per line."}
                          className="sm:col-span-2"
                        >
                          <Textarea
                            rows={3}
                            {...register(`experiences.${index}.highlightsText`)}
                            aria-label={`${pt ? "Conquistas" : "Highlights"} ${index + 1}`}
                            placeholder={
                              pt ? "Reduzi a latência p95 em 38%." : "Reduced p95 latency by 38%."
                            }
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="size-3.5 text-muted-foreground" />
                      <p className="text-[12px] font-semibold">{pt ? "Formação" : "Education"}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => educationFields.append({ degree: "", institution: "", year: "", detail: "" })}
                    >
                      <Plus /> {pt ? "Adicionar" : "Add"}
                    </Button>
                  </div>
                  {educationFields.fields.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      {pt ? "Nenhuma formação declarada." : "No education declared."}
                    </p>
                  )}
                  {educationFields.fields.map((field, index) => (
                    <div key={field.id} className="grid gap-3 rounded-lg border border-border bg-canvas/40 p-3 sm:grid-cols-2">
                      <Field label={pt ? "Curso" : "Course"} error={errors.education?.[index]?.degree?.message}>
                        <Input
                          {...register(`education.${index}.degree`)}
                          aria-label={`${pt ? "Curso" : "Course"} ${index + 1}`}
                          invalid={Boolean(errors.education?.[index]?.degree)}
                        />
                      </Field>
                      <Field label={pt ? "Instituição" : "Institution"} error={errors.education?.[index]?.institution?.message}>
                        <Input
                          {...register(`education.${index}.institution`)}
                          aria-label={`${pt ? "Instituição" : "Institution"} ${index + 1}`}
                          invalid={Boolean(errors.education?.[index]?.institution)}
                        />
                      </Field>
                      <Field label={pt ? "Ano" : "Year"} error={errors.education?.[index]?.year?.message}>
                        <Input
                          {...register(`education.${index}.year`)}
                          aria-label={`${pt ? "Ano" : "Year"} ${index + 1}`}
                          placeholder="2021"
                          invalid={Boolean(errors.education?.[index]?.year)}
                        />
                      </Field>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          className="text-muted-foreground hover:text-danger"
                          onClick={() => educationFields.remove(index)}
                        >
                          <Trash2 /> {pt ? "Remover" : "Remove"}
                        </Button>
                      </div>
                      <Field label={pt ? "Detalhe (opcional)" : "Detail (optional)"} className="sm:col-span-2">
                        <Input {...register(`education.${index}.detail`)} aria-label={`${pt ? "Detalhe" : "Detail"} ${index + 1}`} />
                      </Field>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="size-3.5 text-muted-foreground" />
                      <p className="text-[12px] font-semibold">{pt ? "Certificações" : "Certifications"}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => certificationFields.append({ name: "", issuer: "", year: "" })}
                    >
                      <Plus /> {pt ? "Adicionar" : "Add"}
                    </Button>
                  </div>
                  {certificationFields.fields.length === 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      {pt ? "Nenhuma certificação declarada." : "No certifications declared."}
                    </p>
                  )}
                  {certificationFields.fields.map((field, index) => (
                    <div key={field.id} className="grid gap-3 rounded-lg border border-border bg-canvas/40 p-3 sm:grid-cols-3">
                      <Field label={pt ? "Certificação" : "Certification"} error={errors.certifications?.[index]?.name?.message}>
                        <Input
                          {...register(`certifications.${index}.name`)}
                          aria-label={`${pt ? "Certificação" : "Certification"} ${index + 1}`}
                          invalid={Boolean(errors.certifications?.[index]?.name)}
                        />
                      </Field>
                      <Field label={pt ? "Emissora" : "Issuer"} error={errors.certifications?.[index]?.issuer?.message}>
                        <Input
                          {...register(`certifications.${index}.issuer`)}
                          aria-label={`${pt ? "Emissora" : "Issuer"} ${index + 1}`}
                          invalid={Boolean(errors.certifications?.[index]?.issuer)}
                        />
                      </Field>
                      <Field label={pt ? "Ano" : "Year"} error={errors.certifications?.[index]?.year?.message}>
                        <div className="flex items-center gap-2">
                          <Input
                            {...register(`certifications.${index}.year`)}
                            aria-label={`${pt ? "Ano da certificação" : "Certification year"} ${index + 1}`}
                            placeholder="2024"
                            invalid={Boolean(errors.certifications?.[index]?.year)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-danger"
                            onClick={() => certificationFields.remove(index)}
                            aria-label={pt ? "Remover certificação" : "Remove certification"}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </Field>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start gap-2.5 pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Wallet className="size-4" />
                </span>
                <div>
                  <CardTitle>{pt ? "Salário e disponibilidade" : "Salary and availability"}</CardTitle>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {pt ? "Valores mensais brutos em BRL. Zero significa “não se aplica”." : "Monthly gross values in BRL. Zero means “not applicable”."}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="CLT" htmlFor="salaryClt" error={errors.salaryClt?.message}>
                    <Input id="salaryClt" type="number" min={0} step={100} {...register("salaryClt")} invalid={Boolean(errors.salaryClt)} />
                  </Field>
                  <Field label="PJ" htmlFor="salaryPj" error={errors.salaryPj?.message}>
                    <Input id="salaryPj" type="number" min={0} step={100} {...register("salaryPj")} invalid={Boolean(errors.salaryPj)} />
                  </Field>
                  <Field label="BTC" htmlFor="salaryBtc" error={errors.salaryBtc?.message}>
                    <Input id="salaryBtc" type="number" min={0} step={100} {...register("salaryBtc")} invalid={Boolean(errors.salaryBtc)} />
                  </Field>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SwitchRow
                    label={pt ? "Salário negociável" : "Salary is negotiable"}
                    description={pt ? "Recrutadores veem que há espaço para conversa." : "Recruiters see that there is room to discuss."}
                    control={
                      <Controller
                        control={control}
                        name="negotiable"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label={pt ? "Salário negociável" : "Salary is negotiable"}
                          />
                        )}
                      />
                    }
                  />
                  <SwitchRow
                    label={pt ? "Disposto a viajar" : "Willing to travel"}
                    description={pt ? "Viagens curtas para onboarding ou clientes." : "Short trips for onboarding or client work."}
                    control={
                      <Controller
                        control={control}
                        name="travel"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label={pt ? "Disposto a viajar" : "Willing to travel"}
                          />
                        )}
                      />
                    }
                  />
                  <SwitchRow
                    label={pt ? "Autodeclaração PCD" : "PCD self-declaration"}
                    description={pt ? "Opcional. Nunca é obrigatória para se candidatar." : "Optional. Never required to apply."}
                    control={
                      <Controller
                        control={control}
                        name="pcd"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-label={pt ? "Autodeclaração PCD" : "PCD self-declaration"}
                          />
                        )}
                      />
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={pt ? "Aviso prévio (dias)" : "Notice period (days)"} htmlFor="availabilityDays" error={errors.availabilityDays?.message}>
                      <Input
                        id="availabilityDays"
                        type="number"
                        min={0}
                        max={180}
                        {...register("availabilityDays")}
                        invalid={Boolean(errors.availabilityDays)}
                      />
                    </Field>
                    <Field label={pt ? "Vaga temporária (meses)" : "Temp. role (months)"} htmlFor="temporaryJobMonths" error={errors.temporaryJobMonths?.message}>
                      <Input
                        id="temporaryJobMonths"
                        type="number"
                        min={0}
                        max={24}
                        {...register("temporaryJobMonths")}
                        invalid={Boolean(errors.temporaryJobMonths)}
                      />
                    </Field>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start gap-2.5 pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <ShieldCheck className="size-4" />
                </span>
                <div>
                  <CardTitle>{pt ? "Regiões e privacidade" : "Regions and privacy"}</CardTitle>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    {pt
                      ? "Onde você aceita vagas e quais domínios não podem receber seu LinkedIn"
                      : "Where you accept roles and which domains cannot receive your LinkedIn"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">
                    {pt ? "Regiões preferidas" : "Preferred regions"} <span className="text-danger">*</span>
                  </Label>
                  <RegionPicker
                    selected={selectedRegions}
                    onChange={(next) => setValue("regions", next, { shouldDirty: true, shouldValidate: true })}
                    locale={locale}
                  />
                  {errors.regions?.message && (
                    <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.regions.message}</p>
                  )}
                </div>

                <Field
                  label={pt ? "Empresas que não devem receber meu LinkedIn" : "Companies that must not receive my LinkedIn"}
                  htmlFor="notAllowedCompaniesText"
                  hint={
                    pt
                      ? "Use domínios de empresa separados por vírgula. Domínios de e-mail pessoal não podem ser filtrados."
                      : "Use company domains separated by commas. Personal email domains cannot be filtered."
                  }
                  error={errors.notAllowedCompaniesText?.message}
                >
                  <Textarea
                    id="notAllowedCompaniesText"
                    rows={3}
                    {...register("notAllowedCompaniesText")}
                    placeholder="consultoria.com.br, outra-empresa.com"
                    invalid={Boolean(errors.notAllowedCompaniesText)}
                  />
                </Field>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{pt ? "Antes de salvar" : "Before you save"}</CardTitle>
                <p className="text-[11.5px] text-muted-foreground">
                  {pt ? "Uma checagem rápida dos campos mais visíveis" : "A quick check of the most visible fields"}
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-[11.5px]">
                <CheckRow ok={Boolean(watch("name") && watch("title"))} label={pt ? "Nome e cargo profissional" : "Name and professional title"} />
                <CheckRow
                  ok={(watch("summary") ?? "").length >= 40}
                  label={pt ? "Resumo com pelo menos 40 caracteres" : "Summary with at least 40 characters"}
                />
                <CheckRow ok={skills.length >= 3} label={pt ? "Pelo menos três habilidades" : "At least three skills"} />
                <CheckRow ok={selectedRegions.length > 0} label={pt ? "Pelo menos uma região preferida" : "At least one preferred region"} />
                <CheckRow
                  ok={watch("salaryClt") > 0 || watch("salaryPj") > 0 || watch("salaryBtc") > 0}
                  label={pt ? "Uma expectativa salarial" : "One salary expectation"}
                />
                <div className="rounded-lg bg-muted/60 p-2.5 text-[10.5px] leading-4 text-muted-foreground">
                  <CircleAlert className="mb-1 size-3.5 text-warning" />
                  {pt
                    ? "Este protótipo não tem servidor. Se você limpar o armazenamento do navegador, os valores originais da demonstração voltam."
                    : "This prototype has no server. If you clear browser storage, the original demo values return."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="size-3.5 text-muted-foreground" />
                  <CardTitle>{pt ? "Demonstração" : "Demonstration"}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-[11px] leading-5 text-muted-foreground">
                {confirmReset ? (
                  <>
                    <p className="font-medium text-foreground">
                      {pt ? "Descartar o perfil salvo e voltar ao fictício?" : "Discard the saved profile and return to the fictional one?"}
                    </p>
                    <p className="mt-1">
                      {pt
                        ? "O perfil criado ou editado neste navegador será apagado."
                        : "The profile created or edited in this browser will be deleted."}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button type="button" variant="danger" size="xs" onClick={restoreDemo}>
                        <RotateCcw /> {pt ? "Restaurar" : "Restore"}
                      </Button>
                      <Button type="button" variant="ghost" size="xs" onClick={() => setConfirmReset(false)}>
                        {pt ? "Cancelar" : "Cancel"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      {pt
                        ? "Ver o perfil fictício original outra vez. Isso apaga o perfil gravado neste navegador."
                        : "See the original fictional profile again. This deletes the profile stored in this browser."}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="mt-3"
                      onClick={() => setConfirmReset(true)}
                    >
                      <RotateCcw /> {pt ? "Restaurar demonstração" : "Restore demo"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{pt ? "Notas do modelo de dados" : "Data model notes"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[11px] leading-5 text-muted-foreground">
                <p className="flex gap-2">
                  <LanguagesIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {pt
                    ? "Idiomas usam os dois níveis originais: intermediário e fluente."
                    : "Languages use the two original levels: intermediate and fluent."}
                </p>
                <p className="flex gap-2">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {pt
                    ? "O DDD é usado no filtro regional de vagas."
                    : "DDD is used for regional vacancy filtering."}
                </p>
                <p className="flex gap-2">
                  <Globe2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {pt ? "O LinkedIn é o único perfil externo armazenado." : "LinkedIn is the only external profile stored."}
                </p>
              </CardContent>
            </Card>

            <div className="hidden gap-2 xl:flex">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/perfil">{pt ? "Cancelar" : "Cancel"}</Link>
              </Button>
              <Button type="submit" variant="navy" className="flex-1" disabled={saving || !loaded}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />} {pt ? "Salvar" : "Save"}
              </Button>
            </div>
          </aside>

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-canvas/95 px-4 py-2.5 backdrop-blur safe-bottom xl:hidden">
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="flex-1" size="sm">
                <Link href="/perfil">{pt ? "Cancelar" : "Cancel"}</Link>
              </Button>
              <Button type="submit" variant="navy" className="flex-1" size="sm" disabled={saving || !loaded}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? (pt ? "Salvando…" : "Saving…") : pt ? "Salvar perfil" : "Save profile"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-start gap-2">
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
          ok ? "bg-success-soft text-success" : "bg-muted text-muted-foreground",
        )}
      >
        {ok ? <Check className="size-2.5" /> : <span className="size-1 rounded-full bg-current" />}
      </span>
      <span className={ok ? "text-foreground/80" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
