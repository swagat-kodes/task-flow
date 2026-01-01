// Node.js script to start both backend and frontend using concurrently
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting TASKFLOW Application...\n');

// Check if virtual environment exists
const venvPath = path.join(__dirname, '.venv');
const backendPath = path.join(__dirname, 'backend');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (!fs.existsSync(venvPath)) {
  console.log('⚠️  Virtual environment not found. Please run: python -m venv .venv');
  process.exit(1);
}

if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing frontend dependencies...');
  const npmInstall = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
  npmInstall.on('close', (code) => {
    if (code !== 0) {
      console.error('Failed to install frontend dependencies');
      process.exit(1);
    }
    startServers();
  });
} else {
  startServers();
}

function startServers() {
  console.log('✅ Starting servers...\n');
  console.log('Backend:  http://localhost:5000');
  console.log('Frontend: http://localhost:3000\n');
  console.log('Press Ctrl+C to stop both servers\n');

  // Determine the Python executable in venv
  const isWindows = process.platform === 'win32';
  const pythonExe = isWindows 
    ? path.join(venvPath, 'Scripts', 'python.exe')
    : path.join(venvPath, 'bin', 'python');
  
  const flaskCmd = isWindows ? 'flask' : 'flask';
  
  // Start backend
  const backend = spawn(pythonExe, [
    '-m', 'flask',
    '--app', 'app.py',
    '--debug', 'run',
    '--host', '0.0.0.0',
    '--port', '5000'
  ], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: isWindows
  });

  // Wait a bit for backend to start
  setTimeout(() => {
    // Start frontend
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    // Cleanup on exit
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping servers...');
      backend.kill();
      frontend.kill();
      process.exit();
    });

    frontend.on('close', () => {
      backend.kill();
      process.exit();
    });
  }, 2000);

  backend.on('close', () => {
    process.exit();
  });
}




