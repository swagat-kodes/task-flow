# PowerShell script to start the Flask backend server
# Make sure you're in the project root directory

Write-Host "Starting Flask Backend Server..." -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Check if requirements are installed
Write-Host "Installing/updating dependencies..." -ForegroundColor Yellow
pip install -r backend/requirements.txt

# Ensure cryptography is installed (required for MySQL)
Write-Host "Ensuring cryptography package is installed..." -ForegroundColor Yellow
pip install cryptography

# Check if .env file exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "WARNING: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env with DATABASE_URL" -ForegroundColor Yellow
    Write-Host "Example: DATABASE_URL=sqlite:///task_manager.db" -ForegroundColor Yellow
    Write-Host ""
}

# Change to backend directory and run Flask
Write-Host "Starting Flask server on http://localhost:5000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location backend
flask --app app.py --debug run --host 0.0.0.0 --port 5000

