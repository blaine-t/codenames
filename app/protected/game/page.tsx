"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import "../../globals.css";
import CardGrid from "@/components/game/cardGrid";
import TimeBox from "@/components/game/timeBox";
import RoleBox from "@/components/game/roleBox";
import StatusBox from "@/components/game/statusBox";

type board = {
  word: string;
  allegiance: any;
  guessed: boolean;
};

function GameContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams.get("code") || "";

  const supabase = createClient();

  const [role, setRole] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [turnTime, setTurnTime] = useState<number | null>(null);
  const [board, setBoard] = useState<board | null>(null);

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
  });

  return (
    <>
      <TimeBox seconds={turnTime} />
      <div className="table">
        <RoleBox role={`${role} (${team})`} />
        <CardGrid />
        <StatusBox clue="green" guesses={5} guessesLeft={6} />
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
