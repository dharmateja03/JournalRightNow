"use client";

import { format } from "date-fns";
import { Download, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { JournalEditor } from "@/components/journal/journal-editor";
import { Button } from "@/components/ui/button";
import { createLog, deleteLog, fetchLogs } from "@/lib/api";
import { downloadTextFile } from "@/lib/download";
import {
  exportAsJson,
  exportAsMarkdown,
  groupEntries,
  sortEntries,
  toDateKey,
  type JournalEntry,
} from "@/lib/journal";

const EMPTY_HINT = "Journal entries are small and explain one thing you did.";

export function JournalWorkspace() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const logs = await fetchLogs();
        setEntries(sortEntries(logs));
      } catch {
        setError("Could not load journal entries. Start the FastAPI backend and refresh.");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const highlightedDates = useMemo(
    () => entries.map((entry) => new Date(`${entry.date}T00:00:00`)),
    [entries]
  );

  const { keys, groups } = useMemo(() => groupEntries(entries), [entries]);

  const onSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await createLog(trimmed, toDateKey(selectedDate));
      setEntries((previous) => sortEntries([created, ...previous]));
      setText("");
    } catch {
      setError("Could not save journal entry. Check backend connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const updated = await deleteLog(id);
      setEntries(sortEntries(updated));
    } catch {
      setError("Could not delete journal entry. Check backend connectivity.");
    } finally {
      setDeletingId(null);
    }
  };

  const onExportMarkdown = () => {
    downloadTextFile("journalrightnow.md", exportAsMarkdown(entries), "text/markdown;charset=utf-8");
  };

  const onExportJson = () => {
    downloadTextFile("journalrightnow.json", exportAsJson(entries), "application/json;charset=utf-8");
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_24rem]">
      <div className="border-2 border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-border pb-4">
          <div>
            <p className="text-accent">phi (..)</p>
            <p className="mt-2 text-sm text-muted-foreground">Jot down a highlight of the day.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onExportMarkdown}
              disabled={loading || entries.length === 0}
            >
              <Download className="size-3.5" />
              markdown
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={onExportJson}
              disabled={loading || entries.length === 0}
            >
              <Download className="size-3.5" />
              json
            </Button>
          </div>
        </div>

        {error ? (
          <p className="mt-4 border-2 border-red-500/60 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>
        ) : null}

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
              Loading entries...
            </div>
          ) : keys.length === 0 ? (
            <div className="border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
              {EMPTY_HINT}
            </div>
          ) : (
            keys.map((dateKey) => (
              <section key={dateKey} id={dateKey} className="border-t-2 border-border pt-5">
                <p className="pb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {format(new Date(`${dateKey}T00:00:00`), "EEEE, MMMM do").toUpperCase()}
                </p>

                <div className="space-y-2">
                  {groups[dateKey].map((entry) => (
                    <article
                      key={entry.id}
                      className="group relative border-2 border-transparent p-3 pr-12 transition hover:border-border hover:bg-muted/40"
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{entry.text}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 transition group-hover:opacity-100"
                        disabled={deletingId === entry.id}
                        onClick={() => void onDelete(entry.id)}
                        aria-label="Delete log"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
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
        submitting={submitting}
      />
    </section>
  );
}
