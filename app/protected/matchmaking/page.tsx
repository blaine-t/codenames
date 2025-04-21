"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import "../../globals.css";
import { createClient } from '@/utils/supabase/client';

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

function CodenamesPageContent() {
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

  const handleStart = async () => {
    if (selectedPlayer === null) return;
  
    const role = selectedPlayer >= 2; // false = Spymaster, true = Operative
    const teamName = selectedPlayer % 2 === 1 ? "blue" : "red";
  
    const supabase = createClient();
  
    const {
      data: { user: authUser },
      error: authError
    } = await supabase.auth.getUser();
  
    if (authError || !authUser) {
      console.error("User not authenticated:", authError);
      return;
    }
  
    // Get ID from teamName
    const { data: teamData, error: teamError } = await supabase
    .from("Team")
    .select("id, name")
    .ilike("name", teamName);

  if (teamError) {
    console.error("Team fetch error:", teamError);
    return;
  }

  if (!teamData || teamData.length === 0) {
    console.error("No team found for name:", teamName);
    return;
  }

  const teamId = teamData[0].id;

    const {data: userData, error: userError} = await supabase
      .from("User")
      .select("id")
      .eq("auth_id", authUser.id)
      .limit(1)
      .single()
    // Upsert
    const { error: insertError } = await supabase
      .from("Player")
      .upsert({
        user_id: userData?.id,
        team_id: teamId,
        is_guesser: role,
      });
    
  
    if (insertError) {
      console.error("Failed to insert/update player:", insertError);
      return;
    }
  
    router.push("/protected/game");
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
