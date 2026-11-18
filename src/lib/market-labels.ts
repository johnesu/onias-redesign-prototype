import type { Locale } from "@/lib/locale";

export const SKILL_NAME_OVERRIDES: Record<string, { pt: string; en: string }> = {
  "Python & GenAI": { pt: "Python & IA generativa", en: "Python & GenAI" },
  Cybersecurity: { pt: "Cibersegurança", en: "Cybersecurity" },
  "LLM Ops & Vector DBs": { pt: "LLM Ops & bancos vetoriais", en: "LLM Ops & Vector DBs" },
  "Microservices Architecture": { pt: "Arquitetura de microsserviços", en: "Microservices Architecture" },
};

export function skillName(skill: string, locale: Locale) {
  return SKILL_NAME_OVERRIDES[skill]?.[locale] ?? skill;
}

export const SKILL_CATEGORY_ORDER = [
  "data-ai",
  "frontend",
  "backend",
  "cloud-devops",
  "database",
  "data-engineering",
  "mobile",
  "security",
  "enterprise",
  "architecture",
  "design",
  "delivery",
] as const;

export const SKILL_CATEGORY_LABELS: Record<string, { pt: string; en: string }> = {
  "data-ai": { pt: "Dados & IA", en: "Data & AI" },
  frontend: { pt: "Frontend", en: "Frontend" },
  backend: { pt: "Backend", en: "Backend" },
  "cloud-devops": { pt: "Cloud & DevOps", en: "Cloud & DevOps" },
  database: { pt: "Banco de dados", en: "Database" },
  "data-engineering": { pt: "Engenharia de dados", en: "Data engineering" },
  mobile: { pt: "Mobile", en: "Mobile" },
  security: { pt: "Segurança", en: "Security" },
  enterprise: { pt: "Sistemas corporativos", en: "Enterprise systems" },
  architecture: { pt: "Arquitetura", en: "Architecture" },
  design: { pt: "Design", en: "Design" },
  delivery: { pt: "Entrega", en: "Delivery" },
};

export function categoryName(category: string, locale: Locale) {
  return SKILL_CATEGORY_LABELS[category]?.[locale] ?? category;
}
