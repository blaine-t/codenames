import TimerUpRequest from '@/types/TimerUpRequest'
import { createClient } from '@/utils/supabase/server'

type GameData = {
  team1_id: number
  team2_id: number
  selected_player_id: number
}

export async function POST(req: Request) {
  // What is a DRY principle?
  const { game_code, player_id, guessing_team_id } = (await req.json()) as TimerUpRequest

  const supabase = await createClient()

  async function changePossession(other_team_id: number) {
    const { data: playerData } = await supabase
      .from('Player')
      .select('id')
      .eq('team_id', other_team_id)
      .eq('is_guesser', false)
      .eq('game_code', game_code)
      .single()
    const { data: updatedGame } = await supabase
      .from('Game')
      .update({ clue_id: null, selected_player_id: playerData?.id })
      .eq('game_code', game_code)
  }

  const { data: gameData } = await supabase
    .from('Game')
    .select(
      `
        team1_id, team2_id, selected_player_id
        `
    )
    .eq('game_code', game_code)
    .returns<GameData[]>()
    .single()

  if (gameData && gameData.selected_player_id === player_id) {
    const other_team_id = gameData.team1_id === guessing_team_id ? gameData.team2_id : gameData.team1_id
    await changePossession(other_team_id)
    return new Response('Time was up, switched to other team', { status: 200 })
  }
  return new Response('Unknown error', { status: 400 })
}
