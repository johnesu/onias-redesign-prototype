import Link from "next/link";
import { Compass, Search } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/locale-server";

export default async function NotFound() {
  const locale = await getLocale();
  const pt = locale === "pt";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex justify-center rounded-2xl bg-navy px-5 py-4">
          <Logo tagline="Vagas no Telegram" />
        </div>
        <span className="eyebrow">{pt ? "Erro 404" : "Error 404"}</span>
        <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.035em]">
          {pt ? "Esta página não faz parte do protótipo" : "This page is not part of the prototype"}
        </h1>
        <p className="mt-3 max-w-md text-[14px] leading-6 text-muted-foreground">
          {pt
            ? "O endereço que você abriu não existe neste estudo de redesenho independente. Tudo aqui roda com dados fictícios de demonstração."
            : "The address you followed does not exist in this independent redesign study. Everything here runs on fictional demonstration data."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild variant="navy">
            <Link href="/vagas">
              <Search /> {pt ? "Ver vagas" : "Browse jobs"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/estatisticas/telegram">
              <Compass /> {pt ? "Explorar estatísticas" : "Explore statistics"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
