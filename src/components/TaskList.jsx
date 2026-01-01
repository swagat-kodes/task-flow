import React from 'react'
import TaskCard from './TaskCard'
import './TaskList.css'

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h2>No tasks yet</h2>
        <p>Create your first task to get started!</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </ul>
  )
}

export default TaskList




