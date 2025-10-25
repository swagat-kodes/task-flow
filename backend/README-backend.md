# Backend (Flask + SQLAlchemy)

This is the Flask backend for Task Manager. It exposes a JSON REST API under `/api`.

## Requirements
- Python 3.10+
- MySQL 8+

## Setup (Windows/WSL/Linux)
1. Create and activate a virtualenv
```bash
python -m venv .venv
. .venv/bin/activate  # Linux/macOS
# Or on Windows PowerShell:
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies
```bash
pip install -r backend/requirements.txt
```

3. Configure environment
- Copy `backend/.env.example` to `backend/.env` and edit `DATABASE_URL` for your MySQL instance.

4. Initialize DB (Flask-Migrate)
```bash
cd backend
flask db init   # only first time, creates migrations/ folder
flask db migrate -m "init schema"
flask db upgrade
```

5. Run the server
```bash
flask --app app.py --debug run --host 0.0.0.0 --port 5000
```

## API
- GET `/api/tasks` — list tasks (filters: `?completed=true|false`, `?sort=due|priority|created`, `?direction=asc|desc`, `?page`, `?per_page`)
- POST `/api/tasks` — create task
- GET `/api/tasks/<id>` — get one
- PUT `/api/tasks/<id>` — update
- DELETE `/api/tasks/<id>` — delete

All endpoints return JSON and proper status codes.

## Testing
```bash
pytest -q
```



