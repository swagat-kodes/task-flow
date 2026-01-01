import React from 'react'
import './LoadingScreen.css'

const LoadingScreen = () => {
  const letters = ['T', 'A', 'S', 'K', 'F', 'L', 'O', 'W']

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="taskflow-text">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="letter"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="checklist-animation">
          <div className="check-item" style={{ '--delay': '0.8s' }}></div>
          <div className="check-item" style={{ '--delay': '1s' }}></div>
          <div className="check-item" style={{ '--delay': '1.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen

