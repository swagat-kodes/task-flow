# PowerShell script to start both backend and frontend in the same terminal
# Run this from the project root directory
# Uses background jobs to run both services concurrently

Write-Host "🚀 Starting TASKFLOW Application..." -ForegroundColor Green
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment and install backend dependencies
Write-Host "📦 Setting up backend..." -ForegroundColor Cyan
& .\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt --quiet 2>$null

# Check if .env file exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  WARNING: backend\.env file not found!" -ForegroundColor Yellow
    Write-Host "   Using default SQLite database (backend\.env not required)" -ForegroundColor Gray
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
    npm install --silent
}

Write-Host ""
Write-Host "✅ Starting servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend as a background job
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & .\.venv\Scripts\Activate.ps1
    Set-Location backend
    flask --app app.py --debug run --host 0.0.0.0 --port 5000 2>&1 | ForEach-Object {
        Write-Host "[BACKEND] $_" -ForegroundColor Green
    }
}

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend (runs in foreground, but we'll handle it)
Write-Host "⚛️  Starting frontend..." -ForegroundColor Cyan
npm run dev

# Cleanup: Stop backend job when frontend stops
Stop-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue




