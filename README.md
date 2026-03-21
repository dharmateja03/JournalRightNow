# JournalRightNow

Chronicle-inspired no-nonsense journaling with a dark-only shadcn UI and a Python FastAPI backend.

## Stack

- Frontend: Next.js 16 (App Router) + Tailwind + shadcn/ui
- Backend: FastAPI + Uvicorn

## Run Locally

### 1) Start backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2) Start frontend

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend API

- `GET /health`
- `GET /api/logs`
- `POST /api/logs`
- `DELETE /api/logs/{id}`
