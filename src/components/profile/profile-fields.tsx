"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { REGIONS, regionName } from "@/lib/months";
import type { Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/** Multi-select region grid shared by the profile editor and the create wizard. */
export function RegionPicker({
  selected,
  onChange,
  locale,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  locale: Locale;
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {REGIONS.map((region) => {
        const isSelected = selected.includes(region.slug);
        return (
          <button
            key={region.slug}
            type="button"
            aria-pressed={isSelected}
            onClick={() =>
              onChange(
                isSelected ? selected.filter((slug) => slug !== region.slug) : [...selected, region.slug],
              )
            }
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11.5px] font-medium transition-colors",
              isSelected ? "border-primary/40 bg-accent text-accent-foreground" : "border-border hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "flex size-3.5 items-center justify-center rounded border",
                isSelected ? "border-primary bg-primary text-white" : "border-input",
              )}
            >
              {isSelected && <Check className="size-2.5" />}
            </span>
            {regionName(region.slug, locale)}
          </button>
        );
      })}
    </div>
  );
}

export function SwitchRow({
  label,
  description,
  control,
}: {
  label: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
      <div>
        <p className="text-[11.5px] font-semibold">{label}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  );
}
