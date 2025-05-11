'use client'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import '../../globals.css'
import CardGrid from '@/components/game/cardGrid'
import TimeBox from '@/components/game/timeBox'
import RoleBox from '@/components/game/roleBox'
import StatusBox from '@/components/game/statusBox'
import Board from '@/types/Board'
import Clue from '@/types/Clue'
import PlayerData from '@/types/PlayerData'
import SelectedPlayer from '@/components/game/selectedPlayer'
import SkipTurnButton from '@/components/game/skipTurnButton'
import WinnerSplashScreen from '@/components/game/winnerSplashScreen'

function GameContent() {
  const searchParams = useSearchParams()
  const gameCode = searchParams.get('code') || ''

  const supabase = createClient()

  // A lot of different states for the game
  const [role, setRole] = useState<string | null>(null)
  const [team, setTeam] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<number | null>(null)
  const [turnTime, setTurnTime] = useState<number | null>(null)
  const [board, setBoard] = useState<Board[] | null>(null)
  const [clue, setClue] = useState<Clue | undefined>(undefined)
  const [isGuesser, setIsGuesser] = useState<boolean>(true)
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [players, setPlayers] = useState<PlayerData[] | null>(null)
  const [reset, setReset] = useState<boolean>(false)
  const [timerUp, setTimerUp] = useState<boolean>(false)
  const [winningTeam, setWinningTeam] = useState<string | null>(null)


  // On first render do some hydrating
  useEffect(() => {
    // Gets a bunch of game data
    const fetchGameData = async () => {
      const { data: gameData, error: gameError } = await supabase
        .from('Game')
        .select('selected_player_id, board, turn_time')
        .eq('game_code', gameCode)
        .single()
      
      // Set the states with the data
      setSelectedPlayerId(gameData?.selected_player_id)
      setBoard(gameData?.board)
      setTurnTime(gameData?.turn_time)
    }

    const fetchPlayerData = async () => {
      // Get the auth user first for the id
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        console.error('User not authenticated')
        return
      }

      // Then use the auth id to get the user id
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id')
        .eq('auth_id', authUser.id)
        .single()

      if (userError || !userData) {
        console.error('Failed to fetch internal user:', userError)
        return
      }

      // Then use the user id to get the player id
      const { data: playerData, error: playerError } = await supabase
        .from('Player')
        .select('id, team_id, is_guesser')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false })
        .single()

      if (playerError || !playerData) {
        console.error('Failed to fetch player data:', playerError)
        return
      }

      // Set the states with this new data
      setPlayerId(playerData.id)
      setIsGuesser(playerData.is_guesser)
      setTeamId(playerData.team_id)

      // Generate the role used in the game screen
      const readableRole = playerData.is_guesser ? 'Field Operative' : 'Spymaster'
      setRole(readableRole)

      // Grab game specific data like the board
      await fetchGameData()

      // Get the team name
      const { data: teamData, error: teamError } = await supabase
        .from('Team')
        .select('name')
        .eq('id', playerData.team_id)
        .single()

      if (teamError || !teamData) {
        console.error('Failed to fetch team name:', teamError)
        return
      }

      // Update the state with the name
      const readableTeam = teamData.name
      setTeam(readableTeam)

      // Get the 4 players in the game
      const { data: playersData } = await supabase
        .from('Player')
        .select(
          `
          id,
          User (username, image)
        `
        )
        .eq('game_code', gameCode)
        .returns<PlayerData[]>()
        .limit(4)

      // Update players for username and profile pic when they are the selected player
      setPlayers(playersData)
    }

    fetchPlayerData()
  }, [])

  // Enable netcode for handling when game state changes
  useEffect(() => {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        // When Game has an update to it's DB table get the new information
        {
          event: '*',
          schema: 'public',
          table: 'Game',
          filter: `game_code=eq.${gameCode}`,
        },
        async (payload) => {
          // Update the board
          if (payload.new && 'board' in payload.new) {
            setBoard(payload.new.board as Board[])
          }

          // Update the selected player
          if (payload.new && 'selected_player_id' in payload.new) {
            setSelectedPlayerId(payload.new.selected_player_id)
          }

          // Update the clue
          if (payload.new && 'clue_id' in payload.new && payload.new.clue_id) {
            const { data: clueRecord } = await supabase
              .from('Clue')
              .select('phrase, count, remaining_guesses')
              .eq('id', payload.new.clue_id)
              .single()
            setClue(clueRecord as Clue)
          } else {
            // If there's no clue in the game make sure it gets cleared out
            setClue(undefined)
          }

          // If a team one update the winning team for the pop up
          if (payload.new && 'winner_team_id' in payload.new && payload.new.winner_team_id) {
            const { data: teamRecord } = await supabase
              .from('Team')
              .select('name')
              .eq('id', payload.new.winner_team_id)
              .single()
            setWinningTeam(teamRecord?.name)
          }
        }
      )
      .subscribe()
  }, [])

  // Weird way to force rerender of timer on player change
  useEffect(() => {
    setReset(true)
  }, [selectedPlayerId])

  // When the timer runs out the timer component sends state up and we need to act on it
  useEffect(() => {
    const sendTimerUp = async () => {
      // Only send the request if you are the selected player
      if (selectedPlayerId === playerId) {
        const data = {
          game_code: gameCode,
          player_id: playerId,
          guessing_team_id: teamId,
        }
        // Send the API request
        await fetch('/api/timerUp', {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(data),
        })
      }
    }
    // Reset the timerUp
    if (timerUp) {
      setTimerUp(false)
      sendTimerUp()
    }
  }, [timerUp])

  // Generic handleClick for all of the cards. Uses id to discern which card is which
  function handleClick(id: number) {
    const sendGuess = async () => {
      // Gather data needed for API call
      const data = {
        game_code: gameCode,
        card_id: id,
        guessing_team_id: teamId,
      }

      // Make the API call to submit the guess
      await fetch('/api/submitGuess', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
      })
    }
    sendGuess()
  }

  // Custom function to submit the clue for the spymaster
  function submitClue(event: React.FormEvent<HTMLFormElement>) {
    // Eat the normal form event
    event.preventDefault()

    const sendClue = async () => {
      // Extract the data from the event
      const form = event.currentTarget as HTMLFormElement
      const data = {
        game_code: gameCode,
        player_id: playerId,
        phrase: (form.elements.namedItem('phrase') as HTMLInputElement).value,
        count: parseInt((form.elements.namedItem('count') as HTMLInputElement).value),
      }

      // Send the clue to the API
      await fetch('/api/submitClue', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
      })
    }
    sendClue()
  }

  // Layout of the game with all of its components
  return (
    <>
      {/* Only renders when winningTeam is not null */}
      <WinnerSplashScreen winningTeam={winningTeam} />
      {/* Handle all of the timer stuff */}
      <TimeBox seconds={turnTime} reset={reset} setReset={setReset} setTimerUp={setTimerUp} />
      <div className="table">
        {/* Shows which role you are and on which team */}
        <RoleBox role={`${role} (${team})`} />
        {/* Shows all the cards in the game */}
        <CardGrid
          isGuesser={isGuesser}
          board={board}
          handleClick={handleClick}
          isSelected={selectedPlayerId === playerId}
        />
        <div className="bottomWrapper">
          {/* Shows the currently selected player */}
          <SelectedPlayer selectedPlayer={players?.find((x) => x.id === selectedPlayerId)} />
          {/* Shows the status of the game, and allow spymasters to submit a clue */}
          <StatusBox
            clue={clue}
            isGuesser={isGuesser}
            needClue={selectedPlayerId === playerId && !isGuesser}
            submitClue={submitClue}
          />
          {/* Allows the guesser to skip their turn. Thanks Smores! */}
          <SkipTurnButton isSelected={selectedPlayerId === playerId} isGuesser={isGuesser} setTimerUp={setTimerUp} />
        </div>
      </div>
    </>
  )
}

// Suspense to fix build errors
export default function GamePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent />
    </Suspense>
  )
}
