import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full border-2 border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-accent placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Input };
