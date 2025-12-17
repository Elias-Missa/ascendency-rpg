import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent px-3 py-2 text-base transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        cyber: "border-primary/30 bg-card/50 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:shadow-[0_0_15px_hsl(var(--primary)/0.2)] focus-visible:ring-0",
        "cyber-glow": "border-primary/40 bg-card/80 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-card focus:shadow-[0_0_20px_hsl(var(--primary)/0.3),inset_0_0_20px_hsl(var(--primary)/0.05)] focus-visible:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
