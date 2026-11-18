import type { Job } from "@/types";
import { JOB_TONE_CLASS, companyInitials } from "@/lib/jobs";
import { cn } from "@/lib/utils";

export function JobLogo({ job, size = "md" }: { job: Job; size?: "sm" | "md" | "lg" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-semibold tracking-[-0.03em] shadow-sm ring-1 ring-inset ring-white/10",
        JOB_TONE_CLASS[job.companyTone],
        size === "sm" && "size-9 text-[11px]",
        size === "md" && "size-11 text-[13px]",
        size === "lg" && "size-14 text-[16px]",
      )}
      aria-hidden="true"
    >
      {companyInitials(job.company)}
    </div>
  );
}
