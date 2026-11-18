"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Loader2,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import type { LanguageLevel } from "@/types";
import { createProfileSchema, type ProfileFormValues } from "@/lib/validation";
import { profileFromForm } from "@/lib/profile";
import { createBlankProfile } from "@/data/mock-profile";
import { hasStoredProfile, saveProfile } from "@/lib/mock-api";
import { REGIONS, SENIORITIES, WORK_MODELS, regionName, seniorityLabel, workModelLabel } from "@/lib/months";
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

const STEP_FIELDS: (keyof ProfileFormValues)[][] = [
  ["name", "title", "email", "phone", "location", "ddd", "linkedin"],
  ["summary", "desiredJob", "lastJob", "seniority", "workModel", "experienceYears", "skillsText"],
  [
    "salaryClt",
    "salaryPj",
    "salaryBtc",
    "negotiable",
    "availabilityDays",
    "travel",
    "pcd",
    "regions",
    "notAllowedCompaniesText",
  ],
];

export function CreateProfileView() {
  const router = useRouter();
  const { locale } = useLocale();
  const pt = locale === "pt";
  const copy = siteCopy(locale);
  const [step, setStep] = React.useState(0);
  const [saving, setSaving] = React.useState(false);
  const [existingProfile, setExistingProfile] = React.useState(false);

  const schema = React.useMemo(() => createProfileSchema(locale), [locale]);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      ddd: "",
      linkedin: "",
      summary: "",
      desiredJob: "",
      lastJob: "",
      experienceYears: 0,
      seniority: "pleno",
      workModel: "remote",
      skillsText: "",
      languages: [{ name: "Português", level: 2 as LanguageLevel }],
      salaryClt: 0,
      salaryPj: 0,
      salaryBtc: 0,
      negotiable: true,
      availabilityDays: 30,
      temporaryJobMonths: 0,
      travel: false,
      pcd: false,
      regions: ["home-office"],
      notAllowedCompaniesText: "",
      experiences: [],
      education: [],
      certifications: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = form;

  const summary = watch("summary") ?? "";
  const skillsText = watch("skillsText") ?? "";
  const selectedRegions = watch("regions") ?? [];
  const skills = skillsText
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  React.useEffect(() => {
    setExistingProfile(hasStoredProfile());
  }, []);

  const steps = [
    { title: pt ? "Identidade" : "Identity", icon: UserRound },
    { title: pt ? "História profissional" : "Professional story", icon: Sparkles },
    { title: pt ? "Preferências" : "Preferences", icon: ShieldCheck },
  ];
  const lastStep = steps.length - 1;

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!valid) {
      toast.error(pt ? "Revise os campos destacados" : "Review the highlighted fields");
      return;
    }
    setStep((current) => Math.min(current + 1, lastStep));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = handleSubmit(async (values) => {
    if (step < lastStep) {
      await goNext();
      return;
    }

    setSaving(true);
    try {
      const profile = profileFromForm(values, createBlankProfile(), locale);
      await saveProfile(profile);
      toast.success(pt ? "Perfil criado" : "Profile created", {
        description: pt
          ? "Bem-vindo à ONIAS. Seu perfil fica salvo apenas neste navegador."
          : "Welcome to ONIAS. Your profile is stored in this browser only.",
      });
      router.push("/perfil");
      router.refresh();
    } catch {
      toast.error(pt ? "Não foi possível criar o perfil" : "Could not create the profile", {
        description: pt
          ? "Esta simulação grava localmente; verifique as permissões de armazenamento do navegador."
          : "This simulation stores data locally; check browser storage permissions.",
      });
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">
          {pt ? "Início" : "Home"}
        </Link>
        <span>/</span>
        <Link href="/perfil" className="hover:text-foreground">
          {copy.nav.profile}
        </Link>
        <span>/</span>
        <span className="text-foreground">{pt ? "Criar perfil" : "Create profile"}</span>
      </nav>

      <header className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[30px] font-semibold leading-none tracking-[-0.045em] sm:text-[38px]">
              {pt ? "Criar seu perfil" : "Create your profile"}
            </h1>
            <Badge variant="accent">
              <Wand2 className="size-2.5" /> {pt ? "3 passos" : "3 steps"}
            </Badge>
          </div>
          <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
            {pt
              ? "Leva cerca de dois minutos. Preencha o essencial agora; experiências, formação e certificações podem ser adicionadas depois no editor."
              : "Takes about two minutes. Fill in the essentials now; experience, education and certifications can be added later in the editor."}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/perfil">
            <ArrowLeft /> {pt ? "Voltar ao perfil" : "Back to profile"}
          </Link>
        </Button>
      </header>

      {existingProfile && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-[12px] leading-5 text-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2">
            <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-warning" />
            {pt
              ? "Já existe um perfil salvo neste navegador. Criar um novo substitui o atual."
              : "A profile is already stored in this browser. Creating a new one replaces it."}
          </p>
          <Button asChild variant="outline" size="xs" className="shrink-0">
            <Link href="/perfil">{pt ? "Usar o perfil atual" : "Keep current profile"}</Link>
          </Button>
        </div>
      )}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <form
          onSubmit={onSubmit}
          noValidate
          onKeyDown={(event) => {
            if (event.key !== "Enter" || step === lastStep) return;
            const target = event.target as HTMLElement;
            if (target.tagName === "TEXTAREA") return;
            event.preventDefault();
            void goNext();
          }}
        >
          <ol className="flex items-center gap-2" aria-label={pt ? "Etapas" : "Steps"}>
            {steps.map((item, index) => {
              const Icon = item.icon;
              const active = index === step;
              const done = index < step;
              return (
                <li key={item.title} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10.5px] font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary text-white"
                        : done
                          ? "border-success/30 bg-success-soft text-success"
                          : "border-border bg-card text-muted-foreground",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? <Check className="size-3" /> : <Icon className="size-3.5" />}
                  </span>
                  <span
                    className={cn(
                      "hidden text-[11px] font-medium sm:block",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                  {index < lastStep && <span className="h-px flex-1 bg-border" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>

          <Card className="mt-4">
            <CardHeader className="pb-4">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-primary">
                {pt ? `Passo ${step + 1} de ${steps.length}` : `Step ${step + 1} of ${steps.length}`}
              </p>
              <CardTitle className="mt-1 text-[17px]">{steps[step].title}</CardTitle>
              <p className="text-[12px] text-muted-foreground">
                {step === 0 &&
                  (pt
                    ? "Como recrutadores reconhecem e falam com você."
                    : "How recruiters recognise and reach you.")}
                {step === 1 &&
                  (pt
                    ? "O que você faz hoje e o que procura. Três habilidades já bastam."
                    : "What you do today and what you are looking for. Three skills are enough.")}
                {step === 2 &&
                  (pt
                    ? "Expectativa salarial, disponibilidade e onde aceita trabalhar."
                    : "Salary expectations, availability and where you accept work.")}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={pt ? "Nome completo" : "Full name"} htmlFor="create-name" required error={errors.name?.message}>
                    <Input id="create-name" {...register("name")} autoComplete="name" invalid={Boolean(errors.name)} />
                  </Field>
                  <Field
                    label={pt ? "Cargo profissional" : "Professional title"}
                    htmlFor="create-title"
                    required
                    error={errors.title?.message}
                  >
                    <Input
                      id="create-title"
                      {...register("title")}
                      placeholder={pt ? "Desenvolvedor Full-Stack Sênior" : "Senior Full-Stack Developer"}
                      invalid={Boolean(errors.title)}
                    />
                  </Field>
                  <Field label={pt ? "E-mail" : "Email"} htmlFor="create-email" required error={errors.email?.message}>
                    <Input id="create-email" type="email" {...register("email")} autoComplete="email" invalid={Boolean(errors.email)} />
                  </Field>
                  <Field
                    label={pt ? "Telefone" : "Phone"}
                    htmlFor="create-phone"
                    hint={pt ? "Inclua o código do país e o DDD" : "Include country and area code"}
                    required
                    error={errors.phone?.message}
                  >
                    <Input id="create-phone" {...register("phone")} autoComplete="tel" invalid={Boolean(errors.phone)} />
                  </Field>
                  <Field
                    label={pt ? "Cidade e estado" : "City and state"}
                    htmlFor="create-location"
                    required
                    error={errors.location?.message}
                  >
                    <Input
                      id="create-location"
                      {...register("location")}
                      placeholder="São Paulo, SP"
                      invalid={Boolean(errors.location)}
                    />
                  </Field>
                  <Field label={pt ? "DDD / região" : "DDD / region"} htmlFor="create-ddd" required error={errors.ddd?.message}>
                    <Select id="create-ddd" {...register("ddd")} invalid={Boolean(errors.ddd)}>
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
                    htmlFor="create-linkedin"
                    hint={
                      pt
                        ? "Guardamos apenas o link do perfil, nunca um arquivo de currículo."
                        : "We store only the profile link, never a CV file."
                    }
                    required
                    error={errors.linkedin?.message}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="create-linkedin"
                      {...register("linkedin")}
                      placeholder="https://www.linkedin.com/in/seu-perfil"
                      invalid={Boolean(errors.linkedin)}
                    />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={pt ? "Resumo profissional" : "Professional summary"}
                    htmlFor="create-summary"
                    required
                    error={errors.summary?.message}
                    counter={`${summary.length} / 800`}
                    hint={
                      pt
                        ? "Conte o que você construiu, os problemas que resolve e como trabalha."
                        : "Describe what you have built, the problems you solve and how you work."
                    }
                    className="sm:col-span-2"
                  >
                    <Textarea
                      id="create-summary"
                      rows={6}
                      {...register("summary")}
                      invalid={Boolean(errors.summary)}
                      placeholder={
                        pt
                          ? "Engenheira de software com 5 anos construindo produtos de pagamento..."
                          : "Software engineer with 5 years building payment products..."
                      }
                    />
                  </Field>
                  <Field
                    label={pt ? "Cargo que você procura" : "Role you are looking for"}
                    htmlFor="create-desiredJob"
                    required
                    error={errors.desiredJob?.message}
                  >
                    <Input id="create-desiredJob" {...register("desiredJob")} invalid={Boolean(errors.desiredJob)} />
                  </Field>
                  <Field label={pt ? "Último cargo" : "Last role"} htmlFor="create-lastJob" error={errors.lastJob?.message}>
                    <Input id="create-lastJob" {...register("lastJob")} invalid={Boolean(errors.lastJob)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                    <Field label={copy.common.seniority} htmlFor="create-seniority" required error={errors.seniority?.message}>
                      <Select id="create-seniority" {...register("seniority")} invalid={Boolean(errors.seniority)}>
                        {SENIORITIES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {seniorityLabel(item.value, locale)}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label={copy.common.workModel} htmlFor="create-workModel" required error={errors.workModel?.message}>
                      <Select id="create-workModel" {...register("workModel")} invalid={Boolean(errors.workModel)}>
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
                    htmlFor="create-experienceYears"
                    required
                    error={errors.experienceYears?.message}
                  >
                    <Input
                      id="create-experienceYears"
                      type="number"
                      min={0}
                      max={70}
                      {...register("experienceYears")}
                      invalid={Boolean(errors.experienceYears)}
                    />
                  </Field>
                  <div className="hidden sm:block" />
                  <Field
                    label={pt ? "Habilidades" : "Skills"}
                    htmlFor="create-skills"
                    hint={
                      pt
                        ? "Separe por vírgula. Pelo menos três são obrigatórias."
                        : "Separate with commas. At least three are required."
                    }
                    required
                    error={errors.skillsText?.message}
                    className="sm:col-span-2"
                  >
                    <Input
                      id="create-skills"
                      {...register("skillsText")}
                      placeholder="React, TypeScript, Node.js"
                      invalid={Boolean(errors.skillsText)}
                    />
                  </Field>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:col-span-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="CLT" htmlFor="create-salaryClt" error={errors.salaryClt?.message}>
                      <Input
                        id="create-salaryClt"
                        type="number"
                        min={0}
                        step={100}
                        {...register("salaryClt")}
                        invalid={Boolean(errors.salaryClt)}
                      />
                    </Field>
                    <Field label="PJ" htmlFor="create-salaryPj" error={errors.salaryPj?.message}>
                      <Input
                        id="create-salaryPj"
                        type="number"
                        min={0}
                        step={100}
                        {...register("salaryPj")}
                        invalid={Boolean(errors.salaryPj)}
                      />
                    </Field>
                    <Field label="BTC" htmlFor="create-salaryBtc" error={errors.salaryBtc?.message}>
                      <Input
                        id="create-salaryBtc"
                        type="number"
                        min={0}
                        step={100}
                        {...register("salaryBtc")}
                        invalid={Boolean(errors.salaryBtc)}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <SwitchRow
                      label={pt ? "Salário negociável" : "Salary is negotiable"}
                      description={pt ? "Recrutadores veem espaço para conversa." : "Recruiters see room to discuss."}
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
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label={pt ? "Aviso prévio (dias)" : "Notice period (days)"}
                        htmlFor="create-availability"
                        error={errors.availabilityDays?.message}
                      >
                        <Input
                          id="create-availability"
                          type="number"
                          min={0}
                          max={180}
                          {...register("availabilityDays")}
                          invalid={Boolean(errors.availabilityDays)}
                        />
                      </Field>
                      <Field
                        label={pt ? "Vaga temporária (meses)" : "Temp. role (months)"}
                        htmlFor="create-temporary"
                        error={errors.temporaryJobMonths?.message}
                      >
                        <Input
                          id="create-temporary"
                          type="number"
                          min={0}
                          max={24}
                          {...register("temporaryJobMonths")}
                          invalid={Boolean(errors.temporaryJobMonths)}
                        />
                      </Field>
                    </div>
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
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      {pt ? "Regiões preferidas" : "Preferred regions"} <span className="text-danger">*</span>
                    </Label>
                    <RegionPicker
                      selected={selectedRegions}
                      onChange={(next) => form.setValue("regions", next, { shouldDirty: true, shouldValidate: true })}
                      locale={locale}
                    />
                    {errors.regions?.message && (
                      <p className="mt-1.5 text-[12px] font-medium text-danger">{errors.regions.message}</p>
                    )}
                  </div>

                  <Field
                    label={pt ? "Empresas que não devem receber meu LinkedIn" : "Companies that must not receive my LinkedIn"}
                    htmlFor="create-notAllowed"
                    hint={
                      pt
                        ? "Opcional. Use domínios de empresa separados por vírgula."
                        : "Optional. Use company domains separated by commas."
                    }
                    error={errors.notAllowedCompaniesText?.message}
                  >
                    <Textarea
                      id="create-notAllowed"
                      rows={2}
                      {...register("notAllowedCompaniesText")}
                      placeholder="consultoria.com.br, outra-empresa.com"
                      invalid={Boolean(errors.notAllowedCompaniesText)}
                    />
                  </Field>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep((current) => Math.max(0, current - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={step === 0}
                >
                  <ArrowLeft /> {pt ? "Voltar" : "Back"}
                </Button>
                {step < lastStep ? (
                  <Button type="button" variant="navy" size="sm" onClick={() => void goNext()}>
                    {pt ? "Continuar" : "Continue"} <ArrowRight />
                  </Button>
                ) : (
                  <Button type="submit" variant="navy" size="sm" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" /> : <Check />}
                    {saving ? (pt ? "Criando…" : "Creating…") : pt ? "Criar perfil" : "Create profile"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="mt-3 flex items-start gap-2 text-[10.5px] leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
            {pt
              ? "Nada é enviado para um servidor. O perfil é gravado apenas no localStorage deste navegador e pode ser apagado a qualquer momento."
              : "Nothing is sent to a server. The profile is written only to this browser's localStorage and can be deleted at any time."}
          </p>
        </form>

        <aside className="space-y-4 xl:sticky xl:top-24">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{pt ? "Neste perfil" : "In this profile"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-[11.5px]">
              {[
                pt ? "Nome, cargo e contato" : "Name, role and contact",
                pt ? "Resumo e habilidades" : "Summary and skills",
                pt ? "Salário, disponibilidade e regiões" : "Salary, availability and regions",
                pt ? "Privacidade por domínio" : "Domain-level privacy",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                  <span>{item}</span>
                </p>
              ))}
              <p className="border-t border-border pt-2.5 text-[10.5px] leading-4 text-muted-foreground">
                {pt
                  ? "Experiências, formação e certificações entram depois, no editor — o mesmo formulário usado para atualizar o perfil."
                  : "Experience, education and certifications come later in the editor — the same form used to update the profile."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{pt ? "Idiomas" : "Languages"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] leading-5 text-muted-foreground">
              <p>
                {pt
                  ? "Começamos com português fluente. Você pode adicionar inglês, espanhol e outros idiomas no editor."
                  : "We start with fluent Portuguese. You can add English, Spanish and other languages in the editor."}
              </p>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-dashed border-border bg-card p-4 text-[10.5px] leading-5 text-muted-foreground">
            <Sparkles className="mb-1 size-3.5 text-primary" />
            {pt
              ? "Criar um perfil aqui não envia candidaturas. Para se candidatar, abra uma vaga e use o envio simulado pelo Telegram."
              : "Creating a profile here does not submit applications. To apply, open a role and use the simulated Telegram handoff."}
          </div>
        </aside>
      </div>
    </div>
  );
}
