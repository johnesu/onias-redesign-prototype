import type {
  MarketFilters,
  MarketSnapshot,
  MonthlyPoint,
  RegionPoint,
  Seniority,
  SeniorityPoint,
  SkillCategoryKey,
  SkillDemand,
} from "@/types";
import {
  ALL_MONTHS,
  DEMO_NOW,
  REGIONS,
  SENIORITIES,
  SENIORITY_MULTIPLIER,
  WORK_MODEL_MULTIPLIER,
  monthKey,
  shortMonthLabel,
  seniorityLabel,
} from "@/lib/months";
import { seededRandom } from "@/lib/utils";
import type { Locale } from "@/lib/locale";

type BaseSkill = {
  skill: string;
  category: SkillCategoryKey;
  demand: number;
  supply: number;
  trend: number;
  tier: 1 | 2 | 3;
  salary: number;
  remote: number;
};

/**
 * Fictional baseline for November 2026. Values are shaped after the kind of aggregate
 * the real "Vagas no Telegram" pipeline produces, but every figure is invented.
 */
const BASE_SKILLS: BaseSkill[] = [
  { skill: "Python & GenAI", category: "data-ai", demand: 14890, supply: 8200, trend: 18.4, tier: 1, salary: 18500, remote: 0.72 },
  { skill: "TypeScript & React", category: "frontend", demand: 11420, supply: 15800, trend: 9.2, tier: 1, salary: 16000, remote: 0.68 },
  { skill: "Node.js", category: "backend", demand: 9870, supply: 12400, trend: 6.1, tier: 1, salary: 14500, remote: 0.61 },
  { skill: "AWS", category: "cloud-devops", demand: 9120, supply: 7400, trend: 7.8, tier: 1, salary: 17500, remote: 0.55 },
  { skill: "SQL & PostgreSQL", category: "database", demand: 8460, supply: 13900, trend: 2.4, tier: 1, salary: 13000, remote: 0.48 },
  { skill: "Java & Spring", category: "backend", demand: 7930, supply: 8100, trend: 3.1, tier: 1, salary: 15500, remote: 0.42 },
  { skill: "Docker & Kubernetes", category: "cloud-devops", demand: 6810, supply: 5200, trend: 5.6, tier: 2, salary: 17200, remote: 0.57 },
  { skill: "Kafka", category: "data-engineering", demand: 5340, supply: 2900, trend: 11.3, tier: 2, salary: 19000, remote: 0.64 },
  { skill: "Next.js", category: "frontend", demand: 5010, supply: 6300, trend: 12.7, tier: 2, salary: 15800, remote: 0.76 },
  { skill: "React Native", category: "mobile", demand: 4720, supply: 4600, trend: 4.2, tier: 2, salary: 14000, remote: 0.81 },
  { skill: "Golang", category: "backend", demand: 4410, supply: 2600, trend: 6.5, tier: 2, salary: 18500, remote: 0.69 },
  { skill: "Airflow & dbt", category: "data-engineering", demand: 4120, supply: 2900, trend: 14.8, tier: 2, salary: 18000, remote: 0.66 },
  { skill: "Cybersecurity", category: "security", demand: 3980, supply: 2500, trend: 10.1, tier: 2, salary: 19500, remote: 0.48 },
  { skill: "LLM Ops & Vector DBs", category: "data-ai", demand: 3830, supply: 1100, trend: 34.2, tier: 1, salary: 22500, remote: 0.82 },
  { skill: ".NET & C#", category: "backend", demand: 3760, supply: 4300, trend: -1.3, tier: 2, salary: 13500, remote: 0.39 },
  { skill: "SAP S/4HANA", category: "enterprise", demand: 3480, supply: 2100, trend: 5.5, tier: 2, salary: 17500, remote: 0.21 },
  { skill: "Azure & DevOps", category: "cloud-devops", demand: 3260, supply: 2800, trend: 4.9, tier: 2, salary: 16000, remote: 0.52 },
  { skill: "PyTorch & MLOps", category: "data-ai", demand: 3120, supply: 1800, trend: 21.6, tier: 2, salary: 21000, remote: 0.74 },
  { skill: "Microservices Architecture", category: "architecture", demand: 2980, supply: 2400, trend: 3.4, tier: 2, salary: 20000, remote: 0.58 },
  { skill: "Product Design (Figma)", category: "design", demand: 2890, supply: 3400, trend: 1.8, tier: 3, salary: 11000, remote: 0.86 },
  { skill: "Terraform", category: "cloud-devops", demand: 2610, supply: 2200, trend: 3.8, tier: 2, salary: 16500, remote: 0.63 },
  { skill: "Flutter", category: "mobile", demand: 2410, supply: 3100, trend: -2.4, tier: 3, salary: 12500, remote: 0.84 },
  { skill: "Scrum & Agile", category: "delivery", demand: 2190, supply: 4700, trend: -4.1, tier: 3, salary: 10500, remote: 0.37 },
  { skill: "Kotlin", category: "mobile", demand: 1800, supply: 1600, trend: 2.9, tier: 3, salary: 15500, remote: 0.71 },
  { skill: "PHP & Laravel", category: "backend", demand: 1680, supply: 2400, trend: -5.2, tier: 3, salary: 10500, remote: 0.44 },
  { skill: "Rust", category: "backend", demand: 920, supply: 480, trend: 9.9, tier: 3, salary: 19500, remote: 0.78 },
];

