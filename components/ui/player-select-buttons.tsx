import React, { useState } from 'react'

export default function PlayerSelectButtons() {
  // Store the index of the selected button (or null if none selected)
  const [selectedButton, setSelectedButton] = useState(null)

  // Handle click: toggle selection for the clicked button.
  const handleClick = (index: any) => {
    if (selectedButton === index) {
      // Deselect if already selected
      setSelectedButton(null)
    } else {
      // Select new button and deselect any previously selected button
      setSelectedButton(index)
    }
  }

  // Function to generate inline styles for a button
  const buttonStyle = (isSelected: any) => ({
    backgroundColor: isSelected ? 'red' : 'grey',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    margin: '5px',
    cursor: 'pointer',
  })

  return (
    <div>
      {[0, 1, 2, 3].map((index) => (
        <button key={index} style={buttonStyle(selectedButton === index)} onClick={() => handleClick(index)}>
          Player
        </button>
      ))}
    </div>
  )
}
