import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="onias-mark" x1="4" y1="2" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1668E3" />
          <stop offset="1" stopColor="#003A8C" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#onias-mark)" />
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="10.25" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="8.5" stroke="white" strokeWidth="2.4" />
      <circle cx="28.8" cy="11.2" r="2.6" fill="#8ED8FF" />
      <path d="M12.2 26.4L20 15.5" stroke="white" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  compact = false,
  tone = "light",
  tagline = "Vagas no Telegram",
}: {
  className?: string;
  compact?: boolean;
  tone?: "light" | "dark";
  tagline?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={compact ? 30 : 34} />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className={cn("text-[15px] font-semibold tracking-[0.16em]", tone === "light" ? "text-white" : "text-foreground")}>
            ONIAS
          </span>
          <span
            className={cn(
              "mt-1 text-[9px] font-medium uppercase tracking-[0.18em]",
              tone === "light" ? "text-white/45" : "text-muted-foreground",
            )}
          >
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
}
