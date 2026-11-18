"use client";

import Link from "next/link";
import { ArrowUpRight, Banknote, MapPin, Radio } from "lucide-react";
import type { Job } from "@/types";
import { Badge } from "@/components/ui/badge";
import { JobLogo } from "@/components/site/job-logo";
import { SaveJobButton } from "@/components/site/save-job-button";
import { jobSalaryShort, jobSkillLabel } from "@/lib/jobs";
import { jobPostedLabel, isFreshJob } from "@/data/mock-jobs";
export const isFresh = isFreshJob;
import { seniorityLabel, workModelLabel } from "@/lib/months";
import { formatCompact } from "@/lib/format";
import { useLocale } from "@/components/i18n/locale-provider";
import { siteCopy } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

export function JobCard({ job, dense = false }: { job: Job; dense?: boolean }) {
  const { locale } = useLocale();
  const copy = siteCopy(locale);

  return (
    <article
      className={cn(
        "group relative flex min-w-0 flex-col rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-px hover:border-input hover:shadow-lift",
        dense ? "p-4" : "p-4 sm:p-5",
      )}
    >
      <div className="flex items-start gap-3.5">
        <JobLogo job={job} size={dense ? "sm" : "md"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0">
              <Link
                href={`/vagas/${job.id}`}
                className="block truncate text-[15px] font-semibold tracking-[-0.015em] text-foreground hover:text-primary"
              >
                {job.title[locale]}
              </Link>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {job.company} <span className="text-border">·</span> {job.location[locale]}
              </p>
            </div>
            <SaveJobButton id={job.id} title={job.title[locale]} className="ml-auto shrink-0" />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="font-medium">
              {workModelLabel(job.workModel, locale)}
            </Badge>
            <Badge variant="outline" className="font-medium">
              {seniorityLabel(job.seniority, locale)}
            </Badge>
            {isFreshJob(job) && (
              <Badge variant="success" className="gap-1">
                <span className="size-1.5 rounded-full bg-current" /> {copy.common.new}
              </Badge>
            )}
            {job.featured && (
              <Badge variant="accent" className="hidden sm:inline-flex">
                {copy.common.featured}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {!dense && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-md bg-muted px-2 py-1 text-[10.5px] font-medium text-muted-foreground">
              {jobSkillLabel(skill, locale)}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="rounded-md bg-muted px-2 py-1 text-[10.5px] font-medium text-muted-foreground">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tabular-nums text-foreground">
            <Banknote className="size-3.5 text-muted-foreground" />
            {jobSalaryShort(job, locale)}
            <span className="font-normal text-muted-foreground">{copy.common.perMonth}</span>
          </span>
          <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:inline-flex">
            <Radio className="size-3" />
            {job.sourceChannel}
          </span>
          <span className="hidden items-center gap-1 text-[11px] text-muted-foreground xl:inline-flex">
            <MapPin className="size-3" />
            {formatCompact(job.sourceMembers, locale)} {locale === "pt" ? "membros" : "members"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="whitespace-nowrap">{jobPostedLabel(job, locale)}</span>
          <Link
            href={`/vagas/${job.id}`}
            aria-label={`${copy.common.viewRole}: ${job.title[locale]}`}
            className="flex size-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors group-hover:border-primary/25 group-hover:bg-accent group-hover:text-primary"
          >
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
