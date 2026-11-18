import type { HiringCompany, MarketFact, MarketSource } from "@/types";

/** Fictional Telegram channels shaped after the Brazilian tech community. */
export const MARKET_SOURCES: MarketSource[] = [
  {
    id: "vagas-tech-br",
    channel: "Vagas Tech BR",
    focus: { pt: "Engenharia de produto", en: "Product engineering" },
    members: 38200,
    share: 24.6,
    signal: 11840,
  },
  {
    id: "dados-ia-brasil",
    channel: "Dados & IA Brasil",
    focus: { pt: "Dados, analytics e IA", en: "Data, analytics and AI" },
    members: 61000,
    share: 19.2,
    signal: 9240,
  },
  {
    id: "backend-brasil",
    channel: "Backend Brasil",
    focus: { pt: "Backend e plataformas", en: "Backend and platforms" },
    members: 52400,
    share: 14.8,
    signal: 7120,
  },
  {
    id: "frontend-brasil",
    channel: "Frontend Brasil",
    focus: { pt: "Frontend e design systems", en: "Frontend and design systems" },
    members: 47800,
    share: 11.4,
    signal: 5480,
  },
  {
    id: "devops-brasil",
    channel: "DevOps Brasil",
    focus: { pt: "Infraestrutura e SRE", en: "Infrastructure and SRE" },
    members: 44100,
    share: 9.7,
    signal: 4660,
  },
  {
    id: "ia-aplicada-brasil",
    channel: "IA Aplicada Brasil",
    focus: { pt: "IA aplicada e LLMs", en: "Applied AI and LLMs" },
    members: 35600,
    share: 7.1,
    signal: 3410,
  },
  {
    id: "produto-brasil",
    channel: "Produto Brasil",
    focus: { pt: "Produto e design", en: "Product and design" },
    members: 29900,
    share: 5.6,
    signal: 2690,
  },
  {
    id: "seguranca-tech-br",
    channel: "Segurança Tech BR",
    focus: { pt: "Segurança e AppSec", en: "Security and AppSec" },
    members: 27400,
    share: 4.1,
    signal: 1970,
  },
  {
    id: "lideranca-tech-br",
    channel: "Liderança Tech BR",
    focus: { pt: "Gestão e liderança", en: "Management and leadership" },
    members: 16400,
    share: 3.5,
    signal: 1680,
  },
];

export const HIRING_COMPANIES: HiringCompany[] = [
  {
    id: "aurora",
    name: "Aurora Finance",
    sector: { pt: "Banco digital", en: "Digital banking" },
    openRoles: 12,
    interval: { pt: "média de 9 dias para contratar", en: "9-day average time to hire" },
    tone: "navy",
  },
  {
    id: "vento",
    name: "Vento Labs",
    sector: { pt: "Risco climático", en: "Climate risk" },
    openRoles: 8,
    interval: { pt: "média de 14 dias para contratar", en: "14-day average time to hire" },
    tone: "teal",
  },
  {
    id: "onda",
    name: "Onda Energia",
    sector: { pt: "SaaS de energia", en: "Energy SaaS" },
    openRoles: 7,
    interval: { pt: "média de 17 dias para contratar", en: "17-day average time to hire" },
    tone: "amber",
  },
  {
    id: "kernel",
    name: "Kernel Bank",
    sector: { pt: "Infraestrutura bancária", en: "Banking infrastructure" },
    openRoles: 6,
    interval: { pt: "média de 21 dias para contratar", en: "21-day average time to hire" },
    tone: "blue",
  },
  {
    id: "sabia",
    name: "Sabiá AI",
    sector: { pt: "IA para atendimento", en: "Support automation" },
    openRoles: 5,
    interval: { pt: "média de 12 dias para contratar", en: "12-day average time to hire" },
    tone: "violet",
  },
  {
    id: "verde",
    name: "Verde Mobilidade",
    sector: { pt: "Mobilidade urbana", en: "Urban mobility" },
    openRoles: 4,
    interval: { pt: "média de 16 dias para contratar", en: "16-day average time to hire" },
    tone: "teal",
  },
];

