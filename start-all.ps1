# PowerShell script to start both backend and frontend servers
# Run this from the project root directory

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

# Start backend in a new PowerShell window
$backendScript = @"
cd '$PWD'
.\.venv\Scripts\Activate.ps1
cd backend
Write-Host '🔧 Backend server starting on http://localhost:5000' -ForegroundColor Green
flask --app app.py --debug run --host 0.0.0.0 --port 5000
"@

# Start frontend in a new PowerShell window
$frontendScript = @"
cd '$PWD'
Write-Host '⚛️  Frontend server starting on http://localhost:3000' -ForegroundColor Green
npm run dev
"@

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host "✨ Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "The application will be available at: http://localhost:3000" -ForegroundColor Cyan




