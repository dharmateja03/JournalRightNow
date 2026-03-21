# JournalRightNow FastAPI Backend

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set `DATABASE_URL` to your Neon Postgres connection string:

```bash
export DATABASE_URL="postgresql://<user>:<password>@<your-neon-host>/<db>?sslmode=require"
```

Optional CORS override:

```bash
export CORS_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

## Run

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend auto-creates the `journal_entries` table and seeds starter rows when empty.
