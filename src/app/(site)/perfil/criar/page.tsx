import type { Metadata } from "next";
import { CreateProfileView } from "@/components/profile/create-profile-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Criar perfil" : "Create profile",
    description:
      locale === "pt"
        ? "Crie seu perfil de candidato em três passos. Tudo fica salvo apenas no localStorage deste navegador."
        : "Create your candidate profile in three steps. Everything stays in this browser's localStorage only.",
  };
}

export default function CreateProfilePage() {
  return <CreateProfileView />;
}
