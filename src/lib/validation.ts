import { z } from "zod";
import type { Locale } from "@/lib/locale";

const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]*[a-zA-Z0-9_%]\/?$/;

type Messages = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  ddd: string;
  linkedin: string;
  summaryMin: string;
  summaryMax: string;
  desiredJob: string;
  lastJob: string;
  experienceMin: string;
  experienceMax: string;
  skillsMin: string;
  skillsFormat: string;
  languagesMin: string;
  salaryRange: string;
  availabilityMin: string;
  availabilityMax: string;
  temporaryMax: string;
  regionsMin: string;
  domains: string;
  salaryRequired: string;
  expRole: string;
  expCompany: string;
  expPeriod: string;
  eduDegree: string;
  eduInstitution: string;
  eduYear: string;
  certName: string;
  certIssuer: string;
};

const MESSAGES: Record<Locale, Messages> = {
  pt: {
    name: "Informe seu nome completo",
    title: "Informe seu cargo profissional",
    email: "Informe um e-mail válido",
    phone: "Informe um telefone válido",
    location: "Informe cidade e estado",
    ddd: "Selecione sua região",
    linkedin: "Use o formato https://www.linkedin.com/in/seu-perfil",
    summaryMin: "Escreva pelo menos 40 caracteres para explicar seu foco",
    summaryMax: "Mantenha o resumo com menos de 800 caracteres",
    desiredJob: "Informe o cargo que você procura",
    lastJob: "Mantenha com menos de 50 caracteres",
    experienceMin: "Não pode ser negativo",
    experienceMax: "O máximo é 70 anos",
    skillsMin: "Adicione pelo menos três habilidades",
    skillsFormat: "Separe as habilidades por vírgula (mínimo de três)",
    languagesMin: "Adicione pelo menos um idioma",
    salaryRange: "Valor fora do intervalo permitido",
    availabilityMin: "Não pode ser negativo",
    availabilityMax: "O máximo é 180 dias",
    temporaryMax: "O máximo é 24 meses",
    regionsMin: "Escolha pelo menos uma região",
    domains: "Use apenas domínios de empresa, como consultoria.com.br",
    salaryRequired: "Informe pelo menos uma expectativa salarial",
    expRole: "Informe o cargo",
    expCompany: "Informe a empresa",
    expPeriod: "Informe o período, como 2022 — hoje",
    eduDegree: "Informe o curso",
    eduInstitution: "Informe a instituição",
    eduYear: "Informe o ano",
    certName: "Informe o nome da certificação",
    certIssuer: "Informe a emissora",
  },
  en: {
    name: "Enter your full name",
    title: "Enter your professional title",
    email: "Enter a valid email address",
    phone: "Enter a valid phone number",
    location: "Enter your city and state",
    ddd: "Select your region",
    linkedin: "Use the format https://www.linkedin.com/in/your-profile",
    summaryMin: "Write at least 40 characters so recruiters understand your focus",
    summaryMax: "Keep the summary under 800 characters",
    desiredJob: "Enter the role you are looking for",
    lastJob: "Keep it under 50 characters",
    experienceMin: "Cannot be negative",
    experienceMax: "Maximum is 70 years",
    skillsMin: "Add at least three skills",
    skillsFormat: "Separate skills with commas (at least three)",
    languagesMin: "Add at least one language",
    salaryRange: "Value outside the allowed range",
    availabilityMin: "Cannot be negative",
    availabilityMax: "Maximum is 180 days",
    temporaryMax: "Maximum is 24 months",
    regionsMin: "Choose at least one region",
    domains: "Use company domains only, such as consultancy.com.br",
    salaryRequired: "Inform at least one salary expectation",
    expRole: "Enter the role",
    expCompany: "Enter the company",
    expPeriod: "Enter the period, such as 2022 — present",
    eduDegree: "Enter the course or degree",
    eduInstitution: "Enter the institution",
    eduYear: "Enter the year",
    certName: "Enter the certification name",
    certIssuer: "Enter the issuer",
  },
};

