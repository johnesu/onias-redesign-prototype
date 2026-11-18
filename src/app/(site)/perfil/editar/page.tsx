import type { Metadata } from "next";
import { ProfileEditView } from "@/components/profile/profile-edit-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Editar perfil" : "Edit profile",
    description:
      locale === "pt"
        ? "Edite os campos do seu perfil de candidato. As alterações ficam apenas no localStorage deste navegador."
        : "Edit your candidate profile fields. Changes stay in this browser's localStorage only.",
  };
}

export default function ProfileEditPage() {
  return <ProfileEditView />;
}
