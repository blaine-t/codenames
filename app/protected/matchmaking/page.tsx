"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../../globals.css';
import { createClient } from '@/utils/supabase/client';
import CreateGameJson from '@/types/CreateGameJson';
import { InviteFriendsPopup } from '@/components/InviteFriendsPopup';
import { RulesPopup } from '@/components/RulesPopup';

function TitleImage({ gameCode }: { gameCode: string }) {
  return (
    <div className="title-image-container">
      <Image src="/codenameslogo.png" alt="Codenames Logo" width={300} height={80} />
      <div className="game-code">
        <span className="game-code-label">Game code:</span>
        <span>{gameCode}</span>
      </div>
    </div>
  );
}

function CodenamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameCode = searchParams.get('code') || '';

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [turnTime, setTurnTime] = useState<number>(60);
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [selectedRoles, setSelectedRoles] = useState<boolean[]>([false, false, false, false]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const supabase = createClient();

  const handleGameStart = async () => {
    if (!selectedRoles.every(Boolean)) {
      setErrorMessage("Please select all roles before starting the game.");
      return;
    }

    const data: CreateGameJson = {
      game_code: parseInt(gameCode),
      team1_id: 1,
      team2_id: 2,
      turn_time: turnTime,
    };
    await fetch("/api/createGame", {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="main-container">
      <TitleImage gameCode={gameCode} />

      {/* TEAM LAYOUT */}
      <div className="player-teams-container">
        <div className="team-group red-team-group">
          <h2 style={{ color: 'red' }}>Red Team</h2>
          <div className="player-buttons-container">
            <button className="player-select-button">Spymaster</button>
            <span className="player-label">Player 1</span>
            <button className="player-select-button">Field Operative</button>
            <span className="player-label">Player 3</span>
          </div>
        </div>

        <div className="team-group blue-team-group">
          <h2 style={{ color: 'blue' }}>Blue Team</h2>
          <div className="player-buttons-container">
            <button className="player-select-button">Spymaster</button>
            <span className="player-label">Player 2</span>
            <button className="player-select-button">Field Operative</button>
            <span className="player-label">Player 4</span>
          </div>
        </div>
      </div>

      {/* TURN TIMER + CONTROLS */}
      <div className="turn-time">
        <span className="turn-time-label">Seconds per turn:</span>
        <input
          type="number"
          min="1"
          max="1000"
          value={turnTime}
          className="turn-time-input"
          onChange={(e) => setTurnTime(parseInt(e.target.value))}
        />
      </div>

      <div className="start-button-container">
        <button onClick={handleGameStart} className="start-button" data-testid={'start-button'}>
          Start
        </button>
        <div className="flex flex-col mt-4 space-y-2">
          <button
            onClick={() => setShowFriendsList(true)}
            className="invite-friends-toggle"
          >
            📨 Invite Friends
          </button>
          <button
            onClick={() => setShowRules(true)}
            className="invite-friends-toggle"
          >
            📖 Show Rules
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="error-popup">
          <div className="error-popup-content">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </div>
        </div>
      )}

      {showFriendsList && (
        <InviteFriendsPopup gameCode={gameCode} onClose={() => setShowFriendsList(false)} />
      )}

      {showRules && (
        <RulesPopup onClose={() => setShowRules(false)} />
      )}
    </div>
  );
}

export default function CodenamesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodenamesPageContent />
    </Suspense>
  );
}
