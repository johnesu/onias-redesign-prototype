import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }>(
  ({ className, children, required, ...props }, ref) => (
    <label ref={ref} className={cn("text-[13px] font-medium leading-5 text-foreground", className)} {...props}>
      {children}
      {required && <span className="ml-0.5 text-danger">*</span>}
    </label>
  ),
);
Label.displayName = "Label";

type FieldProps = {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  counter?: string;
};

function Field({ label, htmlFor, hint, error, required, className, children, counter }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || counter) && (
        <div className="flex items-baseline justify-between gap-3">
          {label && (
            <Label htmlFor={htmlFor} required={required}>
              {label}
            </Label>
          )}
          {counter && <span className="text-[11px] tabular-nums text-muted-foreground">{counter}</span>}
        </div>
      )}
      {children}
      {error ? (
        <p className="text-[12px] font-medium leading-5 text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] leading-5 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export { Label, Field };
