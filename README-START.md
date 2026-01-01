# Quick Start - Single Command

## 🚀 Start Everything with One Command

### Option 1: PowerShell Script (Recommended for Windows)

**Start both servers in separate windows:**
```powershell
.\start-all.ps1
```

**Start both servers in the same terminal:**
```powershell
.\start-all-single.ps1
```

### Option 2: Node.js Script (Cross-platform)

**Using npm:**
```bash
npm start
```

**Or directly:**
```bash
node start-all.js
```

### Option 3: Bash Script (Linux/macOS)

```bash
chmod +x start-all.sh
./start-all.sh
```

## What Happens

1. ✅ Checks and creates virtual environment if needed
2. ✅ Installs backend dependencies
3. ✅ Installs frontend dependencies (if needed)
4. ✅ Starts Flask backend on `http://localhost:5000`
5. ✅ Starts Vite frontend on `http://localhost:3000`

## Access the Application

Once both servers are running:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/tasks

## Stop the Servers

- **Separate windows:** Close both PowerShell/terminal windows
- **Same terminal:** Press `Ctrl+C` (stops both servers)

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- **Backend:** Edit `start-all.ps1` and change `--port 5000` to another port
- **Frontend:** Vite will automatically use the next available port

### Virtual Environment Issues
If you get Python errors:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

### Node Modules Missing
If frontend doesn't start:
```powershell
npm install
```

## Manual Start (Alternative)

If the scripts don't work, start manually:

**Terminal 1 - Backend:**
```powershell
.\.venv\Scripts\Activate.ps1
cd backend
flask --app app.py --debug run --host 0.0.0.0 --port 5000
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```




