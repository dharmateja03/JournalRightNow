# JournalRightNow

Chronicle-inspired no-nonsense journaling with a dark-only shadcn UI, FastAPI backend, and Neon Postgres persistence.

## Stack

- Frontend: Next.js 16 (App Router) + Tailwind + shadcn/ui
- Backend: FastAPI + Uvicorn + Neon Postgres (`psycopg`)

## Run Locally

### 1) Configure environment

```bash
cp .env.example .env.local
```

Set `DATABASE_URL` in `.env.local` to your Neon connection string.

### 2) Start backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL="postgresql://<user>:<password>@<your-neon-host>/<db>?sslmode=require"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 3) Start frontend

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Railway

Create two Railway services from this repo.

1. Frontend service:
Set service root to `/` (repo root). Railway will use [`railway.toml`](./railway.toml).
Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL (for example, `https://journal-api.up.railway.app`).

2. Backend service:
Set service root to `/backend`. Railway will use [`backend/railway.toml`](./backend/railway.toml).
Set:
`DATABASE_URL=postgresql://...`
`CORS_ORIGINS=https://<your-frontend-domain>`

After both services are deployed, confirm:
- Frontend loads without API errors.
- Backend health endpoint responds at `/health`.

## Backend API

- `GET /health`
- `GET /api/logs`
- `POST /api/logs`
- `DELETE /api/logs/{id}`
