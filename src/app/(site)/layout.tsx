import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: {
      default: locale === "pt" ? "ONIAS — Vagas no Telegram" : "ONIAS — Telegram jobs",
      template: "%s | ONIAS",
    },
    description:
      locale === "pt"
        ? "Vagas públicas no Telegram, estatísticas de mercado e um perfil de candidato. Um estudo de redesenho com dados fictícios."
        : "Public Telegram jobs, market statistics and a candidate profile. A redesign study with fictional data.",
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}
