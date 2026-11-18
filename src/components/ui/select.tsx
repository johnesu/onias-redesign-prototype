import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  containerClassName?: string;
  sizeVariant?: "default" | "sm";
}

/**
 * Native select with the same visual language as the other inputs.
 * Native keeps mobile pickers accessible and avoids portal edge cases.
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, children, invalid, sizeVariant = "default", ...props }, ref) => (
    <div className={cn("relative", containerClassName)}>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full appearance-none rounded-[10px] border border-input bg-card pl-3 pr-9 text-sm text-foreground shadow-[0_1px_1px_rgb(15_23_42_/_0.02)] transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50",
          sizeVariant === "sm" && "h-8 rounded-lg pl-2.5 pr-8 text-[13px]",
          invalid && "border-danger/60 focus-visible:border-danger focus-visible:ring-danger/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
          sizeVariant === "sm" ? "size-3.5" : "size-4",
        )}
      />
    </div>
  ),
);
Select.displayName = "Select";

export { Select };