const REGION_SHARES: Record<string, number> = {
  "sao-paulo": 0.283,
  "rio-de-janeiro": 0.108,
  "belo-horizonte": 0.089,
  curitiba: 0.062,
  "porto-alegre": 0.056,
  recife: 0.048,
  florianopolis: 0.039,
  brasilia: 0.041,
  campinas: 0.034,
  fortaleza: 0.037,
  "home-office": 0.203,
};

const REGION_SALARY_FACTOR: Record<string, number> = {
  "sao-paulo": 1.08,
  "rio-de-janeiro": 1.01,
  "belo-horizonte": 0.94,
  curitiba: 0.97,
  "porto-alegre": 0.95,
  recife: 0.86,
  florianopolis: 0.99,
  brasilia: 1.04,
  campinas: 1.02,
  fortaleza: 0.83,
  "home-office": 1.0,
};

/** November 2026 is 1.0, so the default screen matches the baseline table. */
const SEASONALITY: Record<string, number> = {
  "2025-01": 0.81,
  "2025-02": 0.83,
  "2025-03": 0.86,
  "2025-04": 0.84,
  "2025-05": 0.87,
  "2025-06": 0.88,
  "2025-07": 0.9,
  "2025-08": 0.92,
  "2025-09": 0.93,
  "2025-10": 0.92,
  "2025-11": 0.94,
  "2025-12": 0.82,
  "2026-01": 0.9,
  "2026-02": 0.92,
  "2026-03": 0.95,
  "2026-04": 0.94,
  "2026-05": 0.96,
  "2026-06": 0.97,
  "2026-07": 0.98,
  "2026-08": 0.99,
  "2026-09": 1.01,
  "2026-10": 0.995,
  "2026-11": 1,
};

const BASE_VACANCIES = 48250;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function regionScale(filters: MarketFilters) {
  if (filters.region === "all") return 1;
  return REGION_SHARES[filters.region] ?? 1;
}

function filterScale(filters: MarketFilters) {
  const seniority = SENIORITY_MULTIPLIER[filters.seniority];
  const workModel = WORK_MODEL_MULTIPLIER[filters.workModel];
  const month = SEASONALITY[filters.month] ?? 1;
  return seniority * workModel * month * regionScale(filters);
}

function roundTo(value: number, step = 10) {
  return Math.max(step, Math.round(value / step) * step);
}

function buildSkills(filters: MarketFilters): SkillDemand[] {
  const scale = filterScale(filters);
  const random = seededRandom(`skills|${filters.month}|${filters.seniority}|${filters.region}|${filters.workModel}`);
  const baseScale = filterScale({ ...filters, region: "all" });

  const skills = BASE_SKILLS.map((base) => {
    const jitter = 0.94 + random() * 0.12;
    const regionMix = filters.region === "all" ? 1 : 0.92 + random() * 0.16;
    const demand = Math.round(base.demand * scale * jitter * regionMix);
    const supply = Math.round(base.supply * baseScale * (0.95 + random() * 0.1) * regionMix);
    const trend = Number((base.trend * (0.86 + random() * 0.3)).toFixed(1));
    const salaryFactor = filters.region === "all" ? 1 : (REGION_SALARY_FACTOR[filters.region] ?? 1);
    return {
      id: slugify(base.skill),
      skill: base.skill,
      category: base.category,
      demand,
      supply,
      trend,
      tier: base.tier,
      medianSalary: roundTo(base.salary * salaryFactor, 100),
      remoteShare: Math.min(0.97, Math.max(0.08, base.remote + (random() - 0.5) * 0.06)),
      rank: 0,
    } satisfies SkillDemand;
  });

  return skills
    .sort((first, second) => second.demand - first.demand)
    .map((skill, index) => ({ ...skill, rank: index + 1 }));
}

function buildMonthly(filters: MarketFilters, locale: Locale): MonthlyPoint[] {
  const selectedIndex = ALL_MONTHS.findIndex((month) => month.key === filters.month);
  const endIndex = selectedIndex >= 0 ? selectedIndex : ALL_MONTHS.length - 1;
  const startIndex = Math.max(0, endIndex - 11);
  const months = ALL_MONTHS.slice(startIndex, endIndex + 1);

  return months.map((month) => {
    const random = seededRandom(`month|${month.key}|${filters.seniority}|${filters.region}|${filters.workModel}`);
    const scale = filterScale({ ...filters, month: month.key });
    const growth = 1 + (month.year - 2025) * 0.012 + month.month * 0.0015;
    return {
      key: month.key,
      label: shortMonthLabel(month.key, locale),
      vacancies: Math.round(BASE_VACANCIES * scale * growth * (0.97 + random() * 0.06)),
      candidates: Math.round(15300 * Math.sqrt(scale) * growth * (0.94 + random() * 0.1)),
    };
  });
}

