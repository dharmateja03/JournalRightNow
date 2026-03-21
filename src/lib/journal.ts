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

export function exportAsMarkdown(entries: JournalEntry[]): string {
  const { keys, groups } = groupEntries(entries);

  let content = `# Chronicle journal\nExported from JournalRightNow on ${format(
    new Date(),
    "MMMM do, yyyy"
  )}\n`;

  for (const key of keys) {
    content += `\n## ${format(new Date(`${key}T00:00:00`), "MMMM do, yyyy")}\n\n`;

    for (const entry of groups[key]) {
      content += `- ${entry.text}\n`;
    }
  }

  return content;
}

export function exportAsJson(entries: JournalEntry[]): string {
  const { keys, groups } = groupEntries(entries);
  const payload: Record<string, { text: string; date: string; createdAt: string }[]> = {};

  for (const key of keys) {
    payload[key] = groups[key].map((entry) => ({
      text: entry.text,
      date: entry.date,
      createdAt: entry.createdAt,
    }));
  }

  return JSON.stringify(payload, null, 2);
}
