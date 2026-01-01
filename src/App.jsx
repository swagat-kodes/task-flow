import React, { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import TaskManager from './components/TaskManager'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading screen for at least 2 seconds for animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return <TaskManager apiBase={API_BASE} />
}

export default App




