"use client";

import * as React from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { getSavedJobIds, toggleSavedJob } from "@/lib/jobs";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

export function SaveJobButton({
  id,
  title,
  className,
  withLabel = false,
}: {
  id: string;
  title: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { locale } = useLocale();
  const copy = siteCopy(locale);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    const sync = () => setSaved(getSavedJobIds().includes(id));
    sync();
    window.addEventListener("onias:saved-jobs", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("onias:saved-jobs", sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={
        saved
          ? locale === "pt"
            ? `Remover ${title} das vagas salvas`
            : `Remove ${title} from saved jobs`
          : locale === "pt"
            ? `Salvar ${title}`
            : `Save ${title}`
      }
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const next = toggleSavedJob(id);
        const nowSaved = next.includes(id);
        setSaved(nowSaved);
        toast.success(
          nowSaved
            ? locale === "pt"
              ? "Vaga salva"
              : "Job saved"
            : locale === "pt"
              ? "Removida das vagas salvas"
              : "Removed from saved jobs",
          { description: nowSaved ? title : undefined },
        );
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-input hover:text-foreground",
        withLabel ? "h-9 px-3 text-[12px] font-medium" : "size-9",
        saved && "border-primary/25 bg-accent text-primary",
        className,
      )}
    >
      {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      {withLabel && <span>{saved ? copy.common.saved : copy.common.save}</span>}
    </button>
  );
}
