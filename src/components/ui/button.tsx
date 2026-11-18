import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/92 hover:shadow-md",
        navy: "bg-navy text-white shadow-sm hover:bg-navy/92 hover:shadow-md dark:border dark:border-white/10",
        outline: "border border-border bg-card text-foreground shadow-[0_1px_1px_rgb(15_23_42_/_0.03)] hover:border-input hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/75",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        subtle: "bg-accent text-accent-foreground hover:bg-accent/75",
        success: "bg-success text-white shadow-sm hover:bg-success/90",
        danger: "bg-danger text-white shadow-sm hover:bg-danger/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        xs: "h-7 gap-1.5 rounded-md px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-9 gap-1.5 rounded-lg px-3 text-[13px] [&_svg]:size-4",
        lg: "h-11 px-5 text-[15px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
