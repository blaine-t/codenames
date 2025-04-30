"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import "../../globals.css";
import CardGrid from "@/components/game/cardGrid";
import TimeBox from "@/components/game/timeBox";
import RoleBox from "@/components/game/roleBox";
import StatusBox from "@/components/game/statusBox";
import Board from "@/types/Board";
import Clue from "@/types/Clue";

function GameContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams.get("code") || "";

  const supabase = createClient();

  const [role, setRole] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [turnTime, setTurnTime] = useState<number | null>(null);
  const [board, setBoard] = useState<Board[] | null>(null);
  const [clue, setClue] = useState<Clue | undefined>(undefined);
  const [isGuesser, setIsGuesser] = useState<boolean>(true);
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  useEffect(() => {
    const fetchGameData = async (playerIdCurrent: number) => {
      const { data: gameData, error: gameError } = await supabase
        .from("Game")
        .select("selected_player_id, board, turn_time")
        .eq("game_code", gameCode)
        .single();
      setSelectedPlayerId(gameData?.selected_player_id)
      setBoard(gameData?.board);
      setTurnTime(gameData?.turn_time);
    };

    const fetchPlayerData = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("User not authenticated");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("id")
        .eq("auth_id", authUser.id)
        .single();

      if (userError || !userData) {
        console.error("Failed to fetch internal user:", userError);
        return;
      }

      const { data: playerData, error: playerError } = await supabase
        .from("Player")
        .select("id, team_id, is_guesser")
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false })
        .single();

      if (playerError || !playerData) {
        console.error("Failed to fetch player data:", playerError);
        return;
      }

      const { data: teamData, error: teamError } = await supabase
        .from("Team")
        .select("name")
        .eq("id", playerData.team_id)
        .single();

      if (teamError || !teamData) {
        console.error("Failed to fetch team name:", teamError);
        return;
      }

      const readableRole = playerData.is_guesser
        ? "Field Operative"
        : "Spymaster";
      const readableTeam = teamData.name;

      setPlayerId(playerData.id)
      setIsGuesser(playerData.is_guesser)
      setRole(readableRole)
      setTeam(readableTeam)
      setTeamId(playerData.team_id)
      await fetchGameData(playerData.id);
    };

    fetchPlayerData();
  }, []);
  // Enable netcode for handling when game state changes
  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Game",
          filter: `game_code=eq.${gameCode}`,
        },
        async (payload) => {
          if (payload.new && 'board' in payload.new) {
            setBoard(payload.new.board as Board[])
          }

          if (payload.new && 'clue_id' in payload.new && payload.new.clue_id) {
            const { data: clueRecord } = await supabase
              .from("Clue")
              .select('phrase, count, remaining_guesses')
              .eq("id", payload.new.clue_id)
              .single()
            setClue(clueRecord as Clue)
          } else {
            setClue(undefined)
          }

          if (payload.new && 'selected_player_id' in payload.new) {
            setSelectedPlayerId(payload.new.selected_player_id)
          }
        }
      )
      .subscribe();
  }, []);

  function handleClick(id: number) {
    const sendGuess = async () => {
      const data = {
        game_code: gameCode,
        card_id: id,
        guessing_team_id: teamId
      }
      await fetch("/api/submitGuess", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
      });
    }
    sendGuess()
  }

  function submitClue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sendClue = async () => {
      const form = event.currentTarget as HTMLFormElement;
      const data = {
        game_code: gameCode,
        player_id: playerId,
        phrase: (form.elements.namedItem('phrase') as HTMLInputElement).value,
        count: parseInt((form.elements.namedItem('count') as HTMLInputElement).value)
      }
      await fetch("/api/submitClue", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data)
      })
    }
    sendClue()
  }

  return (
    <>
      <TimeBox seconds={turnTime} />
      <div className="table">
        <RoleBox role={`${role} (${team})`} />
        <CardGrid isGuesser={isGuesser} board={board} handleClick={handleClick} />
        <StatusBox clue={clue} isGuesser={isGuesser} needClue={selectedPlayerId === playerId && !isGuesser} submitClue={submitClue} />
      </div>
    </>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
