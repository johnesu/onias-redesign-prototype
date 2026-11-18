import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LocaleProvider } from "@/components/i18n/locale-provider";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const pt = locale === "pt";
  return {
    title: {
      default: pt ? "ONIAS — Vagas no Telegram" : "ONIAS — Telegram jobs",
      template: "%s | ONIAS",
    },
    description: pt
      ? "Projeto de redesenho independente da ONIAS: vagas públicas no Telegram, estatísticas de mercado e um perfil de candidato. Dados fictícios de demonstração."
      : "An independent redesign study of ONIAS: public Telegram jobs, market statistics and a candidate profile. Fictional demonstration data.",
    applicationName: "ONIAS Redesign Study",
    authors: [{ name: "Independent redesign study" }],
    keywords: pt
      ? ["ONIAS", "vagas no Telegram", "vagas de tecnologia", "estatísticas de mercado", "redesenho"]
      : ["ONIAS", "Telegram jobs", "tech jobs Brazil", "market statistics", "redesign study"],
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#081120" },
  ],
};

const themeScript = `(function(){try{var key='onias.demo.v1.theme';var stored=localStorage.getItem(key)||'system';var dark=stored==='dark'||(stored==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale === "pt" ? "pt-BR" : "en"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
