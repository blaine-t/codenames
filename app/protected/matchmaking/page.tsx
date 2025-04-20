// app/protected/matchmaking/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import "../../globals.css";

// --- TitleImage component ---
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

// --- PlayerSelectButton component ---
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
}) => (
  <button
    onClick={() => onSelect(index)}
    className={`player-select-button ${selected ? 'selected' : ''}`}
    style={customStyle}
  >
    {label}
  </button>
);

// --- Main page content ---
function CodenamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameCode = searchParams.get('code') || '';

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(4).fill(''));

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  const handlePlayerSelect = (index: number) => {
    setSelectedPlayer(prev => (prev === index ? null : index));
  };

  const handleStart = () => {
<<<<<<< Updated upstream
    router.push('/game-page');
=======
    router.push('/protected/game');
>>>>>>> Stashed changes
  };

  return (
    <div className="main-container">
      <TitleImage gameCode={gameCode} />

      <div className="player-buttons-container">
        {/* Row 1: team headers */}
        <span className="team-header team-header-red">Red Team</span>
        <span className="team-header team-header-blue">Blue Team</span>
        
        {/* Rows 2 & 3: four player slots */}
        {[0, 1, 2, 3].map(i => {
          const roleLabel = i < 2 ? 'Spymaster' : 'Field Operative';
          const isSelected = selectedPlayer === i;
          const bgColor = isSelected ? (i % 2 === 1 ? 'blue' : 'red') : undefined;

          return (
            <div key={i} className="player-select-wrapper">
              <PlayerSelectButton
                index={i}
                label={roleLabel}
                selected={isSelected}
                onSelect={handlePlayerSelect}
                customStyle={bgColor ? { backgroundColor: bgColor } : {}}
              />
              <span className="player-name">
                {playerNames[i] || `Player ${i + 1}`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="turn-time">
        <span className="turn-time-label">Seconds per turn:</span>
        <input
          type="number"
          min={1}
          max={1000}
          defaultValue={60}
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

// --- Page export ---
export default function CodenamesPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <CodenamesPageContent />
    </Suspense>
  );
}
