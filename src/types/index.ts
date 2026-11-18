export type Seniority = "junior" | "pleno" | "senior" | "especialista";
export type SeniorityFilter = Seniority | "all";
export type WorkModel = "remote" | "hybrid" | "onsite";
export type WorkModelFilter = WorkModel | "all";

export type MarketFilters = {
  month: string; // yyyy-MM
  year: string;
  seniority: SeniorityFilter;
  region: string; // "all" or a region slug
  workModel: WorkModelFilter;
};

export type MonthlyPoint = {
  key: string; // yyyy-MM
  label: string;
  vacancies: number;
  candidates: number;
};

export type SkillCategoryKey =
  | "data-ai"
  | "frontend"
  | "backend"
  | "cloud-devops"
  | "database"
  | "data-engineering"
  | "mobile"
  | "security"
  | "enterprise"
  | "architecture"
  | "design"
  | "delivery";

export type SkillDemand = {
  id: string;
  skill: string;
  category: SkillCategoryKey;
  demand: number;
  supply: number;
  trend: number;
  rank: number;
  tier: 1 | 2 | 3;
  medianSalary: number;
  remoteShare: number;
};

export type RegionPoint = {
  slug: string;
  name: string;
  state: string;
  vacancies: number;
  share: number;
  demandIndex: number;
};

export type SeniorityPoint = {
  seniority: Seniority;
  label: string;
  vacancies: number;
  share: number;
};

export type MarketSnapshot = {
  filters: MarketFilters;
  vacancies: number;
  vacancyTrend: number;
  skillsTracked: number;
  newSkills: number;
  topSkill: SkillDemand;
  topSkillIndex: number;
  marketPace: number;
  candidatePool: number;
  activeRecruiters: number;
  remoteShare: number;
  medianSalary: number;
  monthly: MonthlyPoint[];
  skills: SkillDemand[];
  regions: RegionPoint[];
  senioritySplit: SeniorityPoint[];
  generatedAt: string;
};

// Localisation ---------------------------------------------------------------

export type Localized<T> = { pt: T; en: T };
export type LocalizedString = Localized<string>;

// Jobs -----------------------------------------------------------------------

export type JobTone = "navy" | "blue" | "teal" | "amber" | "violet" | "rose" | "slate";

export type Job = {
  id: string;
  title: LocalizedString;
  company: string;
  companyTone: JobTone;
  companyDescription: LocalizedString;
  companySize: LocalizedString;
  location: LocalizedString;
  region: string;
  workModel: WorkModel;
  seniority: Seniority;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  postedAt: string;
  sourceChannel: string;
  sourceMembers: number;
  sourceNote: LocalizedString;
  summary: LocalizedString;
  responsibilities: Localized<string[]>;
  requirements: Localized<string[]>;
  benefits: Localized<string[]>;
  applicants: number;
  featured: boolean;
};

// Candidate ------------------------------------------------------------------

export type LanguageLevel = 1 | 2;
export type SpokenLanguage = { name: string; level: LanguageLevel };

export type Experience = {
  id: string;
  role: string;
  company: string;
  period: string;
  startYear: number;
  endYear: number | "present";
  location: string;
  summary: string;
  highlights: string[];
  current?: boolean;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  year: string;
  detail?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type SkillGroupKey = "core" | "cloud" | "data" | "avoid";
export type SkillGroup = { key?: SkillGroupKey; label: string; skills: string[] };

export type CandidateProfile = {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  ddd: string;
  location: string;
  region: string;
  seniority: Seniority;
  experienceYears: number;
  desiredJob: string;
  lastJob: string;
  summary: string;
  skills: string[];
  skillGroups: SkillGroup[];
  languages: SpokenLanguage[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  linkedin: string;
  verifiedLinkedin: boolean;
  availability: string;
  availabilityDays: number;
  workModel: WorkModel;
  salary: { clt: number; pj: number; btc: number; negotiable: boolean };
  temporaryJobMonths: number;
  travel: boolean;
  pcd: boolean;
  notAllowedCompanies: string[];
  regions: string[];
  completion: number;
  insertionDate: string;
  lastActive: string;
  status: CandidateStatus;
};

// Profile visibility ---------------------------------------------------------

export type ViewerDomain = {
  id: string;
  company: string;
  domain: string;
  views: number;
  lastViewed: string;
  hiringFor: string[];
  location: string;
  kind: "company" | "consultancy" | "independent";
};

export type ProfileViewEvent = {
  id: string;
  company: string;
  domain: string;
  date: string;
  kind: "view" | "search" | "save" | "match";
  label?: string;
};

export type VisibilityMonth = {
  month: string;
  views: number;
  appearances: number;
};

// Market sources -------------------------------------------------------------

export type MarketSource = {
  id: string;
  channel: string;
  focus: LocalizedString;
  members: number;
  share: number;
  signal: number;
};

export type HiringCompany = {
  id: string;
  name: string;
  sector: LocalizedString;
  openRoles: number;
  interval: LocalizedString;
  tone: JobTone;
};

export type MarketFact = {
  id: string;
  value: string;
  label: LocalizedString;
  detail: LocalizedString;
};

export type CandidateStatus = "open" | "interviewing" | "not-looking";
