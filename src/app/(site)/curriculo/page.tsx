import type { Metadata } from "next";
import { ResumeView } from "@/components/profile/resume-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Currículo" : "Résumé",
    description:
      locale === "pt"
        ? "Prévia de currículo pronta para impressão, gerada a partir do perfil. Nenhum arquivo é enviado ou armazenado."
        : "Print-ready résumé preview generated from your profile. No file is uploaded or stored.",
  };
}

export default function ResumePage() {
  return <ResumeView />;
}
