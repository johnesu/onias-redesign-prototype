"use client";

import * as React from "react";
import { Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";

export function CopyLinkButton({ className }: { className?: string }) {
  const { locale } = useLocale();
  const copy = siteCopy(locale);
  const [copied, setCopied] = React.useState(false);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      className={className}
      aria-label={copy.common.copyLink}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          toast.success(copy.common.linkCopied, {
            description:
              locale === "pt" ? "Compartilhe esta vaga fictícia com qualquer pessoa." : "Share this fictional role with anyone.",
          });
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          toast.error(locale === "pt" ? "Não foi possível copiar" : "Could not copy the link", {
            description:
              locale === "pt" ? "O navegador bloqueou o acesso à área de transferência." : "Your browser blocked clipboard access.",
          });
        }
      }}
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
    </Button>
  );
}
