"use client";

import { format } from "date-fns";
import { useMemo, useState } from "react";

import { JournalEditor } from "@/components/journal/journal-editor";
import { Badge } from "@/components/ui/badge";
import { newJournalEntry, toDateKey, type JournalEntry } from "@/lib/journal";

const EMPTY_HINT = "Journal entries are small and explain one thing you did.";

export function JournalWorkspace() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [text, setText] = useState("");

  const highlightedDates = useMemo(
    () => entries.map((entry) => new Date(`${entry.date}T00:00:00`)),
    [entries]
  );

  const onSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const selectedDateKey = toDateKey(selectedDate);
    const order = entries.filter((entry) => entry.date === selectedDateKey).length;

    setEntries((previous) => [newJournalEntry(trimmed, selectedDate, order), ...previous]);
    setText("");
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_24rem]">
      <div className="border-2 border-border bg-card p-4 sm:p-6">
        <div className="border-b-2 border-border pb-4">
          <p className="text-accent">phi (..)</p>
          <p className="mt-2 text-sm text-muted-foreground">Jot down a highlight of the day.</p>
        </div>

        <div className="mt-5 space-y-4">
          {entries.length === 0 ? (
            <div className="border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
              {EMPTY_HINT}
            </div>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="border-2 border-border p-4 transition hover:bg-muted/40">
                <Badge className="mb-2">{format(new Date(`${entry.date}T00:00:00`), "EEEE, MMM d")}</Badge>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.text}</p>
              </article>
            ))
          )}
        </div>
      </div>

      <JournalEditor
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        text={text}
        setText={setText}
        onSubmit={onSubmit}
        highlightedDates={highlightedDates}
      />
    </section>
  );
}
