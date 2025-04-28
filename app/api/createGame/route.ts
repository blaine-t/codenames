import CreateGameJson from "@/types/createGameJson";
import { createClient } from "@/utils/supabase/server";

import { generate } from "random-words"

enum Allegiance {
    Blue = "blue",
    Red = "red",
    Bystander = "bystander",
    Assassin = "assassin"
}

// https://stackoverflow.com/a/2450976
function shuffle(array: any[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function generateBoard() {
    const words = generate({ minLength: 3, maxLength: 7, exactly: 25 }) as string[]
    const allegiances = [
        ...Array(8).fill(Allegiance.Blue),
        ...Array(7).fill(Allegiance.Red),
        ...Array(9).fill(Allegiance.Bystander),
        ...Array(1).fill(Allegiance.Assassin)
    ]
    shuffle(allegiances)

    const board = words.map((word, i) => {
        return {
            word,
            allegiance: allegiances[i],
            guessed: false
        }
    })

    return board
}

export async function POST(req: Request) {
    const supabase = await createClient()

    // Get data from the client
    const { game_code, team1_id, team2_id, turn_time } = await req.json() as CreateGameJson

    const board = generateBoard()

    const { error: upsertError } = await supabase.from("Game").upsert({
        team1_id,
        team2_id,
        board,
        turn_time,
        game_code
    }, { onConflict: "game_code" })

    if (upsertError) {
        console.error("Failed to insert/update game:", upsertError);
        return new Response("Failed to insert/update game", {status: 500});
      }

    return new Response(null, {
        status: 307,
        headers: {
            Location: `/protected/game?code=${game_code}`
        }
    });
}
