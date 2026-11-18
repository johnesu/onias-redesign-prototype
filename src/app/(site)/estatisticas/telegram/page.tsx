import type { Metadata } from "next";
import { TelegramStatsView } from "@/components/site/telegram-stats-view";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "pt" ? "Vagas no Telegram" : "Telegram jobs",
    description:
      locale === "pt"
        ? "Volume, fontes, regiões e evolução das vagas públicas monitoradas no Telegram. Snapshot fictício de novembro de 2026."
        : "Volume, sources, regions and evolution of the public roles tracked on Telegram. Fictional November 2026 snapshot.",
  };
}

export default function TelegramStatsPage() {
  return <TelegramStatsView />;
}
