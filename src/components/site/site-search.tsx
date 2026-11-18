"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { REGIONS, regionName } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";

const POPULAR_PT = ["Python", "React", "Dados", "Product design", "AWS"];
const POPULAR_EN = ["Python", "React", "Data", "Product design", "AWS"];

export function SiteSearch({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale } = useLocale();
  const copy = siteCopy(locale);
  const popular = locale === "pt" ? POPULAR_PT : POPULAR_EN;

  return (
    <div className="w-full max-w-xl">
      <form
        action="/vagas"
        method="get"
        className="group rounded-xl bg-card p-1.5 shadow-lift ring-1 ring-black/5"
      >
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2.5">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <span className="sr-only">{copy.common.searchRole}</span>
            <input
              name="q"
              type="search"
              placeholder={copy.common.searchRole}
              className="w-full min-w-0 border-0 bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
          <label className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 sm:w-[168px]">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="sr-only">{copy.common.region}</span>
            <select
              name="regiao"
              defaultValue="all"
              className="w-full cursor-pointer appearance-none border-0 bg-transparent text-[12.5px] font-medium text-foreground outline-none"
            >
              <option value="all">{copy.common.allRegions}</option>
              {REGIONS.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {regionName(region.slug, locale)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/92 sm:h-9"
          >
            {copy.common.search} <ArrowRight className="size-3.5" />
          </button>
        </div>
      </form>
      <div
        className={
          tone === "dark"
            ? "mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-white/45"
            : "mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground"
        }
      >
        <span className="pr-1">{locale === "pt" ? "Buscas populares:" : "Popular:"}</span>
        {popular.map((term) => (
          <Link
            key={term}
            href={`/vagas?q=${encodeURIComponent(term)}`}
            className={
              tone === "dark"
                ? "rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
                : "rounded-full border border-border bg-card px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            }
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
}
