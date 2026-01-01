# How to Start the Backend Server

The error "Cannot connect to backend API at http://localhost:5000" means the Flask backend server is not running.

## Quick Start (Windows PowerShell)

1. **Open PowerShell in the project root directory**

2. **Run the startup script:**
   ```powershell
   .\start-backend.ps1
   ```

   OR manually:

3. **Create virtual environment (if not exists):**
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

4. **Install dependencies:**
   ```powershell
   pip install -r backend/requirements.txt
   ```

5. **Navigate to backend and start server:**
   ```powershell
   cd backend
   flask --app app.py --debug run --host 0.0.0.0 --port 5000
   ```

6. **You should see:**
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   ```

7. **Keep this terminal open** - the server must stay running!

8. **In a NEW terminal**, start the frontend:
   ```powershell
   npm install
   npm run dev
   ```

## Verify Backend is Running

Open your browser and visit: `http://localhost:5000/api/tasks`

You should see JSON data (or an empty array `{"items":[]}` if no tasks exist).

## Troubleshooting

- **Port 5000 already in use?** 
  - Change the port: `flask --app app.py --debug run --port 5001`
  - Update frontend `.env`: `VITE_API_BASE=http://localhost:5001`

- **RuntimeError: 'cryptography' package is required**
  - This happens when using MySQL with PyMySQL. Fix it:
    1. Make sure virtual environment is activated:
       ```powershell
       .\.venv\Scripts\Activate.ps1
       ```
    2. Install cryptography:
       ```powershell
       pip install cryptography
       ```
    3. Or reinstall all requirements:
       ```powershell
       pip install -r backend/requirements.txt
       ```
  - **Alternative:** Use SQLite instead (no cryptography needed):
    - Create `backend/.env` with: `DATABASE_URL=sqlite:///task_manager.db`
    - SQLite works without any additional setup!

- **Database errors?**
  - The default uses SQLite which creates `task_manager.db` automatically
  - For MySQL, create `backend/.env` with: `DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/taskdb`
  - If you get authentication errors, make sure the MySQL user uses a compatible auth method or install cryptography

- **Module not found errors?**
  - Make sure virtual environment is activated
  - Run: `pip install -r backend/requirements.txt`