export const MARKET_FACTS: MarketFact[] = [
  {
    id: "remote-senior",
    value: "-4,2%",
    label: { pt: "Distância salarial remoto × presencial", en: "Remote vs on-site pay gap" },
    detail: {
      pt: "Em 2024, vagas sênior remotas pagavam 11% menos que as presenciais em São Paulo. A diferença caiu para 4,2% em 2026.",
      en: "In 2024, remote senior roles paid 11% less than on-site roles in São Paulo. The gap narrowed to 4.2% in 2026.",
    },
  },
  {
    id: "llm-ops",
    value: "3,4×",
    label: { pt: "LLM Ops: demanda sobre oferta", en: "LLM Ops: demand over supply" },
    detail: {
      pt: "Para cada profissional com LLM Ops declarado, existem 3,4 vagas que pedem a habilidade. É o maior desequilíbrio entre as 358 skills monitoradas.",
      en: "For every professional listing LLM Ops, there are 3.4 roles asking for it — the widest imbalance across the 358 tracked skills.",
    },
  },
  {
    id: "first-48h",
    value: "48 h",
    label: { pt: "Janela de candidatura", en: "Application window" },
    detail: {
      pt: "Candidaturas enviadas nas primeiras 48 horas têm 2,4× mais chance de resposta do que as enviadas depois de duas semanas.",
      en: "Applications sent in the first 48 hours are 2.4× more likely to get a reply than those sent after two weeks.",
    },
  },
  {
    id: "ddd",
    value: "11",
    label: { pt: "DDD com mais vagas", en: "DDD with most roles" },
    detail: {
      pt: "São Paulo concentra 31% das vagas presenciais e híbridas. Em remoto, a liderança é de Curitiba e Florianópolis por custo de vida.",
      en: "São Paulo holds 31% of on-site and hybrid roles. For remote work, Curitiba and Florianópolis lead on cost of living.",
    },
  },
  {
    id: "salary-band",
    value: "R$ 18,5 mil",
    label: { pt: "Salário mediano sênior", en: "Median senior salary" },
    detail: {
      pt: "Mediana CLT para vagas sênior de engenharia em novembro de 2026. O topo da faixa, em bancos digitais, chega a R$ 34 mil.",
      en: "Median CLT salary for senior engineering roles in November 2026. The top of the range, in digital banks, reaches R$ 34k.",
    },
  },
  {
    id: "telegram-signal",
    value: "48 mil",
    label: { pt: "Sinais por mês", en: "Signals per month" },
    detail: {
      pt: "Mensagens públicas de vagas passam por deduplicação, normalização e classificação antes de virar uma linha na base.",
      en: "Public hiring messages are deduplicated, normalised and classified before becoming a row in the dataset.",
    },
  },
];

/** Bilingual "how it works" steps used on the home page and in stats. */
export const PIPELINE_STEPS = [
  {
    number: "01",
    title: { pt: "Sinal público, não scraping cego", en: "Public signal, not blind scraping" },
    body: {
      pt: "Mensagens de vagas em grupos públicos do Telegram são deduplicadas, normalizadas e classificadas contra uma taxonomia de 358 habilidades.",
      en: "Hiring messages from public Telegram groups are deduplicated, normalised and classified against a 358-skill taxonomy.",
    },
    tags: ["Telegram", "Deduplicação", "Taxonomia"],
  },
  {
    number: "02",
    title: { pt: "Um modelo de mercado consultável", en: "A market model you can query" },
    body: {
      pt: "Cada sinal vira uma linha com senioridade, região, modelo de trabalho, faixa salarial e habilidades — e alimenta o pulso mensal.",
      en: "Every signal becomes a row with seniority, region, work model, salary band and skills — then rolls up into the monthly pulse.",
    },
    tags: ["Senioridade", "Região", "Salário"],
  },
  {
    number: "03",
    title: { pt: "Vagas que merecem sua atenção", en: "Roles worth your attention" },
    body: {
      pt: "Os mesmos dados estruturados alimentam a vitrine de vagas, o match do seu perfil e as páginas de mercado. Uma fonte, nenhuma vaga inventada.",
      en: "The same structured data powers the job board, your profile match and the market pages. One source, no invented listings.",
    },
    tags: ["Vagas", "Match", "Mercado"],
  },
] as const;
