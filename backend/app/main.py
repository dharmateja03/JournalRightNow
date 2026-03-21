from __future__ import annotations

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
DATA_FILE = DATA_DIR / "entries.json"


def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def seed_entries() -> list[dict[str, Any]]:
    yesterday = (datetime.utcnow() - timedelta(days=1)).date().isoformat()
    created = now_iso()

    return [
        {
            "id": str(uuid4()),
            "text": "Journal entries are small and explain one thing you did",
            "date": yesterday,
            "createdAt": created,
            "order": 1,
        },
        {
            "id": str(uuid4()),
            "text": "Try creating one yourself",
            "date": yesterday,
            "createdAt": created,
            "order": 0,
        },
    ]


def sort_entries(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(
        entries,
        key=lambda entry: (entry["date"], entry["order"], entry["createdAt"]),
        reverse=True,
    )


def load_entries() -> list[dict[str, Any]]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    if not DATA_FILE.exists():
        initial = seed_entries()
        save_entries(initial)
        return initial

    with DATA_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, list):
        raise RuntimeError("entries.json must contain a list")

    return data


def save_entries(entries: list[dict[str, Any]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(entries, file, indent=2)


class JournalEntry(BaseModel):
    id: str
    text: str
    date: str
    createdAt: str
    order: int


class CreateJournalEntry(BaseModel):
    text: str = Field(min_length=1, max_length=140)
    date: str

    @field_validator("text")
    @classmethod
    def text_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("text cannot be blank")
        return value

    @field_validator("date")
    @classmethod
    def date_format(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError("date must be yyyy-mm-dd") from exc
        return value


class LogsResponse(BaseModel):
    items: list[JournalEntry]


app = FastAPI(title="JournalRightNow API", version="0.1.0")

cors_origins = os.getenv("CORS_ORIGINS")
allowed_origins = (
    [origin.strip() for origin in cors_origins.split(",") if origin.strip()]
    if cors_origins
    else ["http://localhost:3000", "http://127.0.0.1:3000"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/logs", response_model=LogsResponse)
def list_logs() -> LogsResponse:
    entries = sort_entries(load_entries())
    return LogsResponse(items=[JournalEntry(**entry) for entry in entries])


@app.post("/api/logs", response_model=JournalEntry)
def create_log(payload: CreateJournalEntry) -> JournalEntry:
    entries = load_entries()
    order = sum(1 for entry in entries if entry["date"] == payload.date)

    entry = {
        "id": str(uuid4()),
        "text": payload.text.strip(),
        "date": payload.date,
        "createdAt": now_iso(),
        "order": order,
    }

    entries.append(entry)
    save_entries(entries)

    return JournalEntry(**entry)


@app.delete("/api/logs/{entry_id}", response_model=LogsResponse)
def delete_log(entry_id: str) -> LogsResponse:
    entries = load_entries()
    updated = [entry for entry in entries if entry["id"] != entry_id]

    if len(updated) == len(entries):
        raise HTTPException(status_code=404, detail="Entry not found")

    save_entries(updated)
    return LogsResponse(items=[JournalEntry(**entry) for entry in sort_entries(updated)])
