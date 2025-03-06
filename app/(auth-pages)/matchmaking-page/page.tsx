"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// This component now accepts a "gameCode" prop
function TitleImage({ gameCode }: { gameCode: string }) {
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Center the logo horizontally
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <Image 
          src="/codenameslogo.png" 
          alt="Codenames Logo" 
          width={300} 
          height={80}
        />
        <div 
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          <span style={{ marginRight: '10px' }}>Game code:</span>
          <span>{gameCode}</span>
        </div>
      </div>
    );
  }
  

// A separate component for each player select button.
// Accepts a label prop so that individual buttons can display custom text.
type PlayerSelectButtonProps = {
  index: number;
  selected: boolean;
  label: string;
  onSelect: (index: number) => void;
  customStyle?: React.CSSProperties;
};

const PlayerSelectButton: React.FC<PlayerSelectButtonProps> = ({
  index,
  selected,
  label,
  onSelect,
  customStyle = {}
}) => {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: selected ? 'red' : 'grey',
    color: 'white',
    border: 'none',
    padding: '20px 60px', // Increased horizontal padding for wider button
    borderRadius: '8px',
    cursor: 'pointer',
    minWidth: '200px',  // Increased minimum width for a wider button
    whiteSpace: 'nowrap', // Prevents text from wrapping onto multiple lines
    display: 'flex', // Center content horizontally and vertically
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <button
      onClick={() => onSelect(index)}
      style={{ ...defaultStyle, ...customStyle }}
    >
      {label}
    </button>
  );
};

export default function CodenamesPage() {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  // Disable scrolling by setting the body's overflow to hidden.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Navigates to /account-page when profile button is clicked.
  const handleProfileClick = () => {
    router.push('/account-page');
  };

  // Handler for selecting a player button.
  const handlePlayerSelect = (index: number) => {
    if (selectedPlayer === index) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(index);
    }
  };

  // Handler for the Start button.
  const handleStart = () => {
    router.push('/game-page');
  };

  // Render the 2x2 grid of player select buttons.
  const renderPlayerButtons = () => {
    const buttons = [0, 1, 2, 3];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          width: '80%',
          maxWidth: '500px',
          margin: '0 auto'
        }}
      >
        {buttons.map((index) => {
          // Determine the label: top row (indexes 0 and 1) is "Spymaster",
          // bottom row (indexes 2 and 3) is "Field Operative".
          const label = index < 2 ? "Spymaster" : "Field Operative";
          // Right column: index 1 and 3 become blue when selected.
          const selectedColor = (index % 2 === 1) ? 'blue' : 'red';
          const customStyle = selectedPlayer === index ? { backgroundColor: selectedColor } : {};
          return (
            <PlayerSelectButton
              key={index}
              index={index}
              label={label}
              selected={selectedPlayer === index}
              onSelect={handlePlayerSelect}
              customStyle={customStyle}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '50vh',
        width: '100%',
        padding: '0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Middle: Codenames Logo Image and Game Code */}
      <TitleImage gameCode={''} />

      {/* 2x2 Player Select Buttons */}
      {renderPlayerButtons()}
      <div 
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          <span style={{ marginRight: '10px' }}>Seconds per turn:</span>
          <input 
            type="number" 
            min="1" 
            max="1000" 
            defaultValue="60"
            style={{
            fontSize: '24px',
            padding: '5px',
            width: '80px'
            }}
            
        />
        </div>
      {/* Start Button at the bottom of the player select grid */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleStart}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            padding: '20px 60px',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '200px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Start
        </button>
      </div>

      {/* Top Right: Profile button */}
      <button 
        onClick={handleProfileClick}
        style={{
          position: 'fixed',
          top: '90px',
          right: '20px',
          cursor: 'pointer'
        }}
      >
        Account
      </button>
    </div>
  );
}
