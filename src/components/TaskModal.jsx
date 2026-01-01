import React, { useState, useEffect } from 'react'
import './TaskModal.css'

const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date || '',
        priority: task.priority || 'medium',
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (formData.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(formData.due_date)) {
      newErrors.due_date = 'Date must be YYYY-MM-DD'
    }
    if (!['low', 'medium', 'high'].includes(formData.priority)) {
      newErrors.priority = 'Invalid priority'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSave({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        due_date: formData.due_date || null,
        priority: formData.priority,
      })
    } catch (error) {
      const errorData = error.message || {}
      if (typeof errorData === 'object' && errorData.errors) {
        setErrors(errorData.errors)
      } else {
        alert(error.message || 'Failed to save task')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">{task ? 'Edit Task' : 'Add Task'}</h2>
          <button
            className="icon-btn close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="title">
              Title<span className="req">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={255}
              placeholder="e.g., Buy groceries"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-row">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional details..."
            />
          </div>

          <div className="form-row two-col">
            <div>
              <label htmlFor="due_date">Due Date</label>
              <input
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                className={errors.due_date ? 'error' : ''}
              />
              {errors.due_date && (
                <div className="error-message">{errors.due_date}</div>
              )}
            </div>
            <div>
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={errors.priority ? 'error' : ''}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <div className="error-message">{errors.priority}</div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal




