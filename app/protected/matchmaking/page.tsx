"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import "../../globals.css";

function TitleImage({ gameCode }: { gameCode: string }) {
  return (
    <div className="title-image-container">
      <Image
        src="/codenameslogo.png"
        alt="Codenames Logo"
        width={300}
        height={80}
      />
      <div className="game-code">
        <span className="game-code-label">Game code:</span>
        <span>{gameCode}</span>
      </div>
    </div>
  );
}

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
  return (
    <button
      onClick={() => onSelect(index)}
      className={`player-select-button ${selected ? 'selected' : ''}`}
      style={customStyle}
    >
      {label}
    </button>
  );
};

export default function CodenamesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameCode = searchParams.get('code') || '';

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleProfileClick = () => {
    router.push('/protected/account');
  };

  const handlePlayerSelect = (index: number) => {
    if (selectedPlayer === index) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(index);
    }
  };

  const handleStart = () => {
    router.push('/game-page');
  };

  const renderPlayerButtons = () => {
    const buttons = [0, 1, 2, 3];
    return (
      <div className="player-buttons-container">
        {buttons.map((index) => {
          const label = index < 2 ? "Spymaster" : "Field Operative";
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
    <div className="main-container">
      <TitleImage gameCode={gameCode} />
      {renderPlayerButtons()}
      <div className="turn-time">
        <span className="turn-time-label">Seconds per turn:</span>
        <input
          type="number"
          min="1"
          max="1000"
          defaultValue="60"
          className="turn-time-input"
        />
      </div>
      <div className="start-button-container">
        <button onClick={handleStart} className="start-button">
          Start
        </button>
      </div>
      <button onClick={handleProfileClick} className="profile-button">
        Account
      </button>
    </div>
  );
}
