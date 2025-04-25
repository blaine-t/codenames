"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import "../../globals.css";
import { createClient } from "@/utils/supabase/client";

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
  customStyle = {},
}) => {
  return (
    <button
      onClick={() => onSelect(index)}
      className={`player-select-button ${selected ? "selected" : ""}`}
      style={customStyle}
    >
      {label}
    </button>
  );
};

function CodenamesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameCode = searchParams.get("code") || "";

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const supabase = createClient();

  // Hide scrollbars
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  // Fetch current user's username once on mount
  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) return console.error("Auth error", authError);

      const { data: userRecord, error: userError } = await supabase
        .from("User")
        .select("username")
        .eq("auth_id", authUser.id)
        .single();

      if (userError || !userRecord)
        return console.error("Fetch username error", userError);
      setUsername(userRecord.username);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const getOtherPlayers = async () => {
      const { data: otherPlayers, error: playerCheckError } = await supabase
        .from("Player")
        .select(
          `
      User (username, image)
      Team (id, name)
      is_guesser
    `
        )
        .eq("game_code", gameCode)
        .limit(3);

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("User not authenticated:", authError);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("id")
        .eq("auth_id", authUser.id)
        .limit(1)
        .single();

      setUserId(userData?.id);

      const { error: upsertError } = await supabase.from("Player").upsert(
        {
          user_id: userId,
          is_host: otherPlayers?.length === 0,
          game_code: gameCode,
          is_guesser: null,
          team_id: null,
        },
        { onConflict: "user_id" }
      );

      if (upsertError) {
        console.error("Failed to insert/update player:", upsertError);
        return;
      }
    };
    getOtherPlayers();
  });

  const handlePlayerSelect = (index: number) => {
    setSelectedPlayer((prev) => (prev === index ? null : index));
  };

  const handleStart = async () => {
    if (selectedPlayer === null) return;

    const role = selectedPlayer >= 2; // false = Spymaster, true = Operative
    const teamName = selectedPlayer % 2 === 1 ? "blue" : "red";

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

    const { error: updateError } = await supabase
      .from("Player")
      .update({
        game_code: gameCode,
        is_guesser: role,
        team_id: teamId,
      })
      .eq("user_id", userId);
      
    if (updateError) {
      console.error("Failed to insert/update player:", updateError);
      return;
    }

    router.push("/protected/game");
  };

  const renderPlayerButtons = () => {
    const teams = [
      { name: "Red Team", cssClass: "red-team-group", indices: [0, 2] },
      { name: "Blue Team", cssClass: "blue-team-group", indices: [1, 3] },
    ];

    return (
      <div className="player-teams-container">
        {teams.map((team) => (
          <div key={team.name} className={`team-group ${team.cssClass}`}>
            <h2>{team.name}</h2>
            <div className="player-buttons-container">
              {team.indices.map((index) => {
                const roleLabel = index < 2 ? "Spymaster" : "Field Operative";
                const customStyle =
                  selectedPlayer === index
                    ? {
                        backgroundColor: team.cssClass.startsWith("red")
                          ? "red"
                          : "blue",
                      }
                    : {};

                return (
                  <div className="player-button-wrapper" key={index}>
                    <PlayerSelectButton
                      index={index}
                      selected={selectedPlayer === index}
                      label={roleLabel}
                      onSelect={handlePlayerSelect}
                      customStyle={customStyle}
                    />
                    <span className="player-label">
                      {selectedPlayer === index && username
                        ? username
                        : `Player ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
        <button onClick={handleStart} className="start-button" data-testid={"start-button"}>
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