export function createLanguageSchema(locale: Locale) {
  return z.object({
    name: z.string().min(2, MESSAGES[locale].name).max(30),
    level: z.union([z.literal(1), z.literal(2)]),
  });
}

export function createProfileSchema(locale: Locale) {
  const copy = MESSAGES[locale];
  return z
    .object({
      name: z.string().min(2, copy.name).max(80),
      title: z.string().min(2, copy.title).max(60),
      email: z.string().email(copy.email),
      phone: z.string().min(8, copy.phone).max(24),
      location: z.string().min(2, copy.location).max(60),
      ddd: z.string().min(2, copy.ddd).max(3),
      linkedin: z.string().regex(linkedinRegex, copy.linkedin),
      summary: z.string().min(40, copy.summaryMin).max(800, copy.summaryMax),
      desiredJob: z.string().min(2, copy.desiredJob).max(50),
      lastJob: z.string().max(50, copy.lastJob).optional().or(z.literal("")),
      experienceYears: z.coerce.number().min(0, copy.experienceMin).max(70, copy.experienceMax),
      seniority: z.enum(["junior", "pleno", "senior", "especialista"]),
      workModel: z.enum(["remote", "hybrid", "onsite"]),
      skillsText: z
        .string()
        .min(2, copy.skillsMin)
        .refine(
          (value) =>
            value
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean).length >= 3,
          copy.skillsFormat,
        ),
      languages: z.array(createLanguageSchema(locale)).min(1, copy.languagesMin),
      salaryClt: z.coerce.number().min(0, copy.salaryRange).max(1000000, copy.salaryRange),
      salaryPj: z.coerce.number().min(0, copy.salaryRange).max(1000000, copy.salaryRange),
      salaryBtc: z.coerce.number().min(0, copy.salaryRange).max(1000000, copy.salaryRange),
      negotiable: z.boolean(),
      availabilityDays: z.coerce.number().min(0, copy.availabilityMin).max(180, copy.availabilityMax),
      temporaryJobMonths: z.coerce.number().min(0, copy.availabilityMin).max(24, copy.temporaryMax),
      travel: z.boolean(),
      pcd: z.boolean(),
      regions: z.array(z.string()).min(1, copy.regionsMin),
      notAllowedCompaniesText: z
        .string()
        .optional()
        .refine((value) => {
          if (!value || !value.trim()) return true;
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .every((item) => domainRegex.test(item));
        }, copy.domains),
      experiences: z.array(
        z.object({
          id: z.string().optional(),
          role: z.string().min(2, copy.expRole).max(80),
          company: z.string().min(2, copy.expCompany).max(80),
          period: z.string().min(2, copy.expPeriod).max(40),
          location: z.string().max(60).optional().or(z.literal("")),
          summary: z.string().max(400).optional().or(z.literal("")),
          highlightsText: z.string().max(1200).optional().or(z.literal("")),
        }),
      ),
      education: z.array(
        z.object({
          id: z.string().optional(),
          degree: z.string().min(2, copy.eduDegree).max(120),
          institution: z.string().min(2, copy.eduInstitution).max(120),
          year: z.string().min(4, copy.eduYear).max(9),
          detail: z.string().max(200).optional().or(z.literal("")),
        }),
      ),
      certifications: z.array(
        z.object({
          id: z.string().optional(),
          name: z.string().min(2, copy.certName).max(120),
          issuer: z.string().min(2, copy.certIssuer).max(80),
          year: z.string().min(4, copy.eduYear).max(9),
        }),
      ),
    })
    .refine((data) => data.salaryClt > 0 || data.salaryPj > 0 || data.salaryBtc > 0, {
      message: copy.salaryRequired,
      path: ["salaryClt"],
    });
}

export const profileFormSchema = createProfileSchema("pt");
export type ProfileFormValues = z.infer<typeof profileFormSchema>;


