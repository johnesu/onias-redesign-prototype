import type { MarketFilters, Seniority, SeniorityFilter, WorkModel, WorkModelFilter } from "@/types";
import type { Locale } from "@/lib/locale";

/** Fixed "today" for the prototype so demo screens stay internally consistent. */
export const DEMO_NOW = new Date("2026-11-15T09:30:00");

const MONTH_NAMES_BY_LOCALE: Record<Locale, string[]> = {
  pt: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export const MONTH_NAMES = MONTH_NAMES_BY_LOCALE.en;

const MONTH_SHORT: Record<Locale, string[]> = {
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export function monthKey(year: number, monthIndex: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function demoMonths(count = 18, end = DEMO_NOW) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(end.getFullYear(), end.getMonth() - (count - 1 - index), 1);
    return {
      key: monthKey(date.getFullYear(), date.getMonth()),
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  });
}

export const ALL_MONTHS = demoMonths(23);

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function monthLabel(key: string, locale: Locale = "pt") {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  return `${capitalize(MONTH_NAMES_BY_LOCALE[locale][month - 1])} ${year}`;
}

export function shortMonthLabel(key: string, locale: Locale = "pt") {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  return `${MONTH_SHORT[locale][month - 1]} ${String(year).slice(2)}`;
}

export function monthsOfYear(year: number) {
  return ALL_MONTHS.filter((month) => month.year === year);
}

export const YEARS = Array.from(new Set(ALL_MONTHS.map((month) => month.year))).sort();

export const SENIORITIES: { value: Seniority; label: string }[] = [
  { value: "junior", label: "Junior" },
  { value: "pleno", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "especialista", label: "Specialist" },
];

export const WORK_MODELS: { value: WorkModel; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const SENIORITY_LABELS: Record<Locale, Record<SeniorityFilter, string>> = {
  pt: {
    all: "Todas as senioridades",
    junior: "Júnior",
    pleno: "Pleno",
    senior: "Sênior",
    especialista: "Especialista",
  },
  en: {
    all: "All seniorities",
    junior: "Junior",
    pleno: "Mid-level",
    senior: "Senior",
    especialista: "Specialist",
  },
};

const WORK_MODEL_LABELS: Record<Locale, Record<WorkModelFilter, string>> = {
  pt: { all: "Todos os modelos", remote: "Remoto", hybrid: "Híbrido", onsite: "Presencial" },
  en: { all: "All work models", remote: "Remote", hybrid: "Hybrid", onsite: "On-site" },
};

export const SENIORITY_LABEL: Record<SeniorityFilter, string> = SENIORITY_LABELS.en;
export const WORK_MODEL_LABEL: Record<WorkModelFilter, string> = WORK_MODEL_LABELS.en;

export function seniorityLabel(value: SeniorityFilter, locale: Locale = "pt") {
  return SENIORITY_LABELS[locale][value];
}

export function workModelLabel(value: WorkModelFilter, locale: Locale = "pt") {
  return WORK_MODEL_LABELS[locale][value];
}

export const REGIONS = [
  { slug: "sao-paulo", name: "São Paulo", nameEn: "São Paulo", state: "SP", ddd: "11" },
  { slug: "rio-de-janeiro", name: "Rio de Janeiro", nameEn: "Rio de Janeiro", state: "RJ", ddd: "21" },
  { slug: "belo-horizonte", name: "Belo Horizonte", nameEn: "Belo Horizonte", state: "MG", ddd: "31" },
  { slug: "curitiba", name: "Curitiba", nameEn: "Curitiba", state: "PR", ddd: "41" },
  { slug: "porto-alegre", name: "Porto Alegre", nameEn: "Porto Alegre", state: "RS", ddd: "51" },
  { slug: "recife", name: "Recife", nameEn: "Recife", state: "PE", ddd: "81" },
  { slug: "florianopolis", name: "Florianópolis", nameEn: "Florianópolis", state: "SC", ddd: "48" },
  { slug: "brasilia", name: "Brasília", nameEn: "Brasília", state: "DF", ddd: "61" },
  { slug: "campinas", name: "Campinas", nameEn: "Campinas", state: "SP", ddd: "19" },
  { slug: "fortaleza", name: "Fortaleza", nameEn: "Fortaleza", state: "CE", ddd: "85" },
  { slug: "home-office", name: "Home office", nameEn: "Remote", state: "BR", ddd: "10" },
] as const;

export const DEFAULT_FILTERS: MarketFilters = {
  month: "2026-11",
  year: "2026",
  seniority: "all",
  region: "all",
  workModel: "all",
};

export const SENIORITY_MULTIPLIER: Record<SeniorityFilter, number> = {
  all: 1,
  junior: 0.28,
  pleno: 0.34,
  senior: 0.27,
  especialista: 0.11,
};

export const WORK_MODEL_MULTIPLIER: Record<WorkModelFilter, number> = {
  all: 1,
  remote: 0.46,
  hybrid: 0.34,
  onsite: 0.2,
};

export function regionName(slug: string, locale: Locale = "pt") {
  if (slug === "all") return locale === "pt" ? "Todas as regiões" : "All regions";
  const region = REGIONS.find((item) => item.slug === slug);
  if (!region) return slug;
  return locale === "pt" ? region.name : region.nameEn;
}
