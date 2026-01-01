import React from 'react'
import './TaskCard.css'

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, index }) => {
  const priorityColors = {
    high: '#d32f2f',    // Red
    medium: '#fbc02d',  // Yellow
    low: '#388e3c',     // Green
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <li
      className={`task-card ${task.completed ? 'completed' : ''}`}
      style={{ '--delay': `${index * 0.05}s` }}
    >
      <div className="task-main">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed || false}
          onChange={() => onToggleComplete(task)}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="task-info">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-desc">{task.description}</div>
          )}
          <div className="badges">
            <span
              className="badge badge-priority"
              style={{
                backgroundColor: priorityColors[task.priority] || priorityColors.medium,
                color: task.priority === 'medium' ? '#000000' : 'white',
              }}
            >
              {task.priority}
            </span>
            {task.due_date && (
              <span className="badge badge-due">
                Due: {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button
          className="icon-btn edit"
          onClick={() => onEdit(task)}
          title="Edit"
          aria-label="Edit task"
        >
          ✎
        </button>
        <button
          className="icon-btn delete"
          onClick={() => onDelete(task.id)}
          title="Delete"
          aria-label="Delete task"
        >
          🗑
        </button>
      </div>
    </li>
  )
}

export default TaskCard

