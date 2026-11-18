"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Eye,
  Menu,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useLocale } from "@/components/i18n/locale-provider";
import { useTheme } from "@/components/theme/theme-provider";
import { siteCopy } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const copy = siteCopy(locale);
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const statsLinks = [
    { href: "/estatisticas/telegram", label: copy.nav.telegram, hint: locale === "pt" ? "Volume, fontes e regiões" : "Volume, sources and regions" },
    { href: "/estatisticas/oferta-demanda", label: copy.nav.demand, hint: locale === "pt" ? "Habilidades e lacunas" : "Skills and gaps" },
    { href: "/estatisticas/curiosidades", label: copy.nav.curiosities, hint: locale === "pt" ? "Padrões do mercado" : "Patterns in the market" },
  ];

  const primary = [
    { href: "/vagas", label: copy.nav.jobs, active: pathname.startsWith("/vagas") },
    {
      href: "/perfil",
      label: copy.nav.profile,
      active: pathname === "/perfil" || pathname.startsWith("/perfil/editar") || pathname.startsWith("/curriculo"),
    },
    { href: "/perfil/criar", label: copy.nav.createProfile, active: pathname.startsWith("/perfil/criar") },
    { href: "/quem-me-viu", label: copy.nav.whoViewed, active: pathname.startsWith("/quem-me-viu") },
  ];

  const statsActive = pathname.startsWith("/estatisticas");

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center gap-5 px-5 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="ONIAS">
          <Logo tone="dark" tagline={copy.nav.telegram} />
        </Link>

        <nav className="ml-3 hidden items-center gap-0.5 lg:flex" aria-label={locale === "pt" ? "Navegação principal" : "Primary navigation"}>
          {primary.slice(0, 1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                item.active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  statsActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                {copy.nav.stats}
                <ChevronDown className="size-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[286px]">
              {statsLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="items-start py-2.5">
                    <BarChart3 className="mt-0.5 size-4" />
                    <span className="flex flex-col gap-0.5">
                      <span>{link.label}</span>
                      <span className="text-[10.5px] font-normal text-muted-foreground">{link.hint}</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {primary.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                item.href === "/perfil/criar"
                  ? item.active
                    ? "bg-primary/10 text-primary"
                    : "text-primary hover:bg-primary/5"
                  : item.active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <LanguageToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={copy.nav.theme}>
                {theme === "dark" ? <Moon className="size-[17px]" /> : <Sun className="size-[17px]" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setTheme("light")}>
                <Sun /> {copy.nav.themeLight} {theme === "light" && <Check className="ml-auto size-3.5 !text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTheme("dark")}>
                <Moon /> {copy.nav.themeDark} {theme === "dark" && <Check className="ml-auto size-3.5 !text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTheme("system")}>
                <Sun className="opacity-0" /> {copy.nav.themeSystem}{" "}
                {theme === "system" && <Check className="ml-auto size-3.5 !text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="navy" size="sm" className="ml-1 hidden sm:inline-flex">
            <Link href="/vagas">
              {copy.nav.browse} <ArrowRight />
            </Link>
          </Button>

          <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label={copy.nav.menu} onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[88%] max-w-[360px]">
          <SheetHeader>
            <SheetTitle>{copy.nav.menuTitle}</SheetTitle>
          </SheetHeader>
          <SheetBody className="space-y-5">
            <div className="space-y-1">
              {primary.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium text-foreground hover:bg-muted"
                >
                  {item.label}
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>

            <div>
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {copy.nav.stats}
              </p>
              <div className="space-y-1">
                {statsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between px-3">
                <span className="text-[12px] font-medium text-muted-foreground">{copy.nav.language}</span>
                <LanguageToggle />
              </div>
              <div className="flex items-center justify-between px-3">
                <span className="text-[12px] font-medium text-muted-foreground">{copy.nav.theme}</span>
                <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
                  {(["light", "dark"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      aria-pressed={theme === value}
                      className={cn(
                        "rounded-[6px] px-2 py-1 text-[10.5px] font-semibold transition-colors",
                        theme === value ? "bg-navy text-white dark:bg-white dark:text-navy" : "text-muted-foreground",
                      )}
                    >
                      {value === "light" ? copy.nav.themeLight : copy.nav.themeDark}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Button asChild variant="navy" className="w-full">
                <Link href="/vagas" onClick={() => setOpen(false)}>
                  {copy.nav.browse} <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/perfil/criar" onClick={() => setOpen(false)}>
                  <UserRound /> {copy.nav.createProfile}
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { href: "/perfil", label: copy.nav.profile, icon: UserRound },
                { href: "/curriculo", label: copy.nav.resume, icon: ArrowUpRight },
                { href: "/quem-me-viu", label: copy.nav.whoViewed, icon: Eye },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-3 text-center text-[10.5px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <p className="px-3 text-[10.5px] leading-5 text-muted-foreground">{copy.common.demoNote}</p>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </header>
  );
}
