import type { CandidateProfile } from "@/types";
import { DEMO_NOW } from "@/lib/months";

/**
 * Candidate content is written by the candidate, in Portuguese. The interface
 * around it is translated; the content itself is never machine-translated in
 * this prototype, which mirrors how the demo product would behave.
 */
export const MOCK_PROFILE: CandidateProfile = {
  id: "daniel-martins",
  name: "Daniel Martins",
  title: "Desenvolvedor Full-Stack Sênior",
  email: "daniel.martins@example.com",
  phone: "+55 11 98765 4321",
  ddd: "11",
  location: "São Paulo, SP",
  region: "sao-paulo",
  seniority: "senior",
  experienceYears: 7,
  desiredJob: "Engenheiro Full-Stack Sênior",
  lastJob: "Desenvolvedor Full-Stack Sênior",
  summary:
    "Engenheiro full-stack com 7 anos construindo produtos de pagamento e saúde de ponta a ponta. Trabalho com React, TypeScript, Node.js e PostgreSQL e me importo com as partes pouco glamourosas que tornam o software confiável: contratos claros, observabilidade e ciclos de feedback curtos. Nos últimos anos liderei a migração do checkout para Next.js e reduzi a latência p95 em 38%.",
  skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "AWS", "Docker", "GraphQL"],
  skillGroups: [
    { key: "core", label: "Core engineering", skills: ["React", "TypeScript", "Node.js", "Next.js", "PostgreSQL"] },
    { key: "cloud", label: "Cloud & DevOps", skills: ["AWS", "Docker", "GraphQL"] },
    { key: "data", label: "Data & analytics", skills: ["SQL", "dbt", "Looker"] },
    { key: "avoid", label: "Prefer to avoid", skills: ["PHP legado", "SAP ABAP"] },
  ],
  languages: [
    { name: "Português", level: 2 },
    { name: "Inglês", level: 2 },
    { name: "Espanhol", level: 1 },
  ],
  experiences: [
    {
      id: "daniel-exp-1",
      role: "Desenvolvedor Full-Stack Sênior",
      company: "Aurora Finance",
      period: "2022 — hoje",
      startYear: 2022,
      endYear: "present",
      location: "São Paulo, SP",
      current: true,
      summary:
        "Checkout e onboarding de um banco digital com 2,4 milhões de clientes. Tech lead de um time de cinco pessoas.",
      highlights: [
        "Liderou a migração do checkout para Next.js, reduzindo a latência p95 em 38%.",
        "Desenhou os contratos de idempotência usados por todos os fluxos de pagamento.",
        "Reduziu o tempo de onboarding de 11 para 4 minutos com automação de KYC.",
      ],
    },
    {
      id: "daniel-exp-2",
      role: "Desenvolvedor Full-Stack",
      company: "Clínica Digital",
      period: "2019 — 2022",
      startYear: 2019,
      endYear: 2022,
      location: "Remoto",
      summary: "Plataforma de telemedicina usada por 180 clínicas e 40 mil pacientes por mês.",
      highlights: [
        "Construiu o agendamento e a sala de vídeo usados em consultas de rotina.",
        "Introduziu trilhas de auditoria compatíveis com a LGPD para prontuários.",
        "Migrou jobs em lote para workers containerizados na AWS.",
      ],
    },
    {
      id: "daniel-exp-3",
      role: "Desenvolvedor Frontend",
      company: "Studio Aurora",
      period: "2017 — 2019",
      startYear: 2017,
      endYear: 2019,
      location: "Campinas, SP",
      summary: "Interfaces com muita densidade de dados para clientes de educação e marketplace.",
      highlights: [
        "Entregou dashboards usados por 20 mil usuários ativos por mês.",
        "Criou a primeira biblioteca de componentes e os testes de regressão visual.",
      ],
    },
  ],
  education: [
    {
      id: "daniel-edu-1",
      degree: "Bacharelado em Ciência da Computação",
      institution: "UNICAMP",
      year: "2017",
      detail: "Optativas em sistemas distribuídos",
    },
    {
      id: "daniel-edu-2",
      degree: "Pós-graduação em Arquitetura de Software",
      institution: "FIAP",
      year: "2021",
    },
  ],
  certifications: [
    {
      id: "daniel-cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "AWS",
      year: "2024",
    },
    {
      id: "daniel-cert-2",
      name: "Professional Scrum Developer I",
      issuer: "Scrum.org",
      year: "2022",
    },
  ],
  linkedin: "https://www.linkedin.com/in/daniel-martins-demo",
  verifiedLinkedin: true,
  availability: "30 dias",
  availabilityDays: 30,
  workModel: "hybrid",
  salary: { clt: 18500, pj: 22000, btc: 0, negotiable: true },
  temporaryJobMonths: 0,
  travel: true,
  pcd: false,
  notAllowedCompanies: ["northwindtalent.com.br", "cobaltconsulting.com"],
  regions: ["sao-paulo", "home-office"],
  completion: 88,
  insertionDate: "2024-03-08T10:00:00",
  lastActive: "2026-11-15T09:12:00",
  status: "open",
};

export const PROFILE_STATS = {
  recruiterViews: 24,
  recruiterViewsTrend: 18,
  smartMatches: 18,
  searchAppearances: 132,
  savedByRecruiters: 7,
  profileAppearances: 412,
  matchLabel: "8 high confidence",
};

/**
 * Starting point for a visitor who chooses "Create profile". It is intentionally
 * empty: no demo experience, skills or LinkedIn are inherited, so the saved
 * profile belongs to whoever filled the wizard.
 */
export function createBlankProfile(): CandidateProfile {
  return {
    id: "local-candidate",
    name: "",
    title: "",
    email: "",
    phone: "",
    ddd: "",
    location: "",
    region: "",
    seniority: "pleno",
    experienceYears: 0,
    desiredJob: "",
    lastJob: "",
    summary: "",
    skills: [],
    skillGroups: [],
    languages: [],
    experiences: [],
    education: [],
    certifications: [],
    linkedin: "",
    verifiedLinkedin: false,
    availability: "30 dias",
    availabilityDays: 30,
    workModel: "remote",
    salary: { clt: 0, pj: 0, btc: 0, negotiable: true },
    temporaryJobMonths: 0,
    travel: false,
    pcd: false,
    notAllowedCompanies: [],
    regions: [],
    completion: 0,
    insertionDate: DEMO_NOW.toISOString(),
    lastActive: DEMO_NOW.toISOString(),
    status: "open",
  };
}

