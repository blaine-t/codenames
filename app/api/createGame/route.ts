import CreateGameJson from '@/types/CreateGameJson'
import { createClient } from '@/utils/supabase/server'

import { generate } from 'random-words'

const CARDS_TEAM1 = 9
const CARDS_TEAM2 = 8

// https://stackoverflow.com/a/2450976
function shuffle(array: any[]) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}

// Generates the board json for the game
function generateBoard(team1_id: number, team2_id: number) {
  const words = generate({
    minLength: 3,
    maxLength: 7,
    exactly: 25,
  }) as string[]
  const team_ids = [
    ...Array(CARDS_TEAM1).fill(team1_id),
    ...Array(CARDS_TEAM2).fill(team2_id),
    // Bystander
    ...Array(9).fill(0),
    // Assassin
    ...Array(1).fill(-1),
  ]
  shuffle(team_ids)

  const board = words.map((word, i) => {
    return {
      word,
      // Give team_id if is real team otherwise parse different
      team_id: team_ids[i] > 0 ? team_ids[i] : null,
      is_bystander: team_ids[i] === 0,
      is_assassin: team_ids[i] === -1,
      guessed: false,
    }
  })

  return board
}

// POST handler
export async function POST(req: Request) {
  // Get data from the client
  const { game_code, team1_id, team2_id, turn_time } = (await req.json()) as CreateGameJson
  
  const supabase = await createClient()
  
  // Get information for the game
  const board = generateBoard(team1_id, team2_id)

  const { data: playerData } = await supabase
    .from('Player')
    .select('id')
    .eq('team_id', team1_id)
    .eq('is_guesser', false)
    .eq('game_code', game_code)
    .single()
  const selected_player_id = playerData?.id

  // Create the game
  const { error: upsertError } = await supabase.from('Game').upsert(
    {
      selected_player_id,
      team1_id,
      team2_id,
      board,
      turn_time,
      game_code,
    },
    { onConflict: 'game_code' }
  )

  if (upsertError) {
    console.error('Failed to insert/update game:', upsertError)
    return new Response('Failed to insert/update game', { status: 500 })
  }

  // Update the taems cards left
  await supabase.from('Team').update({ cards_remaining: CARDS_TEAM1 }).eq('id', team1_id)
  await supabase.from('Team').update({ cards_remaining: CARDS_TEAM2 }).eq('id', team2_id)

  // Tell the client to redirect to the game page with a temporary redirect
  return new Response(null, {
    status: 307,
    headers: {
      Location: `/protected/game?code=${game_code}`,
    },
  })
}
