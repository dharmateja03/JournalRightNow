import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background,box-shadow,transform] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary bg-primary px-4 py-2 text-primary-foreground shadow-[0_0_0_0_transparent] hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-[4px_4px_0_0_hsl(var(--ring))]",
        outline:
          "border-2 border-border bg-card text-card-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
