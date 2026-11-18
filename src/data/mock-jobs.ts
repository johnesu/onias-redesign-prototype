import type { Job } from "@/types";
import { DEMO_NOW } from "@/lib/months";

function daysAgo(days: number) {
  return new Date(DEMO_NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

const SOURCE_NOTE = {
  pt: "Mensagem pública do grupo, normalizada pela ONIAS.",
  en: "Public group message, normalised by ONIAS.",
};

/**
 * Fourteen fictional roles shaped after the Brazilian tech market and the kind
 * of postings aggregated by ONIAS. Every company, person and vacancy is invented.
 * Descriptions are written natively in Portuguese and English.
 */
export const JOBS: Job[] = [
  {
    id: "fullstack-senior-aurora",
    title: { pt: "Pessoa Desenvolvedora Full-Stack Sênior", en: "Senior Full-Stack Engineer" },
    company: "Aurora Finance",
    companyTone: "navy",
    companyDescription: {
      pt: "Banco digital para pequenas e médias empresas.",
      en: "Digital bank for small and mid-sized businesses.",
    },
    companySize: { pt: "480 pessoas", en: "480 people" },
    location: { pt: "São Paulo, SP", en: "São Paulo, SP" },
    region: "sao-paulo",
    workModel: "hybrid",
    seniority: "senior",
    salaryMin: 18000,
    salaryMax: 24000,
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
    postedAt: daysAgo(1),
    sourceChannel: "Vagas Tech BR",
    sourceMembers: 38000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Você vai cuidar do checkout e do onboarding usados por 2,4 milhões de clientes. O trabalho atravessa um frontend em Next.js e uma plataforma em Node.js, com voz ativa na modelagem de movimentação de dinheiro.",
      en: "Own the checkout and onboarding surfaces used by 2.4 million customers. You will work across a Next.js frontend and a Node.js platform, with a strong say in how money movement is modelled.",
    },
    responsibilities: {
      pt: [
        "Liderar a entrega ponta a ponta das jornadas de checkout, onboarding e conta.",
        "Desenhar APIs e contratos de dados junto com produto e risco.",
        "Elevar o padrão de observabilidade, acessibilidade e performance do frontend.",
        "Mentorar quatro pessoas engenheiras em revisões de arquitetura e pair programming.",
      ],
      en: [
        "Lead end-to-end delivery of checkout, onboarding and account surfaces.",
        "Design APIs and data contracts together with product and risk teams.",
        "Raise the bar on observability, accessibility and frontend performance.",
        "Mentor four engineers through architecture reviews and pairing.",
      ],
    },
    requirements: {
      pt: [
        "6+ anos construindo aplicações web em produção com TypeScript.",
        "React avançado e experiência sólida com Node.js e PostgreSQL.",
        "Conforto com fluxos de pagamento, idempotência e trilhas de auditoria.",
        "Inglês para comunicação assíncrona com um time distribuído.",
      ],
      en: [
        "6+ years building production web applications with TypeScript.",
        "Deep React knowledge and solid Node.js/PostgreSQL experience.",
        "Comfort with payment flows, idempotency and financial audit trails.",
        "English for async written communication with a distributed team.",
      ],
    },
    benefits: {
      pt: ["Plano de saúde e odontológico", "R$ 1.200 de auxílio-refeição", "26 dias de férias remuneradas", "Auxílio home office"],
      en: ["Health and dental plan", "R$ 1,200 meal allowance", "26 days paid leave", "Home-office stipend"],
    },
    applicants: 48,
    featured: true,
  },
  {
    id: "dados-staff-vento",
    title: { pt: "Pessoa Engenheira de Dados Staff", en: "Staff Data Engineer" },
    company: "Vento Labs",
    companyTone: "teal",
    companyDescription: {
      pt: "Plataforma de risco climático para seguradoras e gestores de ativos.",
      en: "Climate-risk platform for insurers and asset managers.",
    },
    companySize: { pt: "210 pessoas", en: "210 people" },
    location: { pt: "Remoto · Brasil", en: "Remote · Brazil" },
    region: "home-office",
    workModel: "remote",
    seniority: "especialista",
    salaryMin: 22000,
    salaryMax: 28000,
    skills: ["Python", "Airflow", "dbt", "Kafka", "BigQuery"],
    postedAt: daysAgo(2),
    sourceChannel: "Dados & IA Brasil",
    sourceMembers: 61000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Construa a espinha dorsal de eventos de uma plataforma de risco climático usada por seguradoras e grandes gestores de ativos. A plataforma ingere 3,1 bilhões de eventos por mês e alimenta todos os modelos voltados ao cliente.",
      en: "Build the event backbone behind a climate-risk platform used by insurers and large asset managers. The platform ingests 3.1 billion events per month and feeds every customer-facing model.",
    },
    responsibilities: {
      pt: [
        "Ser dona da arquitetura de streaming e batch, da ingestão à camada semântica.",
        "Definir metas de confiabilidade e conduzir post-mortems de pipelines críticos.",
        "Trabalhar com machine learning em feature stores e monitoramento de modelos.",
        "Estabelecer contratos de dados entre seis squads de produto.",
      ],
      en: [
        "Own the streaming and batch architecture from ingestion to the semantic layer.",
        "Set reliability targets and lead incident reviews for critical pipelines.",
        "Partner with ML engineers on feature stores and model monitoring.",
        "Define data contracts across six product squads.",
      ],
    },
    requirements: {
      pt: [
        "8+ anos em engenharia de dados, sendo 3+ em nível staff.",
        "Experiência em produção com Kafka, Airflow e um data warehouse moderno.",
        "Python e SQL fortes; dbt e infraestrutura como código no dia a dia.",
        "Histórico de simplificar plataformas em vez de acumulá-las.",
      ],
      en: [
        "8+ years in data engineering, including 3+ years at staff level.",
        "Production experience with Kafka, Airflow and a modern warehouse.",
        "Strong Python and SQL; dbt and infrastructure-as-code are expected.",
        "A track record of simplifying rather than adding platforms.",
      ],
    },
    benefits: {
      pt: ["Trabalho 100% remoto", "R$ 2.000 de auxílio remoto", "Stock options", "Previdência privada"],
      en: ["Fully remote", "R$ 2,000 remote budget", "Stock options", "Private pension"],
    },
    applicants: 31,
    featured: true,
  },
  {
    id: "product-designer-onda",
    title: { pt: "Pessoa Product Designer", en: "Product Designer" },
    company: "Onda Energia",
    companyTone: "amber",
    companyDescription: {
      pt: "SaaS de gestão de energia para pequenos negócios.",
      en: "Energy management SaaS for small businesses.",
    },
    companySize: { pt: "320 pessoas", en: "320 people" },
    location: { pt: "São Paulo, SP", en: "São Paulo, SP" },
    region: "sao-paulo",
    workModel: "hybrid",
    seniority: "pleno",
    salaryMin: 11000,
    salaryMax: 15000,
    skills: ["Figma", "Design systems", "Pesquisa com usuários", "Prototipação"],
    postedAt: daysAgo(2),
    sourceChannel: "Design Brasil",
    sourceMembers: 24000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Desenhe como pequenos negócios entendem e reduzem a conta de energia. Você será responsável pela experiência ponta a ponta de um produto usado por 90 mil empresas, da primeira entrevista à interface entregue.",
      en: "Shape how small businesses understand and reduce their energy bill. You will own the end-to-end experience of a product used by 90,000 companies, from first research to shipped interface.",
    },
    responsibilities: {
      pt: [
        "Liderar discovery e concept design das jornadas de faturamento e economia.",
        "Evoluir e documentar um design system compartilhado por três squads.",
        "Prototipar modelos de interação e validá-los com clientes.",
        "Trabalhar diariamente com engenharia para preservar o capricho na implementação.",
      ],
      en: [
        "Lead discovery and concept design for the billing and savings journeys.",
        "Extend and document a shared design system used by three squads.",
        "Prototype interaction models and validate them with customers.",
        "Work daily with engineering to protect craft through implementation.",
      ],
    },
    requirements: {
      pt: [
        "3+ anos desenhando produtos B2B ou fintech complexos.",
        "Portfólio com resultados mensuráveis, não só telas.",
        "Pensamento sistêmico e prototipação fluente no Figma.",
        "Conforto para conduzir pesquisa em português com donos de negócio.",
      ],
      en: [
        "3+ years designing complex B2B or fintech products.",
        "A portfolio showing measurable outcomes, not just screens.",
        "Strong systems thinking and fluent Figma prototyping.",
        "Comfort running research in Portuguese with business owners.",
      ],
    },
    benefits: {
      pt: ["Híbrido com 2 dias presenciais", "Plano de saúde", "Verba de aprendizado", "Equity"],
      en: ["Hybrid, 2 days on-site", "Health plan", "Learning budget", "Equity"],
    },
    applicants: 76,
    featured: true,
  },
  {
    id: "plataforma-atlas",
    title: { pt: "Pessoa Engenheira de Plataforma", en: "Platform Engineer" },
    company: "Atlas People",
    companyTone: "blue",
    companyDescription: {
      pt: "Plataforma de pessoas e operações para empresas em crescimento.",
      en: "People and operations platform for growing companies.",
    },
    companySize: { pt: "260 pessoas", en: "260 people" },
    location: { pt: "Remoto · Brasil", en: "Remote · Brazil" },
    region: "home-office",
    workModel: "remote",
    seniority: "senior",
    salaryMin: 19000,
    salaryMax: 24000,
    skills: ["Kubernetes", "Terraform", "AWS", "Go", "Observabilidade"],
    postedAt: daysAgo(3),
    sourceChannel: "DevOps Brasil",
    sourceMembers: 44000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Dê a 140 pessoas engenheiras uma plataforma com a qual elas não precisem se preocupar. Você será dona do caminho dourado do pull request à produção, com confiabilidade e custo como resultados explícitos de produto.",
      en: "Give 140 engineers a platform they do not have to think about. You will own the golden path from pull request to production, with reliability and cost as explicit product outcomes.",
    },
    responsibilities: {
      pt: [
        "Evoluir a plataforma interna de desenvolvimento e os templates de serviço.",
        "Automatizar entrega, rollback e provisionamento de ambientes.",
        "Reduzir o gasto de cloud sem trocar confiabilidade por economia.",
        "Orientar squads em prontidão para produção e resposta a incidentes.",
      ],
      en: [
        "Evolve the internal developer platform and service templates.",
        "Automate delivery, rollback and environment provisioning.",
        "Reduce cloud spend without trading away reliability.",
        "Coach squads on production readiness and incident response.",
      ],
    },
    requirements: {
      pt: [
        "5+ anos em plataforma, SRE ou DevOps.",
        "Kubernetes, Terraform e AWS na mão, em escala.",
        "Fluência de código em Go, Python ou TypeScript.",
        "Comunicação escrita clara e maturidade com on-call.",
      ],
      en: [
        "5+ years in platform, SRE or DevOps roles.",
        "Hands-on Kubernetes, Terraform and AWS at scale.",
        "Coding fluency in Go, Python or TypeScript.",
        "Clear written communication and on-call maturity.",
      ],
    },
    benefits: {
      pt: ["Remoto-first", "Remuneração de on-call", "Auxílio home office", "Stock options"],
      en: ["Remote-first", "On-call compensation", "Home-office budget", "Stock options"],
    },
    applicants: 54,
    featured: false,
  },
  {
    id: "mobile-verde",
    title: { pt: "Pessoa Engenheira Mobile (React Native)", en: "Mobile Engineer (React Native)" },
    company: "Verde Mobilidade",
    companyTone: "teal",
    companyDescription: {
      pt: "Mobilidade urbana em nove cidades brasileiras.",
      en: "Urban mobility across nine Brazilian cities.",
    },
    companySize: { pt: "540 pessoas", en: "540 people" },
    location: { pt: "Recife, PE", en: "Recife, PE" },
    region: "recife",
    workModel: "hybrid",
    seniority: "pleno",
    salaryMin: 12000,
    salaryMax: 16000,
    skills: ["React Native", "TypeScript", "iOS", "Android", "Expo"],
    postedAt: daysAgo(3),
    sourceChannel: "Vagas Mobile BR",
    sourceMembers: 22000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Construa o app que move 400 mil pessoas por dia em nove cidades brasileiras. Fluxos offline-first, performance de mapas e planejamento de viagem acessível são o centro do trabalho.",
      en: "Build the app that moves 400,000 people a day across nine Brazilian cities. Offline-first flows, map performance and accessible trip planning are the core of the job.",
    },
    responsibilities: {
      pt: [
        "Entregar funcionalidades em iOS e Android a partir de uma base TypeScript compartilhada.",
        "Melhorar o cold start e a renderização de mapas em aparelhos de entrada.",
        "Cuidar da saúde das releases, triagem de crashes e estratégia de rollout nas lojas.",
        "Trabalhar com design nos detalhes de movimento e acessibilidade.",
      ],
      en: [
        "Ship features across iOS and Android from a shared TypeScript codebase.",
        "Improve cold-start time and map rendering on low-end devices.",
        "Own release health, crash triage and store rollout strategy.",
        "Partner with design on motion and accessibility details.",
      ],
    },
    requirements: {
      pt: [
        "3+ anos publicando apps React Native em produção.",
        "TypeScript forte e depuração nativa.",
        "Experiência com mapas, geolocalização ou persistência offline.",
        "Disponibilidade para dois dias por semana no escritório do Recife.",
      ],
      en: [
        "3+ years shipping React Native apps to production.",
        "Strong TypeScript and native debugging skills.",
        "Experience with maps, geolocation or offline persistence.",
        "Availability for two office days per week in Recife.",
      ],
    },
    benefits: {
      pt: ["Plano de saúde e odontológico", "Vale-transporte", "Stock options", "Parceria com academia"],
      en: ["Health and dental", "Transport allowance", "Stock options", "Gym partnership"],
    },
    applicants: 39,
    featured: true,
  },
  {
    id: "ml-sabia",
    title: { pt: "Pessoa Engenheira de Machine Learning", en: "Machine Learning Engineer" },
    company: "Sabiá AI",
    companyTone: "violet",
    companyDescription: {
      pt: "IA aplicada para times de atendimento.",
      en: "Applied AI for customer-support teams.",
    },
    companySize: { pt: "120 pessoas", en: "120 people" },
    location: { pt: "São Paulo, SP", en: "São Paulo, SP" },
    region: "sao-paulo",
    workModel: "hybrid",
    seniority: "senior",
    salaryMin: 20000,
    salaryMax: 26000,
    skills: ["Python", "LLMs", "RAG", "PyTorch", "MLOps"],
    postedAt: daysAgo(4),
    sourceChannel: "IA Aplicada Brasil",
    sourceMembers: 35000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Coloque modelos de linguagem nas mãos de times de atendimento de 60 empresas brasileiras. O trabalho cobre qualidade de recuperação, avaliação, latência e a tubulação pouco glamourosa que mantém tudo honesto.",
      en: "Put language models into the hands of customer-support teams at 60 Brazilian companies. The work spans retrieval quality, evaluation, latency and the unglamorous plumbing that keeps them honest.",
    },
    responsibilities: {
      pt: [
        "Desenhar pipelines de recuperação e avaliação para assistentes em produção.",
        "Ser dona dos orçamentos de latência, custo e qualidade por cliente.",
        "Construir guardrails, tracing e harnesses de avaliação offline e online.",
        "Transformar falhas de clientes em experimentos e correções.",
      ],
      en: [
        "Design retrieval and evaluation pipelines for production assistants.",
        "Own model latency, cost and quality budgets per customer.",
        "Build guardrails, tracing and offline/online evaluation harnesses.",
        "Translate customer failures into experiments and fixes.",
      ],
    },
    requirements: {
      pt: [
        "4+ anos em engenharia de ML com responsabilidade sobre produção.",
        "Python forte e experiência prática com PyTorch.",
        "Conhecimento aplicado de RAG, embeddings e bancos vetoriais.",
        "Conforto com ambiguidade e contato direto com clientes.",
      ],
      en: [
        "4+ years in ML engineering with production ownership.",
        "Strong Python and hands-on PyTorch experience.",
        "Practical knowledge of RAG, embeddings and vector databases.",
        "Comfort with ambiguity and direct customer contact.",
      ],
    },
    benefits: {
      pt: ["Híbrido com 3 dias presenciais", "Plano de saúde", "Verba para conferências", "Equity"],
      en: ["Hybrid, 3 days on-site", "Health plan", "Conference budget", "Equity"],
    },
    applicants: 63,
    featured: true,
  },
  {
    id: "backend-go-kernel",
    title: { pt: "Pessoa Engenheira Backend (Go)", en: "Backend Engineer (Go)" },
    company: "Kernel Bank",
    companyTone: "navy",
    companyDescription: {
      pt: "Infraestrutura bancária para pagamentos e liquidação.",
      en: "Banking infrastructure for payments and settlement.",
    },
    companySize: { pt: "690 pessoas", en: "690 people" },
    location: { pt: "Remoto · Brasil", en: "Remote · Brazil" },
    region: "home-office",
    workModel: "remote",
    seniority: "especialista",
    salaryMin: 24000,
    salaryMax: 30000,
    skills: ["Go", "Kafka", "PostgreSQL", "Microsserviços", "AWS"],
    postedAt: daysAgo(4),
    sourceChannel: "Backend Brasil",
    sourceMembers: 52000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Projete o ledger e os serviços de liquidação de uma plataforma bancária que processa R$ 9 bilhões por mês. Correção é o produto; latência é a restrição.",
      en: "Design the ledger and settlement services behind a banking platform that processes R$ 9 billion a month. Correctness is the product; latency is the constraint.",
    },
    responsibilities: {
      pt: [
        "Ser dona dos serviços centrais de ledger, conciliação e liquidação.",
        "Desenhar fluxos orientados a eventos com semântica de exatamente uma vez.",
        "Liderar testes de carga e planejamento de capacidade para picos.",
        "Revisar a arquitetura de todo o grupo de pagamentos.",
      ],
      en: [
        "Own core ledger, reconciliation and settlement services.",
        "Design event-driven flows with exactly-once semantics.",
        "Lead load tests and capacity planning for peak periods.",
        "Review architecture across the payments group.",
      ],
    },
    requirements: {
      pt: [
        "7+ anos em backend, sendo 3+ com Go em produção.",
        "Experiência profunda com transações distribuídas e Kafka.",
        "SQL forte e bom julgamento de modelagem de dados.",
        "Capacidade de tornar explícitos os trade-offs de correção.",
      ],
      en: [
        "7+ years backend engineering, 3+ with Go in production.",
        "Deep experience with distributed transactions and Kafka.",
        "Strong SQL and data-modelling judgement.",
        "Ability to make correctness trade-offs explicit.",
      ],
    },
    benefits: {
      pt: ["Remoto-first", "Bônus anual", "Previdência privada", "Plano de saúde"],
      en: ["Remote-first", "Annual bonus", "Private pension", "Health plan"],
    },
    applicants: 22,
    featured: false,
  },
  {
    id: "qa-lumen",
    title: { pt: "Pessoa Engenheira de QA Automação", en: "QA Automation Engineer" },
    company: "Lumen Research",
    companyTone: "slate",
    companyDescription: {
      pt: "Software de pesquisa para universidades e instituições públicas.",
      en: "Research software for universities and public institutions.",
    },
    companySize: { pt: "180 pessoas", en: "180 people" },
    location: { pt: "Curitiba, PR", en: "Curitiba, PR" },
    region: "curitiba",
    workModel: "hybrid",
    seniority: "pleno",
    salaryMin: 9000,
    salaryMax: 13000,
    skills: ["Playwright", "TypeScript", "CI/CD", "Testes de API", "Cypress"],
    postedAt: daysAgo(5),
    sourceChannel: "QA Brasil",
    sourceMembers: 29000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Faça da qualidade uma propriedade do sistema, não uma fase no fim. Você será dona da suíte ponta a ponta de uma plataforma de pesquisa usada por universidades e instituições públicas.",
      en: "Make quality a property of the system, not a phase at the end. You will own the end-to-end suite for a research platform used by universities and public institutions.",
    },
    responsibilities: {
      pt: [
        "Desenhar e manter suítes Playwright para web e APIs.",
        "Embutir verificações de qualidade na CI com feedback rápido e útil.",
        "Liderar testes exploratórios em fluxos acadêmicos complexos.",
        "Acompanhar flakiness e manter a suíte confiável.",
      ],
      en: [
        "Design and maintain Playwright suites across web and API surfaces.",
        "Embed quality checks into CI with useful, fast feedback.",
        "Lead exploratory testing for complex academic workflows.",
        "Track flakiness and keep the suite trustworthy.",
      ],
    },
    requirements: {
      pt: [
        "3+ anos em automação de testes de produtos web.",
        "TypeScript forte e fundamentos de teste de API.",
        "Experiência com pipelines de CI e gestão de dados de teste.",
        "Relatos de bug claros e colaboração sem ego.",
      ],
      en: [
        "3+ years in test automation for web products.",
        "Strong TypeScript and API testing fundamentals.",
        "Experience with CI pipelines and test data management.",
        "Clear bug reports and a low-ego collaboration style.",
      ],
    },
    benefits: {
      pt: ["Híbrido com 2 dias presenciais", "Plano de saúde", "Auxílio educação", "Cartão-refeição"],
      en: ["Hybrid, 2 days on-site", "Health plan", "Education allowance", "Meal card"],
    },
    applicants: 44,
    featured: false,
  },
  {
    id: "sap-horizonte",
    title: { pt: "Pessoa Consultora SAP S/4HANA", en: "SAP S/4HANA Consultant" },
    company: "Horizonte Saúde",
    companyTone: "blue",
    companyDescription: {
      pt: "Rede hospitalar com 14 unidades em Minas Gerais.",
      en: "Hospital network with 14 units in Minas Gerais.",
    },
    companySize: { pt: "4.200 pessoas", en: "4,200 people" },
    location: { pt: "Belo Horizonte, MG", en: "Belo Horizonte, MG" },
    region: "belo-horizonte",
    workModel: "onsite",
    seniority: "senior",
    salaryMin: 16000,
    salaryMax: 22000,
    skills: ["SAP S/4HANA", "SAP MM", "ABAP", "ERP", "Integração"],
    postedAt: daysAgo(5),
    sourceChannel: "SAP Vagas Brasil",
    sourceMembers: 18000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Lidere a frente de gestão de materiais de um programa S/4HANA greenfield em 14 hospitais. O papel fica entre finanças, supply chain e o parceiro de implementação.",
      en: "Lead the materials-management stream of a greenfield S/4HANA programme across 14 hospitals. The role sits between finance, supply chain and the implementation partner.",
    },
    responsibilities: {
      pt: [
        "Ser dona do desenho de processos de compras, estoque e dados mestres de materiais.",
        "Traduzir a operação hospitalar em configuração SAP limpa.",
        "Coordenar cutover, testes e capacitação de usuários.",
        "Questionar customizações quando o processo padrão já resolve.",
      ],
      en: [
        "Own process design for procurement, inventory and materials master data.",
        "Translate hospital operations into clean SAP configuration.",
        "Coordinate cutover, testing and user enablement.",
        "Challenge customisation where standard process is sufficient.",
      ],
    },
    requirements: {
      pt: [
        "6+ anos de SAP MM com ao menos um programa S/4HANA completo.",
        "Conhecimento sólido de integração com FI e SD.",
        "Experiência em ambientes regulados ou de saúde é diferencial.",
        "Presença em Belo Horizonte três dias por semana.",
      ],
      en: [
        "6+ years SAP MM with at least one full S/4HANA programme.",
        "Strong integration knowledge across FI and SD.",
        "Experience in regulated or healthcare environments is a plus.",
        "On-site presence in Belo Horizonte three days a week.",
      ],
    },
    benefits: {
      pt: ["Plano de saúde", "Participação nos lucros", "Vale-transporte", "Apoio a certificações"],
      en: ["Health plan", "Profit sharing", "Transport", "Certification support"],
    },
    applicants: 18,
    featured: false,
  },
  {
    id: "seguranca-orbe",
    title: { pt: "Pessoa Engenheira de Segurança de Aplicações", en: "Application Security Engineer" },
    company: "Orbe Seguros",
    companyTone: "rose",
    companyDescription: {
      pt: "Seguradora digital para pessoas e pequenos negócios.",
      en: "Digital insurer for individuals and small businesses.",
    },
    companySize: { pt: "980 pessoas", en: "980 people" },
    location: { pt: "Remoto · Brasil", en: "Remote · Brazil" },
    region: "home-office",
    workModel: "remote",
    seniority: "senior",
    salaryMin: 18000,
    salaryMax: 24000,
    skills: ["AppSec", "OWASP", "Threat modeling", "AWS", "Python"],
    postedAt: daysAgo(6),
    sourceChannel: "Segurança Tech BR",
    sourceMembers: 27000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Ajude times de produto a entregar jornadas de seguro sem criar nova superfície de ataque. Você vai embutir threat modeling no discovery e tornar o padrão seguro o caminho mais fácil.",
      en: "Help product teams ship insurance journeys without shipping new attack surface. You will embed threat modelling into discovery and make secure defaults the easy path.",
    },
    responsibilities: {
      pt: [
        "Conduzir threat models para sistemas voltados a clientes e parceiros.",
        "Construir controles de autenticação e gestão de segredos no caminho pavimentado.",
        "Liderar revisão segura de código e triagem de vulnerabilidades.",
        "Ser dona de métricas de AppSec que lideranças técnicas consigam usar.",
      ],
      en: [
        "Run threat models for customer and partner-facing systems.",
        "Build paved-road controls for authentication and secrets handling.",
        "Lead secure code review and vulnerability triage.",
        "Own AppSec metrics that engineering leaders can act on.",
      ],
    },
    requirements: {
      pt: [
        "5+ anos em segurança de aplicações ou engenharia de segurança.",
        "Conhecimento prático de OWASP, IAM em cloud e risco de supply chain.",
        "Capacidade de escrever código e corrigir o que encontrar.",
        "Comunicação clara e não punitiva com times de produto.",
      ],
      en: [
        "5+ years in application security or security engineering.",
        "Hands-on knowledge of OWASP, cloud IAM and supply-chain risk.",
        "Ability to write code and fix what you find.",
        "Clear, non-punitive communication with product teams.",
      ],
    },
    benefits: {
      pt: ["Remoto-first", "Verba para certificações", "Plano de saúde", "Bônus anual"],
      en: ["Remote-first", "Security certification budget", "Health plan", "Annual bonus"],
    },
    applicants: 27,
    featured: false,
  },
  {
    id: "frontend-flux",
    title: { pt: "Pessoa Engenheira Frontend", en: "Frontend Engineer" },
    company: "Flux Commerce",
    companyTone: "amber",
    companyDescription: {
      pt: "Plataforma de comércio para lojistas independentes.",
      en: "Commerce platform for independent merchants.",
    },
    companySize: { pt: "350 pessoas", en: "350 people" },
    location: { pt: "Remoto · Brasil", en: "Remote · Brazil" },
    region: "home-office",
    workModel: "remote",
    seniority: "pleno",
    salaryMin: 10000,
    salaryMax: 14000,
    skills: ["React", "Next.js", "TypeScript", "Tailwind", "Testes"],
    postedAt: daysAgo(6),
    sourceChannel: "Frontend Brasil",
    sourceMembers: 47000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Construa o editor de lojas usado por 12 mil comerciantes independentes. Orçamentos de performance, qualidade do design system e experiências editáveis são o trabalho diário.",
      en: "Build the storefront builder used by 12,000 independent merchants. Performance budgets, design-system quality and editable experiences are the daily work.",
    },
    responsibilities: {
      pt: [
        "Entregar funcionalidades de editor e vitrine com um sistema de componentes compartilhado.",
        "Proteger os Core Web Vitals à medida que as páginas dos lojistas ficam mais ricas.",
        "Escrever testes onde eles reduzem risco real de regressão.",
        "Colaborar com design nos detalhes de interação e estados vazios.",
      ],
      en: [
        "Ship editor and storefront features with a shared component system.",
        "Protect Core Web Vitals as merchant pages become richer.",
        "Write tests where they reduce real regression risk.",
        "Collaborate with design on interaction details and empty states.",
      ],
    },
    requirements: {
      pt: [
        "3+ anos com React e TypeScript em produção.",
        "Fundamentos fortes de CSS e consciência de acessibilidade.",
        "Experiência com renderização no servidor e profiling de performance.",
        "Inglês para documentação e revisões assíncronas.",
      ],
      en: [
        "3+ years with React and TypeScript in production.",
        "Strong CSS fundamentals and accessibility awareness.",
        "Experience with server rendering and performance profiling.",
        "English for documentation and async reviews.",
      ],
    },
    benefits: {
      pt: ["Remoto-first", "Auxílio home office", "Plano de saúde", "Verba de aprendizado"],
      en: ["Remote-first", "Home-office allowance", "Health plan", "Learning stipend"],
    },
    applicants: 88,
    featured: true,
  },
  {
    id: "engenharia-nexa",
    title: { pt: "Pessoa Gerente de Engenharia, Pagamentos", en: "Engineering Manager, Payments" },
    company: "Nexa Payments",
    companyTone: "navy",
    companyDescription: {
      pt: "Infraestrutura de pagamentos para adquirentes e bancos.",
      en: "Payments infrastructure for acquirers and banks.",
    },
    companySize: { pt: "760 pessoas", en: "760 people" },
    location: { pt: "São Paulo, SP", en: "São Paulo, SP" },
    region: "sao-paulo",
    workModel: "hybrid",
    seniority: "especialista",
    salaryMin: 26000,
    salaryMax: 34000,
    skills: ["Liderança", "Pagamentos", "Arquitetura", "Contratação", "Agile"],
    postedAt: daysAgo(7),
    sourceChannel: "Liderança Tech BR",
    sourceMembers: 16000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Lidere dois squads responsáveis por emissão de cartões e liquidação. Você vai desenvolver as pessoas gestoras, manter a régua técnica alta e tornar a entrega previsível sem transformar tudo em teatro de processo.",
      en: "Lead two squads responsible for card issuing and settlement. You will grow the managers, keep the technical bar high and make delivery predictable without turning it into process theatre.",
    },
    responsibilities: {
      pt: [
        "Desenvolver um grupo de 14 pessoas engenheiras em dois squads.",
        "Ser dona do planejamento trimestral e das dependências entre times.",
        "Trabalhar com produto no roadmap e nos trade-offs de risco.",
        "Elevar o padrão de engenharia por revisões e contratação.",
      ],
      en: [
        "Grow a group of 14 engineers across two squads.",
        "Own quarterly planning and cross-team dependencies.",
        "Partner with product on roadmap and risk trade-offs.",
        "Raise engineering standards through reviews and hiring.",
      ],
    },
    requirements: {
      pt: [
        "5+ anos liderando engenharia, incluindo gestores como reportes.",
        "Histórico em pagamentos, fintech ou outros sistemas regulados.",
        "Profundidade técnica suficiente para desafiar decisões de arquitetura.",
        "Uma abordagem clara e humana para gestão de performance.",
      ],
      en: [
        "5+ years engineering leadership, including managers as reports.",
        "Background in payments, fintech or other regulated systems.",
        "Enough technical depth to challenge architecture decisions.",
        "A clear, humane approach to performance management.",
      ],
    },
    benefits: {
      pt: ["Híbrido com 2 dias presenciais", "Plano de saúde executivo", "Stock options", "Bônus anual"],
      en: ["Hybrid, 2 days on-site", "Executive health plan", "Stock options", "Annual bonus"],
    },
    applicants: 12,
    featured: false,
  },
  {
    id: "dados-prisma",
    title: { pt: "Pessoa Analista de Dados", en: "Data Analyst" },
    company: "Prisma Cloud",
    companyTone: "blue",
    companyDescription: {
      pt: "Gestão de custos de cloud para times de engenharia.",
      en: "Cloud cost management for engineering teams.",
    },
    companySize: { pt: "240 pessoas", en: "240 people" },
    location: { pt: "Rio de Janeiro, RJ", en: "Rio de Janeiro, RJ" },
    region: "rio-de-janeiro",
    workModel: "hybrid",
    seniority: "junior",
    salaryMin: 6000,
    salaryMax: 8000,
    skills: ["SQL", "Python", "Looker", "Estatística", "Modelagem de dados"],
    postedAt: daysAgo(7),
    sourceChannel: "Dados Brasil",
    sourceMembers: 33000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Transforme dados de produto e faturamento em decisões para uma plataforma de gestão de custos de cloud. Você vai trabalhar com uma pessoa analista sênior e ser dona dos relatórios recorrentes do time de sucesso do cliente.",
      en: "Turn product and billing data into decisions for a cloud-cost platform. You will work with a senior analyst and own recurring reporting for the customer success group.",
    },
    responsibilities: {
      pt: [
        "Construir e manter modelos SQL e dashboards no Looker.",
        "Investigar padrões de churn, ativação e expansão.",
        "Automatizar relatórios recorrentes com Python quando fizer sentido.",
        "Documentar definições para que as métricas signifiquem a mesma coisa em todo lugar.",
      ],
      en: [
        "Build and maintain SQL models and Looker dashboards.",
        "Investigate churn, activation and expansion patterns.",
        "Automate recurring reports with Python where useful.",
        "Document definitions so metrics mean the same thing everywhere.",
      ],
    },
    requirements: {
      pt: [
        "1–3 anos em análise de dados ou estágio quantitativo.",
        "SQL forte e Python básico.",
        "Alfabetização estatística e ceticismo saudável sobre médias.",
        "Explicações escritas claras para leitores não técnicos.",
      ],
      en: [
        "1–3 years in analytics or a quantitative internship.",
        "Strong SQL and basic Python.",
        "Statistical literacy and healthy scepticism about averages.",
        "Clear written explanations for non-technical readers.",
      ],
    },
    benefits: {
      pt: ["Híbrido com 3 dias presenciais", "Plano de saúde", "Auxílio-refeição", "Aulas de inglês"],
      en: ["Hybrid, 3 days on-site", "Health plan", "Meal allowance", "English classes"],
    },
    applicants: 120,
    featured: false,
  },
  {
    id: "devops-trilha",
    title: { pt: "Pessoa Engenheira DevOps", en: "DevOps Engineer" },
    company: "Trilha Educação",
    companyTone: "violet",
    companyDescription: {
      pt: "Educação pública e ferramentas de aprendizagem.",
      en: "Public education and learning tools.",
    },
    companySize: { pt: "610 pessoas", en: "610 people" },
    location: { pt: "Remoto · Brasil", en: "Remote · Brazil" },
    region: "home-office",
    workModel: "remote",
    seniority: "pleno",
    salaryMin: 13000,
    salaryMax: 17000,
    skills: ["AWS", "Terraform", "Docker", "CI/CD", "Linux"],
    postedAt: daysAgo(8),
    sourceChannel: "DevOps Brasil",
    sourceMembers: 44000,
    sourceNote: SOURCE_NOTE,
    summary: {
      pt: "Mantenha uma plataforma de aprendizagem no ar durante a temporada de provas, quando 700 mil estudantes entram ao mesmo tempo. Você será dona da infraestrutura, da entrega e do modelo de custo por trás das duas.",
      en: "Keep a learning platform available during exam season, when 700,000 students log in at once. You will own infrastructure, delivery and the cost model behind both.",
    },
    responsibilities: {
      pt: [
        "Gerenciar infraestrutura AWS com Terraform e módulos reutilizáveis.",
        "Melhorar a segurança de deploy e a velocidade de rollback.",
        "Instrumentar custo e capacidade antes dos picos sazonais.",
        "Compartilhar on-call com outras três pessoas engenheiras.",
      ],
      en: [
        "Manage AWS infrastructure with Terraform and reusable modules.",
        "Improve deployment safety and rollback speed.",
        "Instrument cost and capacity ahead of seasonal peaks.",
        "Share on-call with three other engineers.",
      ],
    },
    requirements: {
      pt: [
        "3+ anos operando cargas AWS em produção.",
        "Fundamentos sólidos de Linux, Docker e CI/CD.",
        "Experiência com Terraform além de módulos copiados.",
        "Conforto com uma escala compartilhada de on-call.",
      ],
      en: [
        "3+ years operating AWS workloads in production.",
        "Solid Linux, Docker and CI/CD fundamentals.",
        "Terraform experience beyond copy-pasted modules.",
        "Comfort with a shared on-call rotation.",
      ],
    },
    benefits: {
      pt: ["100% remoto", "Adicional de on-call", "Auxílio educação", "Plano de saúde"],
      en: ["Remote", "On-call pay", "Education benefit", "Health plan"],
    },
    applicants: 58,
    featured: false,
  },
];

