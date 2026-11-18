import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Meu perfil" : "My profile",
    description:
      locale === "pt"
        ? "Como recrutadores veem seu perfil na ONIAS: resumo, experiências, habilidades, idiomas, salário e privacidade. Perfil fictício de demonstração."
        : "How recruiters see your ONIAS profile: summary, experience, skills, languages, salary and privacy. Fictional demonstration profile.",
  };
}

export default function ProfilePage() {
  return <ProfileView />;
}
