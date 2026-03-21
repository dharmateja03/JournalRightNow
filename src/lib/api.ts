import type { JournalEntry } from "@/lib/journal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

interface LogsResponse {
  items: JournalEntry[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export async function fetchLogs(): Promise<JournalEntry[]> {
  const data = await request<LogsResponse>("/api/logs");
  return data.items;
}

export async function createLog(text: string, date: string): Promise<JournalEntry> {
  return request<JournalEntry>("/api/logs", {
    method: "POST",
    body: JSON.stringify({ text, date }),
  });
}

export async function deleteLog(id: string): Promise<JournalEntry[]> {
  const data = await request<LogsResponse>(`/api/logs/${id}`, {
    method: "DELETE",
  });

  return data.items;
}
