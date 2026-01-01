import React, { useState, useEffect } from 'react'
import TaskList from './TaskList'
import TaskModal from './TaskModal'
import './TaskManager.css'

const TaskManager = ({ apiBase }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('priority')
  const [direction, setDirection] = useState('asc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter === 'completed') params.append('completed', 'true')
      if (filter === 'pending') params.append('completed', 'false')
      params.append('sort', sort)
      params.append('direction', direction)

      if (!apiBase) {
        throw new Error('API base URL is not configured')
      }

      const apiUrl = `${apiBase}/api/tasks?${params}`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch tasks`)
      }
      
      const data = await response.json()
      setTasks(data.items || [])
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error fetching tasks:', error)
      console.error('API Base URL:', apiBase)
      
      // Handle different types of errors
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('NetworkError') ||
          error.name === 'TypeError') {
        const errorMsg = `Cannot connect to backend API at ${apiBase}. 
        
Please start the backend server:
1. Open PowerShell in the project root
2. Run: .\\start-backend.ps1
   OR manually:
   cd backend
   flask --app app.py --debug run --host 0.0.0.0 --port 5000

See START-BACKEND.md for detailed instructions.`
        console.warn('Network error:', errorMsg)
        setError(errorMsg)
        setTasks([])
      } else {
        setError('Failed to load tasks: ' + error.message)
        setTasks([])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (apiBase) {
      fetchTasks()
    }
  }, [filter, sort, direction, apiBase])

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(`${apiBase}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create task')
      }
      await fetchTasks()
      setIsModalOpen(false)
    } catch (error) {
      throw error
    }
  }

  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${apiBase}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update task')
      }
      await fetchTasks()
      setIsModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      throw error
    }
  }

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      const response = await fetch(`${apiBase}/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
      await fetchTasks()
    } catch (error) {
      alert('Failed to delete task: ' + error.message)
      await fetchTasks()
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      await handleUpdateTask(task.id, { completed: !task.completed })
    } catch (error) {
      alert('Failed to update task: ' + error.message)
    }
  }

  const openCreateModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="task-manager">
      <header className="app-header">
        <h1 className="app-title">TASKFLOW</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add Task
        </button>
      </header>

      <section className="controls">
        <div className="filters">
          <button
            className={`chip ${filter === 'all' ? 'chip-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`chip ${filter === 'pending' ? 'chip-active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`chip ${filter === 'completed' ? 'chip-active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
        <div className="sort">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="priority">Priority</option>
            <option value="created">Created</option>
            <option value="due">Due Date</option>
          </select>
          <select
            id="direction-select"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
      </section>

      <main className="main-content">
        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Connection Error</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchTasks}>
              Retry
            </button>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
        )}
      </main>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={closeModal}
          onSave={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
        />
      )}
    </div>
  )
}

export default TaskManager

