import NewClue from "@/types/NewClue";

import { createClient } from "@/utils/supabase/server";

type PlayerInfo = {
    Player: {
        id: number;
        team_id: number;
        is_guesser: boolean;
    };
};

export async function POST(req: Request) {
    const { game_code, player_id, phrase, count } = await req.json() as NewClue

    const supabase = await createClient()

    const { data: gameData } = await supabase.from("Game").select('Player (id, team_id, is_guesser)').eq("game_code", game_code).returns<PlayerInfo[]>().single()

    if (gameData) {
        const player = gameData.Player
        if (!player.is_guesser && player.id === player_id) {
            const remaining_guesses = count + 1
            const { data: clueData } = await supabase.from("Clue").insert({ phrase, count, remaining_guesses }).select("id").single()
            if (clueData) {
                // We need to update the selected_player_id to equal the guesser for that team
                const { data: playerData } = await supabase.from("Player")
                    .select("id")
                    .eq("team_id", player.team_id)
                    .eq("is_guesser", true)
                    .eq("game_code", game_code)
                    .single()
                if (playerData) {
                    const selected_player_id = playerData.id
                    const clue_id = clueData.id
                    const { data: updatedGame } = await supabase.from("Game").update({ selected_player_id, clue_id }).eq("game_code", game_code)
                }
            }
            return new Response("Your clue has been given", { status: 200 })
        } else {
            return new Response("You are playing out of turn", { status: 401 })
        }
    }
}
