#!/bin/bash
# Bash script to start both backend and frontend servers
# Run this from the project root directory

echo "🚀 Starting TASKFLOW Application..."
echo ""

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment and install backend dependencies
echo "📦 Setting up backend..."
source .venv/bin/activate
pip install -r backend/requirements.txt --quiet 2>/dev/null

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  WARNING: backend/.env file not found!"
    echo "   Using default SQLite database (backend/.env not required)"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --silent
fi

echo ""
echo "✅ Starting servers..."
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend in background
cd backend
flask --app app.py --debug run --host 0.0.0.0 --port 5000 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo "✨ Both servers are running!"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait




