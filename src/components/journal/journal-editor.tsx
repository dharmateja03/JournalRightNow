"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface JournalEditorProps {
  className?: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  text: string;
  setText: (value: string) => void;
  onSubmit: () => Promise<void>;
  highlightedDates: Date[];
  submitting: boolean;
}

export function JournalEditor({
  className,
  selectedDate,
  setSelectedDate,
  text,
  setText,
  onSubmit,
  highlightedDates,
  submitting,
}: JournalEditorProps) {
  const textareaLabel = `What did you do on ${format(selectedDate, "EEEE, MMMM do")}?`;

  return (
    <aside className={cn("w-full lg:sticky lg:top-24 lg:max-w-sm lg:self-start", className)}>
      <div className="border-2 border-border bg-card p-4">
        <div className="mb-3 sm:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 w-full justify-start px-3 text-xs">
                <CalendarDays className="size-4" />
                {format(selectedDate, "EEEE, MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                modifiers={{ highlight: highlightedDates }}
                modifiersClassNames={{ highlight: "font-semibold text-accent" }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-3 hidden sm:block">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            modifiers={{ highlight: highlightedDates }}
            modifiersClassNames={{ highlight: "font-semibold text-accent" }}
          />
        </div>

        <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {format(selectedDate, "EEEE, MMMM do")}
        </p>

        <Textarea
          aria-label={textareaLabel}
          value={text}
          placeholder={textareaLabel}
          className="min-h-28 text-base"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void onSubmit();
            }
          }}
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">{text.length} characters</p>
          <Button onClick={() => void onSubmit()} disabled={submitting}>
            {submitting ? "Saving..." : "Save entry"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
