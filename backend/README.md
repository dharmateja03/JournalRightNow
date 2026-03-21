# JournalRightNow FastAPI Backend

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Optional CORS override:

```bash
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000 uvicorn app.main:app --reload
```