export const JOB_BY_ID = new Map(JOBS.map((job) => [job.id, job]));

export function getJob(id: string) {
  return JOB_BY_ID.get(id);
}

export function featuredJobs(limit = 6) {
  return JOBS.filter((job) => job.featured).slice(0, limit);
}

export function relatedJobs(job: Job, limit = 3) {
  return JOBS.filter(
    (candidate) =>
      candidate.id !== job.id &&
      (candidate.company === job.company ||
        candidate.skills.some((skill) => job.skills.includes(skill)) ||
        candidate.region === job.region),
  )
    .sort((a, b) => {
      const score = (candidate: Job) =>
        Number(candidate.company === job.company) * 2 +
        candidate.skills.filter((skill) => job.skills.includes(skill)).length;
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export function jobPostedLabel(job: Job, locale: "pt" | "en" = "pt") {
  const days = Math.max(
    0,
    Math.round((DEMO_NOW.getTime() - new Date(job.postedAt).getTime()) / (24 * 60 * 60 * 1000)),
  );
  const pt = locale === "pt";
  if (days === 0) return pt ? "Hoje" : "Today";
  if (days === 1) return pt ? "Ontem" : "Yesterday";
  if (days < 7) return pt ? `Há ${days} dias` : `${days} days ago`;
  if (days < 14) return pt ? "Semana passada" : "Last week";
  const weeks = Math.floor(days / 7);
  return pt ? `Há ${weeks} semanas` : `${weeks} weeks ago`;
}

export function isFreshJob(job: Job) {
  return jobPostedLabel(job) === "Hoje" || jobPostedLabel(job) === "Ontem";
}
