import { BadgeCheck } from "lucide-react";
import { cn, hashString, initials } from "@/lib/utils";

const TONES = [
  "linear-gradient(135deg, #0b2c52 0%, #1d5aa8 100%)",
  "linear-gradient(135deg, #123b4d 0%, #2b7f8f 100%)",
  "linear-gradient(135deg, #2d2150 0%, #6b4fb3 100%)",
  "linear-gradient(135deg, #4a2418 0%, #a9613d 100%)",
  "linear-gradient(135deg, #14352a 0%, #2f7a58 100%)",
  "linear-gradient(135deg, #402035 0%, #9a4a72 100%)",
  "linear-gradient(135deg, #243044 0%, #5c718f 100%)",
  "linear-gradient(135deg, #3d3517 0%, #a48935 100%)",
];

const SIZES = {
  xs: "size-7 text-[10px]",
  sm: "size-9 text-[11px]",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-2xl",
  "2xl": "size-24 text-3xl",
};

export type AvatarSize = keyof typeof SIZES;

export function Avatar({
  name,
  size = "md",
  verified = false,
  className,
  ring = false,
}: {
  name: string;
  size?: AvatarSize;
  verified?: boolean;
  className?: string;
  ring?: boolean;
}) {
  const tone = TONES[hashString(name) % TONES.length];
  return (
    <div className={cn("relative w-fit shrink-0 rounded-full", className)}>
      <div
        className={cn(
          "flex select-none items-center justify-center rounded-full font-semibold tracking-wide text-white",
          "shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.18)]",
          ring && "ring-2 ring-card ring-offset-2 ring-offset-border",
          SIZES[size],
        )}
        style={{ backgroundImage: tone }}
        aria-hidden="true"
      >
        {initials(name)}
      </div>
      {verified && (
        <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-card">
          <BadgeCheck className="size-4 fill-primary text-card" />
        </span>
      )}
    </div>
  );
}
