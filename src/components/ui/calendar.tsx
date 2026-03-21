"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-3 sm:flex-row",
        month: "space-y-3",
        caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-7 w-7 p-0 opacity-70 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 text-center text-[0.8rem] text-muted-foreground",
        row: "mt-2 flex w-full",
        cell: "relative h-9 w-9 p-0 text-center text-sm",
        day: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 w-9 rounded-none p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "border-2 border-accent bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        day_today: "border-2 border-primary text-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "opacity-30",
        day_range_middle: "aria-selected:bg-muted aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...props }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", className)} {...props} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
