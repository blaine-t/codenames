import Guess from "@/types/Guess";

import { createClient } from "@/utils/supabase/server";

type GameInfo = {
    Clue: {
        id: number;
        remaining_guesses: number;
    };
    team1_id: number;
    team2_id: number;
    board: any
};


export async function POST(req: Request) {
    const { game_code, card_id, guessing_team_id } = await req.json() as Guess

    const supabase = await createClient()

    async function setWinner(winner_team_id: number) {
        const { data: updatedGame } = await supabase.from("Game").update({ winner_team_id }).eq("game_code", game_code);
    }

    async function teamDecrementCardsRemaining(team_id: number) {
        const { data: teamData } = await supabase.from("Team").select().eq("id", team_id).single()
        if (teamData) {
            let cards_remaining = teamData.cards_remaining
            cards_remaining--
            if (cards_remaining <= 0) {
                await setWinner(guessing_team_id)
            } else {
                await supabase.from("Team").update({ cards_remaining }).eq("id", guessing_team_id)
            }
        }
    }

    async function changePossession(other_team_id: number) {
        const { data: playerData } = await supabase.from("Player")
            .select("id")
            .eq("team_id", other_team_id)
            .eq("is_guesser", false)
            .eq("game_code", game_code)
            .single()
        const {data: updatedGame } = await supabase.from("Game").update({ clue_id: null, selected_player_id: playerData?.id })
    }

    async function updateBoard(board: any) {
        const { data: updatedGame } = await supabase.from("Game").update({ board }).eq("game_code", game_code)
    }

    const { data: gameData } = await supabase.from("Game").select(`
        Clue (id, remaining_guesses),
        team1_id, team2_id, board
        `).eq("game_code", game_code).returns<GameInfo[]>().single()

    if (gameData) {
        const other_team_id = gameData.team1_id === guessing_team_id ? gameData.team2_id : gameData.team1_id

        const board = gameData.board
        const card = board[card_id]
        const clue = gameData.Clue
        let remaining_guesses = clue.remaining_guesses

        if (card.guessed) {
            return new Response("Card Already Guessed", { status: 200 });
        }
        // Set it to guessed so the board can be updated
        card.guessed = true

        if (card.team_id) {
            // Player guessed right
            if (card.team_id === guessing_team_id) {
                await teamDecrementCardsRemaining(guessing_team_id)
                remaining_guesses--
                if (remaining_guesses <= 0) {
                    await changePossession(other_team_id)
                } else {
                    await supabase.from("Clue").update({ remaining_guesses }).eq("id", clue.id)
                }
            }
            await updateBoard(board)
            return new Response("Card was yours", {status: 200 })
        }
        // Player guessed an assassin card
        else if (card.is_assassin) {
            // End the game by setting the game winner to the other team
            await setWinner(other_team_id)
            await updateBoard(board)
            return new Response("Card was assassin", {status: 200 })
        } else if (card.is_bystander) {
            await changePossession(other_team_id)
            await updateBoard(board)
            return new Response("Card was bystander", {status: 200 })
        } else {
            // Player guessed for the wrong team
            await teamDecrementCardsRemaining(other_team_id)
            await changePossession(other_team_id)
            await updateBoard(board)
            return new Response("Card was for opposing team", {status: 200 })
        }
    }
}
