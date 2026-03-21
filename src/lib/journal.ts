import { format } from "date-fns";

export interface JournalEntry {
  id: string;
  text: string;
  date: string;
  createdAt: string;
  order: number;
}

export const TEXT_LIMIT = 140;

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromDateKey(key: string): Date {
  const parsed = new Date(`${key}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function sortEntries(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => {
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date);
    }

    if (a.order !== b.order) {
      return b.order - a.order;
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function groupEntries(entries: JournalEntry[]): {
  keys: string[];
  groups: Record<string, JournalEntry[]>;
} {
  const groups: Record<string, JournalEntry[]> = {};
  const sorted = sortEntries(entries);

  for (const entry of sorted) {
    if (!groups[entry.date]) {
      groups[entry.date] = [];
    }

    groups[entry.date].push(entry);
  }

  return { keys: Object.keys(groups), groups };
}
