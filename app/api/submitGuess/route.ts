import Guess from '@/types/Guess'
import { createClient } from '@/utils/supabase/server'

type GameInfo = {
  Clue: {
    id: number
    remaining_guesses: number
  }
  team1_id: number
  team2_id: number
  board: any
}

// POST handler
export async function POST(req: Request) {
  // Get data from the client
  const { game_code, card_id, guessing_team_id } = (await req.json()) as Guess

  const supabase = await createClient()

  // Function that sets the winner of the game and then updates player stats
  // This is not performant and I know it but 
  // makes it so we don't have to use a hidden function in Supabase TAs can't see
  async function setWinner(winner_team_id: number) {
    // Updates the game
    await supabase.from('Game').update({ winner_team_id }).eq('game_code', game_code)
    
    // Updates player stats by getting the teams
    const { data: winningTeam } = await supabase
      .from('Player')
      .select('user_id')
      .eq('team_id', winner_team_id)
      .eq('game_code', game_code)
    const { data: losingTeam } = await supabase
      .from('Player')
      .select('user_id')
      .eq('team_id', winner_team_id === gameData?.team1_id ? gameData?.team2_id : gameData?.team1_id)
      .eq('game_code', game_code)

    // Updates winners stats
    if (winningTeam) {
      for (const player of winningTeam) {
        const { data: userData } = await supabase.from('User').select('wins').eq('id', player.user_id).single()
        if (userData) {
          await supabase
            .from('User')
            .update({ wins: userData.wins + 1 })
            .eq('id', player.user_id)
        }
      }
    }

    // Updates losers stats
    if (losingTeam) {
      for (const player of losingTeam) {
        const { data: userData } = await supabase.from('User').select('losses').eq('id', player.user_id).single()
        if (userData) {
          await supabase
            .from('User')
            .update({ losses: userData.losses + 1 })
            .eq('id', player.user_id)
        }
      }
    }
  }

  // Utility function to reduce a teams cards remaining on a guess of their card
  async function teamDecrementCardsRemaining(team_id: number) {
    const { data: teamData } = await supabase.from('Team').select().eq('id', team_id).single()
    if (teamData) {
      let cards_remaining = teamData.cards_remaining
      cards_remaining--
      if (cards_remaining <= 0) {
        await setWinner(guessing_team_id)
      } else {
        await supabase.from('Team').update({ cards_remaining }).eq('id', guessing_team_id)
      }
    }
  }

  // Utility function to switch team possession when needed
  async function changePossession(other_team_id: number) {
    const { data: playerData } = await supabase
      .from('Player')
      .select('id')
      .eq('team_id', other_team_id)
      .eq('is_guesser', false)
      .eq('game_code', game_code)
      .single()
    await supabase
      .from('Game')
      .update({ clue_id: null, selected_player_id: playerData?.id })
      .eq('game_code', game_code)
  }

  // Updates game to use new generated board
  async function updateBoard(board: any) {
    await supabase.from('Game').update({ board }).eq('game_code', game_code)
  }

  // Get the actual game data
  const { data: gameData } = await supabase
    .from('Game')
    .select(
      `
        Clue (id, remaining_guesses),
        team1_id, team2_id, board
        `
    )
    .eq('game_code', game_code)
    .returns<GameInfo[]>()
    .single()

  if (gameData) {
    // Weird ternary logic to find the other team's id
    const other_team_id = gameData.team1_id === guessing_team_id ? gameData.team2_id : gameData.team1_id

    const board = gameData.board
    const card = board[card_id]
    const clue = gameData.Clue
    let remaining_guesses = clue.remaining_guesses

    // Guard to make sure the client isn't sending  bad request
    if (card.guessed) {
      return new Response('Card Already Guessed', { status: 200 })
    }
    // Set it to guessed so the board can be updated
    card.guessed = true

    if (card.team_id) {
      if (card.team_id === guessing_team_id) {
        // Player guessed right
        await teamDecrementCardsRemaining(guessing_team_id)
        remaining_guesses--
        // If the team is out of guesses change to the other team
        if (remaining_guesses <= 0) {
          await changePossession(other_team_id)
        } else {
          await supabase.from('Clue').update({ remaining_guesses }).eq('id', clue.id)
        }
        await updateBoard(board)
        return new Response('Card was yours', { status: 200 })
      } else {
        // Player guessed for the wrong team
        await teamDecrementCardsRemaining(other_team_id)
        await changePossession(other_team_id)
        await updateBoard(board)
        return new Response('Card was for opposing team', { status: 200 })
      }
    }
    // Player guessed an assassin card
    else if (card.is_assassin) {
      // End the game by setting the game winner to the other team
      await setWinner(other_team_id)
      await updateBoard(board)
      return new Response('Card was assassin', { status: 200 })
    } else if (card.is_bystander) {
      // Player guessed a bystander card
      await changePossession(other_team_id)
      await updateBoard(board)
      return new Response('Card was bystander', { status: 200 })
    }
  }
}
