import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { siteCopy } from "@/lib/site-copy";
import type { Locale } from "@/lib/locale";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = siteCopy(locale);

  const columns = [
    {
      title: copy.footer.explore,
      links: [
        { href: "/vagas", label: copy.footer.allJobs },
        { href: "/estatisticas/telegram", label: copy.footer.telegramStats },
        { href: "/estatisticas/oferta-demanda", label: copy.footer.demandStats },
        { href: "/estatisticas/curiosidades", label: copy.footer.curiosities },
      ],
    },
    {
      title: copy.footer.candidate,
      links: [
        { href: "/perfil", label: copy.footer.myProfile },
        { href: "/perfil/criar", label: copy.footer.createProfile },
        { href: "/curriculo", label: copy.footer.myResume },
        { href: "/quem-me-viu", label: copy.footer.whoViewed },
        { href: "/vagas?salvas=1", label: copy.footer.savedJobs },
      ],
    },
    {
      title: copy.footer.about,
      links: [
        { href: "/#como-funciona", label: copy.footer.howItWorks },
        { href: "/estatisticas/telegram#fontes", label: copy.footer.sources },
        { href: "/quem-me-viu#privacidade", label: copy.footer.privacy },
        { href: "/curriculo", label: locale === "pt" ? "Versão para impressão" : "Print version" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card" id="sobre">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <div>
                <p className="text-[14px] font-semibold tracking-[0.16em]">ONIAS</p>
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {copy.nav.telegram}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[12.5px] leading-6 text-muted-foreground">{copy.footer.description}</p>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              {copy.demoClockLabel}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{column.title}</p>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer.rights}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>{copy.footer.fictional}</span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Github className="size-3.5" /> {copy.footer.built}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
