"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Loader2, Send, ShieldCheck, Sparkles } from "lucide-react";
import type { Job } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getProfile } from "@/lib/mock-api";
import { recordApplication } from "@/lib/jobs";
import { DEMO_NOW } from "@/lib/months";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";

export function ApplyDialog({ job, className }: { job: Job; className?: string }) {
  const { locale } = useLocale();
  const copy = siteCopy(locale);
  const [open, setOpen] = React.useState(false);
  const [stage, setStage] = React.useState<"compose" | "sending" | "done">("compose");
  const [copied, setCopied] = React.useState(false);
  const [profile, setProfile] = React.useState(() => getProfile());

  const message = React.useMemo(() => {
    const name = profile.name;
    const role = job.title[locale];
    const channel = job.sourceChannel;
    if (locale === "pt") {
      return `Olá! Vi a vaga de ${role} na ${channel} pelo ONIAS.\n\nSou ${name}, ${profile.title} com ${profile.experienceYears} anos de experiência. Meu perfil: ${profile.linkedin}\n\nTenho interesse e fico à disposição para conversar.`;
    }
    return `Hi! I found the ${role} role in ${channel} through ONIAS.\n\nI'm ${name}, a ${profile.title} with ${profile.experienceYears} years of experience. My profile: ${profile.linkedin}\n\nI'm interested and happy to talk.`;
  }, [job, locale, profile]);

  const reset = () => {
    setStage("compose");
    setCopied(false);
  };

  const submit = () => {
    setStage("sending");
    window.setTimeout(() => {
      recordApplication({
        jobId: job.id,
        title: job.title[locale],
        company: job.company,
        sourceChannel: job.sourceChannel,
        date: DEMO_NOW.toISOString(),
      });
      setStage("done");
    }, 750);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) window.setTimeout(reset, 200);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="navy" size="lg" className={className}>
          {copy.common.applyTelegram} <ArrowRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {stage === "done" ? (
          <div className="py-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
              <Check className="size-6" />
            </div>
            <DialogTitle className="mt-4 text-[20px] tracking-[-0.02em]">
              {locale === "pt" ? "Candidatura registrada neste navegador" : "Application recorded in this browser"}
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-sm text-[12.5px] leading-6">
              {locale === "pt" ? (
                <>
                  Nada foi enviado. A candidatura simulada para{" "}
                  <span className="font-semibold text-foreground">{job.title.pt}</span> na {job.company} fica salva apenas no
                  seu navegador, para testar o fluxo.
                </>
              ) : (
                <>
                  Nothing was sent. This simulated application for{" "}
                  <span className="font-semibold text-foreground">{job.title.en}</span> at {job.company} is stored only in your
                  browser so the flow can be tested.
                </>
              )}
            </DialogDescription>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button variant="navy" onClick={() => setOpen(false)}>
                {locale === "pt" ? "Voltar à vaga" : "Back to the role"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/perfil">{locale === "pt" ? "Ver meu perfil" : "View my profile"}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {locale === "pt" ? "Candidatar-se pelo Telegram" : "Apply through Telegram"}
              </DialogTitle>
              <DialogDescription>
                {job.company} · {job.title[locale]}.{" "}
                {locale === "pt"
                  ? "A ONIAS monta a mensagem; você escolhe se quer enviar."
                  : "ONIAS composes the message; you decide whether to send it."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-lg border border-border bg-canvas px-3.5 py-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-[#2AABEE]/12 text-[#1D8FC7]">
                  <Send className="size-3.5" />
                </span>
                <div className="min-w-0 text-[11px] leading-5">
                  <p className="font-semibold text-foreground">
                    {locale === "pt" ? "Fonte original" : "Original source"}: {job.sourceChannel}
                  </p>
                  <p className="text-muted-foreground">
                    {locale === "pt"
                      ? "Grupo público · mensagem normalizada pela ONIAS."
                      : "Public group · message normalised by ONIAS."}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {locale === "pt" ? "Mensagem pronta" : "Prepared message"}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(message);
                        setCopied(true);
                        toast.success(locale === "pt" ? "Mensagem copiada" : "Message copied");
                        window.setTimeout(() => setCopied(false), 1600);
                      } catch {
                        toast.error(locale === "pt" ? "Não foi possível copiar" : "Could not copy");
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-primary hover:underline"
                  >
                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                    {copied ? copy.common.linkCopied : locale === "pt" ? "Copiar" : "Copy"}
                  </button>
                </div>
                <div className="max-h-[188px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/40 p-3 font-mono text-[10.5px] leading-5 text-foreground">
                  {message}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-[10.5px] leading-5 text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
                <span>
                  {locale === "pt"
                    ? "Demonstração: nenhuma mensagem, e-mail ou currículo é transmitido. A candidatura grava um registro local para que o fluxo possa ser testado."
                    : "Demo only: no message, email or résumé is transmitted. The application writes a local record so the flow can be tested."}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-[10.5px] text-muted-foreground">
                <Sparkles className="size-3.5 shrink-0 text-primary" />
                {locale === "pt"
                  ? `Seu perfil (${profile.name}) seria compartilhado apenas com esta empresa.`
                  : `Your profile (${profile.name}) would be shared only with this company.`}
              </div>
            </div>

            <DialogFooter className="pt-1">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {locale === "pt" ? "Cancelar" : "Cancel"}
              </Button>
              <Button type="button" variant="navy" onClick={submit} disabled={stage === "sending"}>
                {stage === "sending" ? <Loader2 className="animate-spin" /> : <Send />}
                {stage === "sending"
                  ? locale === "pt"
                    ? "Registrando…"
                    : "Recording…"
                  : locale === "pt"
                    ? "Registrar candidatura (demo)"
                    : "Record application (demo)"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
