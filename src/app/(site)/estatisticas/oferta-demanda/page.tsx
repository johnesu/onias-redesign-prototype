import type { Metadata } from "next";
import { SupplyDemandView } from "@/components/site/supply-demand-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Oferta × demanda" : "Supply × demand",
    description:
      locale === "pt"
        ? "Demanda, oferta de candidatos, salários e lacunas por habilidade no mercado brasileiro de tecnologia."
        : "Demand, candidate supply, salaries and gaps by skill in the Brazilian tech market.",
  };
}

export default function SupplyDemandPage() {
  return <SupplyDemandView />;
}
