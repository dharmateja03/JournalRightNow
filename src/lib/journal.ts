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

export function newJournalEntry(text: string, date: Date, order: number): JournalEntry {
  return {
    id: crypto.randomUUID(),
    text,
    date: toDateKey(date),
    createdAt: new Date().toISOString(),
    order,
  };
}
