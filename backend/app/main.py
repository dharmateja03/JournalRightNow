from __future__ import annotations

import os
from datetime import date, datetime, timedelta, timezone
from uuid import uuid4

import psycopg
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row
from pydantic import BaseModel, Field, field_validator

DATABASE_URL = os.getenv("DATABASE_URL", "")


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def created_at_to_iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def row_to_entry(row: dict) -> "JournalEntry":
    return JournalEntry(
        id=str(row["id"]),
        text=row["text"],
        date=row["entry_date"].isoformat(),
        createdAt=created_at_to_iso(row["created_at"]),
        order=row["entry_order"],
    )


def require_database_url() -> str:
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is required. Set it to your Neon connection string.")

    return DATABASE_URL


def connect_db() -> psycopg.Connection:
    return psycopg.connect(require_database_url(), row_factory=dict_row)


def initialize_schema() -> None:
    with connect_db() as connection, connection.cursor() as cursor:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS journal_entries (
                id UUID PRIMARY KEY,
                text VARCHAR(140) NOT NULL,
                entry_date DATE NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                entry_order INTEGER NOT NULL CHECK (entry_order >= 0)
            )
            """
        )
        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_journal_entries_date_order_created
            ON journal_entries (entry_date DESC, entry_order DESC, created_at DESC)
            """
        )


def seed_if_empty() -> None:
    with connect_db() as connection, connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) AS count FROM journal_entries")
        count = int(cursor.fetchone()["count"])

        if count > 0:
            return

        yesterday = date.today() - timedelta(days=1)
        created_at = now_utc()
        seed_rows = [
            (
                uuid4(),
                "Journal entries are small and explain one thing you did",
                yesterday,
                created_at,
                1,
            ),
            (uuid4(), "Try creating one yourself", yesterday, created_at, 0),
        ]

        cursor.executemany(
            """
            INSERT INTO journal_entries (id, text, entry_date, created_at, entry_order)
            VALUES (%s, %s, %s, %s, %s)
            """,
            seed_rows,
        )


def fetch_all_entries() -> list["JournalEntry"]:
    with connect_db() as connection, connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT id, text, entry_date, created_at, entry_order
            FROM journal_entries
            ORDER BY entry_date DESC, entry_order DESC, created_at DESC
            """
        )
        rows = cursor.fetchall()

    return [row_to_entry(row) for row in rows]


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


app = FastAPI(title="JournalRightNow API", version="0.2.0")

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


@app.on_event("startup")
def startup() -> None:
    initialize_schema()
    seed_if_empty()


@app.get("/health")
def health() -> dict[str, str]:
    with connect_db() as connection, connection.cursor() as cursor:
        cursor.execute("SELECT 1")

    return {"status": "ok"}


@app.get("/api/logs", response_model=LogsResponse)
def list_logs() -> LogsResponse:
    return LogsResponse(items=fetch_all_entries())


@app.post("/api/logs", response_model=JournalEntry)
def create_log(payload: CreateJournalEntry) -> JournalEntry:
    with connect_db() as connection, connection.cursor() as cursor:
        cursor.execute(
            "SELECT COALESCE(MAX(entry_order), -1) AS max_order FROM journal_entries WHERE entry_date = %s",
            (payload.date,),
        )
        max_order = int(cursor.fetchone()["max_order"])
        next_order = max_order + 1

        created_at = now_utc()
        entry_id = uuid4()

        cursor.execute(
            """
            INSERT INTO journal_entries (id, text, entry_date, created_at, entry_order)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, text, entry_date, created_at, entry_order
            """,
            (entry_id, payload.text.strip(), payload.date, created_at, next_order),
        )
        row = cursor.fetchone()

    return row_to_entry(row)


@app.delete("/api/logs/{entry_id}", response_model=LogsResponse)
def delete_log(entry_id: str) -> LogsResponse:
    with connect_db() as connection, connection.cursor() as cursor:
        cursor.execute("DELETE FROM journal_entries WHERE id = %s RETURNING id", (entry_id,))
        deleted = cursor.fetchone()

    if deleted is None:
        raise HTTPException(status_code=404, detail="Entry not found")

    return LogsResponse(items=fetch_all_entries())
