"use client";

import * as React from "react";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label={locale === "pt" ? "Idioma da interface" : "Interface language"}
      className={cn("inline-flex items-center rounded-lg border border-border bg-card p-0.5", className)}
    >
      {(["pt", "en"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className={cn(
            "min-w-[30px] rounded-[6px] px-1.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors",
            locale === value
              ? "bg-navy text-white shadow-sm dark:bg-white dark:text-navy"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
