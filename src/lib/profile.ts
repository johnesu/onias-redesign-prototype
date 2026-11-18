import type {
  CandidateProfile,
  Certification,
  Education,
  Experience,
  LanguageLevel,
  SkillGroup,
  SpokenLanguage,
} from "@/types";
import type { Locale } from "@/lib/locale";
import type { ProfileFormValues } from "@/lib/validation";
import { DEMO_NOW } from "@/lib/months";

const LINKEDIN_RE = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_%]*[a-zA-Z0-9_%]\/?$/;

export function splitList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitLines(value?: string) {
  return (value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Human label for the notice period, derived from the numeric field. */
export function availabilityLabel(days: number, locale: Locale = "pt") {
  if (!days || days <= 0) return locale === "pt" ? "Imediata" : "Immediate";
  return locale === "pt" ? `${days} dias` : `${days} days`;
}

/** `https://www.linkedin.com/in/name/` → `linkedin.com/in/name` */
export function linkedinHandle(url: string) {
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

export type CompletionKey =
  | "core"
  | "summary"
  | "experience"
  | "skills"
  | "salary"
  | "languages"
  | "linkedin"
  | "regions"
  | "education"
  | "certification";

export type CompletionItem = {
  key: CompletionKey;
  done: boolean;
  weight: number;
};

/** Single source of truth for the profile strength meter and its checklist. */
export function completionItems(profile: CandidateProfile): CompletionItem[] {
  const hasCore = Boolean(
    profile.name.trim() &&
      profile.title.trim() &&
      profile.email.trim() &&
      profile.phone.trim() &&
      profile.location.trim() &&
      profile.ddd.trim(),
  );
  const hasSalary = profile.salary.clt > 0 || profile.salary.pj > 0 || profile.salary.btc > 0;

  return [
    { key: "core", done: hasCore, weight: 20 },
    { key: "summary", done: profile.summary.trim().length >= 40, weight: 12 },
    { key: "experience", done: profile.experiences.length > 0, weight: 14 },
    { key: "skills", done: profile.skills.length >= 3, weight: 12 },
    { key: "salary", done: hasSalary, weight: 10 },
    { key: "languages", done: profile.languages.length > 0, weight: 8 },
    { key: "linkedin", done: LINKEDIN_RE.test(profile.linkedin), weight: 8 },
    { key: "regions", done: profile.regions.length > 0, weight: 6 },
    { key: "education", done: profile.education.length > 0, weight: 5 },
    { key: "certification", done: profile.certifications.length > 0, weight: 5 },
  ];
}

export function computeCompletion(profile: CandidateProfile) {
  return Math.min(
    100,
    completionItems(profile).reduce((total, item) => total + (item.done ? item.weight : 0), 0),
  );
}

/**
 * Turns validated editor/wizard values into the stored profile shape. Used by
 * both the edit form and the create-profile onboarding so they cannot drift.
 */
export function profileFromForm(
  values: ProfileFormValues,
  base: CandidateProfile,
  locale: Locale,
): CandidateProfile {
  const skills = splitList(values.skillsText);
  const preservedGroups = base.skillGroups.filter(
    (group) => group.key !== "core" && group.skills.length > 0,
  );

  const skillGroups: SkillGroup[] = [
    ...(skills.length
      ? [
          {
            key: "core" as const,
            label: locale === "pt" ? "Engenharia principal" : "Core engineering",
            skills: skills.slice(0, 5),
          },
        ]
      : []),
    ...preservedGroups,
  ];

  const languages: SpokenLanguage[] = values.languages.map((language) => ({
    name: language.name.trim(),
    level: language.level as LanguageLevel,
  }));

  const experiences: Experience[] = values.experiences.map((item, index) => {
    const years = item.period.match(/\d{4}/g) ?? [];
    const current = /atual|presente|present|hoje|now/i.test(item.period);
    const startYear = years.length ? Number(years[0]) : 0;
    const endYear = current
      ? ("present" as const)
      : years.length > 1
        ? Number(years[years.length - 1])
        : startYear;

    return {
      id: item.id || `exp-${index + 1}`,
      role: item.role.trim(),
      company: item.company.trim(),
      period: item.period.trim(),
      startYear,
      endYear,
      location: (item.location ?? "").trim(),
      summary: (item.summary ?? "").trim(),
      highlights: splitLines(item.highlightsText),
      current,
    };
  });

  const education: Education[] = values.education.map((item, index) => ({
    id: item.id || `edu-${index + 1}`,
    degree: item.degree.trim(),
    institution: item.institution.trim(),
    year: item.year.trim(),
    detail: (item.detail ?? "").trim() || undefined,
  }));

  const certifications: Certification[] = values.certifications.map((item, index) => ({
    id: item.id || `cert-${index + 1}`,
    name: item.name.trim(),
    issuer: item.issuer.trim(),
    year: item.year.trim(),
  }));

  const next: CandidateProfile = {
    ...base,
    name: values.name.trim(),
    title: values.title.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    location: values.location.trim(),
    ddd: values.ddd,
    region: values.regions[0] ?? base.region,
    linkedin: values.linkedin.trim(),
    verifiedLinkedin: LINKEDIN_RE.test(values.linkedin.trim()),
    summary: values.summary.trim(),
    desiredJob: values.desiredJob.trim(),
    lastJob: (values.lastJob ?? "").trim(),
    experienceYears: values.experienceYears,
    seniority: values.seniority,
    workModel: values.workModel,
    skills,
    skillGroups,
    languages,
    experiences,
    education,
    certifications,
    salary: {
      clt: values.salaryClt,
      pj: values.salaryPj,
      btc: values.salaryBtc,
      negotiable: values.negotiable,
    },
    availabilityDays: values.availabilityDays,
    availability: availabilityLabel(values.availabilityDays, "pt"),
    temporaryJobMonths: values.temporaryJobMonths,
    travel: values.travel,
    pcd: values.pcd,
    regions: values.regions,
    notAllowedCompanies: splitList(values.notAllowedCompaniesText),
    lastActive: DEMO_NOW.toISOString(),
  };

  return { ...next, completion: computeCompletion(next) };
}
