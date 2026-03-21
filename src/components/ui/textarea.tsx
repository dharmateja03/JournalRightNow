import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full border-2 border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus-visible:border-accent",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
