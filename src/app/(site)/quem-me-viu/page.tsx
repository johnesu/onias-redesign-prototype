import type { Metadata } from "next";
import { WhoViewedView } from "@/components/profile/who-viewed-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Quem me viu" : "Who viewed me",
    description:
      locale === "pt"
        ? "Empresas e consultorias que consultaram seu perfil, com um portão de e-mail simulado. Domínios e métricas fictícios."
        : "Companies and consultancies that opened your profile, behind a simulated email gate. Fictional domains and metrics.",
  };
}

export default function WhoViewedPage() {
  return <WhoViewedView />;
}
