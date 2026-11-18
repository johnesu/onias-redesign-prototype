import type { Job, JobTone } from "@/types";
import { formatNumber } from "@/lib/format";
import type { Locale } from "@/lib/locale";

export const JOB_TONE_CLASS: Record<JobTone, string> = {
  navy: "bg-navy text-white",
  blue: "bg-[#0B5FBE] text-white",
  teal: "bg-[#0F766E] text-white",
  amber: "bg-[#B45309] text-white",
  violet: "bg-[#5B3FA8] text-white",
  rose: "bg-[#A3325A] text-white",
  slate: "bg-[#475569] text-white",
};

export function companyInitials(company: string) {
  return company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/**
 * Most skills are proper technology names and stay identical in both languages.
 * A few were authored in Portuguese; this keeps EN mode from mixing languages.
 */
const SKILL_EN: Record<string, string> = {
  Arquitetura: "Architecture",
  Contratação: "Hiring",
  Estatística: "Statistics",
  Integração: "Integration",
  Liderança: "Leadership",
  Microsserviços: "Microservices",
  "Modelagem de dados": "Data modelling",
  Observabilidade: "Observability",
  Pagamentos: "Payments",
  "Pesquisa com usuários": "User research",
  Prototipação: "Prototyping",
  Testes: "Testing",
  "Testes de API": "API testing",
};

export function jobSkillLabel(skill: string, locale: Locale = "pt") {
  return locale === "pt" ? skill : SKILL_EN[skill] ?? skill;
}

export function jobSalary(job: Job, locale: Locale = "pt") {
  return `R$ ${formatNumber(job.salaryMin, locale)} – ${formatNumber(job.salaryMax, locale)}`;
}

export function jobSalaryShort(job: Job, locale: Locale = "pt") {
  return `R$ ${formatNumber(Math.round(job.salaryMin / 1000), locale)}k–${formatNumber(
    Math.round(job.salaryMax / 1000),
    locale,
  )}k`;
}

const SAVED_KEY = "onias.demo.v1.savedJobs";

export function getSavedJobIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function toggleSavedJob(id: string) {
  const current = getSavedJobIds();
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("onias:saved-jobs", { detail: next }));
  return next;
}

export const APPLICATIONS_KEY = "onias.demo.v1.applications";

export type ApplicationRecord = {
  jobId: string;
  title: string;
  company: string;
  sourceChannel: string;
  date: string;
};

export function getApplications(): ApplicationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(APPLICATIONS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as ApplicationRecord[]) : [];
  } catch {
    return [];
  }
}

export function recordApplication(record: ApplicationRecord) {
  const next = [...getApplications(), record].slice(-20);
  window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(next));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("onias:applications", { detail: next }));
  }
  return next;
}
