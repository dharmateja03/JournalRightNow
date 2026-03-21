import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
