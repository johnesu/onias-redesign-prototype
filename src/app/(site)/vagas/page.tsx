import type { Metadata } from "next";
import { JobsView, type JobsInitialState } from "@/components/site/jobs-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Vagas no Telegram" : "Telegram jobs",
    description:
      locale === "pt"
        ? "Vagas de tecnologia do mercado brasileiro, com descrições completas em português e inglês. Filtre por região, senioridade e modelo de trabalho."
        : "Brazilian tech roles with full descriptions in Portuguese and English. Filter by region, seniority and work model.",
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const initial: JobsInitialState = {
    q: first(params.q),
    regiao: first(params.regiao),
    senioridade: first(params.senioridade),
    modelo: first(params.modelo),
    salvas: first(params.salvas),
    ordenar: first(params.ordenar),
  };

  return <JobsView initial={initial} />;
}
