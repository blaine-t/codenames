"use client"
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import "../../globals.css";
import CardGrid from "@/components/game/cardGrid";
import TimeBox from "@/components/game/timeBox";
import RoleBox from "@/components/game/roleBox";
import StatusBox from "@/components/game/statusBox";

export default function GamePage() {
  const [role, setRole] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerData = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("Player")
        .select("team_id, is_guesser")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.error("Failed to fetch player data:", error);
        return;
      }

      setRole(data.is_guesser);
      setTeam(data.team_id);
      setLoading(false);
    };

    fetchPlayerData();
  }, []);

  if (loading || !role || !team) {
    return <div>Loading role and team...</div>;
  }

  return (
    <>
      <TimeBox seconds={90} />
      <div className="table">
        <RoleBox role={`${role} (${team})`} />
        <CardGrid />
        <StatusBox clue="green" guesses={5} guessesLeft={6} />
      </div>
    </>
  );
}
