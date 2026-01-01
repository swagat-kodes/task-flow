# Quick Start Guide

## Starting the Backend Server

The backend needs to be running before the frontend can connect to it.

### Option 1: Using the Startup Script (Recommended)

**Windows (PowerShell):**
```powershell
.\start-backend.ps1
```

**Linux/macOS:**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

### Option 2: Manual Setup

1. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   # Windows PowerShell:
   .\.venv\Scripts\Activate.ps1
   # Linux/macOS:
   source .venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Create `.env` file (if not exists):**
   - Copy `backend/.env.example` to `backend/.env` (if it exists)
   - Or create `backend/.env` with:
     ```
     DATABASE_URL=sqlite:///task_manager.db
     ```
   - For MySQL: `DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/taskdb`

4. **Initialize database (first time only):**
   ```bash
   cd backend
   flask db init       # first time only
   flask db migrate -m "init schema"
   flask db upgrade
   cd ..
   ```

5. **Start the Flask server:**
   ```bash
   cd backend
   flask --app app.py --debug run --host 0.0.0.0 --port 5000
   ```

   You should see:
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   ```

## Starting the Frontend

Once the backend is running, start the frontend:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - The app will be available at `http://localhost:3000` (or the port shown in terminal)
   - The frontend will automatically connect to `http://localhost:5000` for the API

## Troubleshooting

### Backend won't start
- Make sure Python 3.10+ is installed
- Check that all dependencies are installed: `pip install -r backend/requirements.txt`
- Verify the `.env` file exists in the `backend/` directory
- For MySQL: Make sure MySQL is running and the connection string is correct

### Frontend shows "Cannot connect to backend API"
- Make sure the backend is running on `http://localhost:5000`
- Check the browser console for CORS errors
- Verify the `VITE_API_BASE` environment variable (defaults to `http://localhost:5000`)
- Try accessing `http://localhost:5000/api/tasks` directly in your browser

### Database errors
- If using SQLite: The database file will be created automatically
- If using MySQL: Make sure MySQL is running and the database exists
- Run migrations: `cd backend && flask db upgrade`

## Using Docker (Alternative)

If you prefer Docker:

```bash
docker-compose up -d
```

This will start MySQL. You'll still need to run the Flask backend separately.




