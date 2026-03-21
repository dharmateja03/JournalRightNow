"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { TEXT_LIMIT } from "@/lib/journal";

interface JournalEditorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  text: string;
  setText: (value: string) => void;
  onSubmit: () => void;
  highlightedDates: Date[];
}

export function JournalEditor({
  selectedDate,
  setSelectedDate,
  text,
  setText,
  onSubmit,
  highlightedDates,
}: JournalEditorProps) {
  const textareaLabel = `What did you do on ${format(selectedDate, "EEEE, MMMM do")}?`;

  return (
    <aside className="w-full lg:sticky lg:top-24 lg:max-w-sm">
      <div className="border-2 border-border bg-card p-4">
        <Textarea
          aria-label={textareaLabel}
          value={text}
          placeholder={textareaLabel}
          className="min-h-28 text-base"
          onChange={(event) => {
            const nextValue = event.target.value;
            if (nextValue.length <= TEXT_LIMIT) {
              setText(nextValue);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSubmit();
            }
          }}
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 px-2 text-xs sm:hidden">
                <CalendarDays className="size-4" />
                {format(selectedDate, "MMM dd, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 sm:hidden" align="start">
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

          <p className="ml-auto text-xs text-muted-foreground">
            {text.length} / {TEXT_LIMIT}
          </p>
          <Button onClick={onSubmit}>Submit</Button>
        </div>

        <div className="mt-3 hidden sm:block">
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
      </div>
    </aside>
  );
}
