# Habit Tracker FastAPI Backend

## Setup

1. **Install dependencies**
   ```sh
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the server**
   ```sh
   uvicorn main:app --reload
   ```

- The API will be available at http://127.0.0.1:8000
- Interactive docs: http://127.0.0.1:8000/docs

## Endpoints
- `/tasks` — CRUD for tasks
- `/notes` — CRUD for notepad (notes, ideas, journal)
- `/projects` — CRUD for projects
- `/learnings` — CRUD for learnings

## Database
- Uses SQLite (`habit_tracker.db` in project root)
- Models auto-created on first run