function buildRegions(): RegionPoint[] {
  const random = seededRandom("regions|2026-11");
  const points = REGIONS.map((region) => {
    const share = REGION_SHARES[region.slug] ?? 0.03;
    const vacancies = Math.round(BASE_VACANCIES * share * (0.95 + random() * 0.1));
    return {
      slug: region.slug,
      name: region.name,
      state: region.state,
      vacancies,
      share: share * 100,
      demandIndex: Math.round(58 + share * 150 + random() * 12),
    } satisfies RegionPoint;
  });
  const total = points.reduce((sum, point) => sum + point.vacancies, 0);
  return points
    .map((point) => ({ ...point, share: Number(((point.vacancies / total) * 100).toFixed(1)) }))
    .sort((first, second) => second.vacancies - first.vacancies);
}

function buildSeniority(locale: Locale): SeniorityPoint[] {
  const shares: Record<Seniority, number> = { junior: 0.28, pleno: 0.34, senior: 0.27, especialista: 0.11 };
  return SENIORITIES.map(({ value }) => ({
    seniority: value,
    label: seniorityLabel(value, locale),
    vacancies: Math.round(BASE_VACANCIES * shares[value]),
    share: shares[value] * 100,
  }));
}

export function getMarketSnapshot(filters: MarketFilters, locale: Locale = "pt"): MarketSnapshot {
  const skills = buildSkills(filters);
  const scale = filterScale(filters);
  const weekSeed = seededRandom(`snapshot|${filters.month}|${filters.seniority}|${filters.region}|${filters.workModel}`);
  const vacancies = Math.round(BASE_VACANCIES * scale * (0.995 + weekSeed() * 0.01));
  const monthly = buildMonthly(filters, locale);
  const previous = monthly.length > 1 ? monthly[monthly.length - 2].vacancies : vacancies * 0.89;
  const vacancyTrend = Number((((vacancies - previous) / Math.max(previous, 1)) * 100).toFixed(1));
  const topSkill = skills[0];
  const maxDemand = topSkill?.demand ?? 1;
  const topSkillIndex = Math.round(70 + (maxDemand / Math.max(maxDemand, 1)) * 0 + 22 + weekSeed() * 2);
  const marketPace = Number((6.8 + (scale > 0.4 ? 0.8 : 0.4) + weekSeed() * 0.5).toFixed(1));
  const remoteShare = Math.round(skills.reduce((total, skill) => total + skill.remoteShare, 0) / Math.max(skills.length, 1) * 100);
  const medianSalary = Math.round(skills.reduce((total, skill) => total + skill.medianSalary, 0) / Math.max(skills.length, 1));

  return {
    filters,
    vacancies,
    vacancyTrend,
    skillsTracked: filters.seniority === "all" && filters.region === "all" ? 358 : Math.round(358 * Math.sqrt(Math.max(scale, 0.1))),
    newSkills: Math.round(12 * Math.sqrt(Math.max(scale, 0.1))),
    topSkill,
    topSkillIndex,
    marketPace,
    candidatePool: Math.round(38400 * Math.sqrt(Math.max(scale, 0.12))),
    activeRecruiters: Math.round(2440 * Math.sqrt(Math.max(scale, 0.12))),
    remoteShare,
    medianSalary,
    monthly,
    skills,
    regions: buildRegions(),
    senioritySplit: buildSeniority(locale),
    generatedAt: DEMO_NOW.toISOString(),
  };
}

export type SkillEvolutionPoint = {
  key: string;
  label: string;
  demand: number;
  supply: number;
};

export function getSkillEvolution(skillId: string, filters: MarketFilters, months = 12, locale: Locale = "pt"): SkillEvolutionPoint[] {
  const base = BASE_SKILLS.find((skill) => slugify(skill.skill) === skillId) ?? BASE_SKILLS[0];
  const selectedIndex = ALL_MONTHS.findIndex((month) => month.key === filters.month);
  const endIndex = selectedIndex >= 0 ? selectedIndex : ALL_MONTHS.length - 1;
  const startIndex = Math.max(0, endIndex - (months - 1));
  const chosen = ALL_MONTHS.slice(startIndex, endIndex + 1);
  const scale = filterScale(filters);

  return chosen.map((month, index) => {
    const random = seededRandom(`evolution|${skillId}|${month.key}|${filters.region}`);
    const progress = chosen.length <= 1 ? 1 : index / (chosen.length - 1);
    const growth = 1 + (base.trend / 100) * (progress - 1);
    return {
      key: month.key,
      label: shortMonthLabel(month.key, locale),
      demand: Math.round(base.demand * scale * growth * (0.96 + random() * 0.08)),
      supply: Math.round(base.supply * scale * (0.95 + progress * 0.04) * (0.96 + random() * 0.08)),
    };
  });
}

export function getSkillBase(skillId: string) {
  return BASE_SKILLS.find((skill) => slugify(skill.skill) === skillId);
}

export function currentMonthKey() {
  return monthKey(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth());
}
