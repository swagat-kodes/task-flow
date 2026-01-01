#!/bin/bash
# Bash script to start the Flask backend server
# Make sure you're in the project root directory

echo "Starting Flask Backend Server..."

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Check if requirements are installed
echo "Checking dependencies..."
pip install -r backend/requirements.txt --quiet

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "WARNING: backend/.env file not found!"
    echo "Please create backend/.env with DATABASE_URL"
    echo "Example: DATABASE_URL=sqlite:///task_manager.db"
    echo ""
fi

# Change to backend directory and run Flask
echo "Starting Flask server on http://localhost:5000..."
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
flask --app app.py --debug run --host 0.0.0.0 --port 5000




