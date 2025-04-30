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

  useEffect(() => {
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
        .select("team_id, is_guesser")
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

      setRole(readableRole);
      setTeam(readableTeam);
      setTeamId(playerData.team_id)
    };

    fetchPlayerData();
  }, []);

  useEffect(() => {
    const fetchGameData = async () => {
      const { data: gameData, error: gameError } = await supabase
        .from("Game")
        .select("board, turn_time")
        .eq("game_code", gameCode)
        .single();

      setBoard(gameData?.board);
      setTurnTime(gameData?.turn_time);
    };
    fetchGameData();
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

  return (
    <>
      <TimeBox seconds={turnTime} />
      <div className="table">
        <RoleBox role={`${role} (${team})`} />
        <CardGrid isGuesser={role === 'Field Operative'} board={board} handleClick={handleClick} />
        <StatusBox clue={clue} />
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
