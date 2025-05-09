'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import '../../globals.css'
import { createClient } from '@/utils/supabase/client'
import CreateGameJson from '@/types/CreateGameJson'
import { InviteFriendsPopup } from '@/components/InviteFriendsPopup'
import { RulesPopup } from '@/components/RulesPopup'

function TitleImage({ gameCode }: { gameCode: string }) {
  return (
    <div className="title-image-container">
      <Image src="/codenameslogo.png" alt="Codenames Logo" width={300} height={80} />
      <div className="game-code">
        <span className="game-code-label">Game code:</span>
        <span>{gameCode}</span>
      </div>
    </div>
  )
}

type PlayerInfo = {
  User: {
    username: string
    image: string | null
  } | null
  Team: {
    id: number
    name: string
  } | null
  is_guesser: boolean
}

type PlayerSelectButtonProps = {
  index: number
  selected: boolean
  label: string
  onSelect: (index: number) => void
  customStyle?: React.CSSProperties
}

const PlayerSelectButton: React.FC<PlayerSelectButtonProps> = ({
  index,
  selected,
  label,
  onSelect,
  customStyle = {},
}) => {
  return (
    <button
      onClick={() => onSelect(index)}
      className={`player-select-button ${selected ? 'selected' : ''}`}
      style={customStyle}
    >
      {label}
    </button>
  )
}

function CodenamesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const gameCode = searchParams.get('code') || ''

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [turnTime, setTurnTime] = useState<number>(60)
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3', 'Player 4'])
  const [selectedRoles, setSelectedRoles] = useState<boolean[]>([false, false, false, false])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showFriendsList, setShowFriendsList] = useState(false)
  const [showRules, setShowRules] = useState(false)

  const supabase = createClient()

  // Fetch initial player roles
  useEffect(() => {
    const fetchInitialRoles = async () => {
      const { data: playerRecord } = await supabase
        .from('Player')
        .select(
          `
          User (username, image),
          Team (id, name),
          is_guesser
        `
        )
        .eq('game_code', gameCode)
        .returns<PlayerInfo[]>()
        .limit(4)

      const playersTemp = ['Player 1', 'Player 2', 'Player 3', 'Player 4']
      const newSelectedRoles = [false, false, false, false]

      playerRecord?.forEach((player) => {
        if (player.Team?.id === 1) {
          if (!player.is_guesser) {
            playersTemp[0] = player.User?.username || 'Player 1'
            newSelectedRoles[0] = true
          } else {
            playersTemp[2] = player.User?.username || 'Player 3'
            newSelectedRoles[2] = true
          }
        } else if (player.Team?.id === 2) {
          if (!player.is_guesser) {
            playersTemp[1] = player.User?.username || 'Player 2'
            newSelectedRoles[1] = true
          } else {
            playersTemp[3] = player.User?.username || 'Player 4'
            newSelectedRoles[3] = true
          }
        }
      })

      setPlayers(playersTemp)
      setSelectedRoles(newSelectedRoles)
    }

    fetchInitialRoles()
  }, [gameCode])

  // Enable netcode for checking if the game has been started
  useEffect(() => {
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Game',
          filter: `game_code=eq.${gameCode}`,
        },
        () => {
          router.push(`/protected/game?code=${gameCode}`)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Player',
          filter: `game_code=eq.${gameCode}`,
        },
        async () => {
          const { data: playerRecord } = await supabase
            .from('Player')
            .select(
              `
              User (username, image),
              Team (id, name),
              is_guesser
            `
            )
            .eq('game_code', gameCode)
            .returns<PlayerInfo[]>()
            .limit(4)

          const playersTemp = ['Player 1', 'Player 2', 'Player 3', 'Player 4']
          const newSelectedRoles = [false, false, false, false]

          playerRecord?.forEach((player) => {
            if (player.Team?.id === 1) {
              if (!player.is_guesser) {
                playersTemp[0] = player.User?.username || 'Player 1'
                newSelectedRoles[0] = true
              } else {
                playersTemp[2] = player.User?.username || 'Player 3'
                newSelectedRoles[2] = true
              }
            } else if (player.Team?.id === 2) {
              if (!player.is_guesser) {
                playersTemp[1] = player.User?.username || 'Player 2'
                newSelectedRoles[1] = true
              } else {
                playersTemp[3] = player.User?.username || 'Player 4'
                newSelectedRoles[3] = true
              }
            }
          })

          setPlayers(playersTemp)
          setSelectedRoles(newSelectedRoles)
        }
      )
      .subscribe()
  }, [])

  // Hide scrollbars
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = orig
    }
  }, [])

  // Fetch current user's username once on mount
  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !authUser) return console.error('Auth error', authError)

      const { data: userRecord, error: userError } = await supabase
        .from('User')
        .select('username')
        .eq('auth_id', authUser.id)
        .single()

      if (userError || !userRecord) return console.error('Fetch username error', userError)
      setUsername(userRecord.username)
    }
    fetchUsername()
  }, [])

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        console.error('User not authenticated:', authError)
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('id')
        .eq('auth_id', authUser.id)
        .limit(1)
        .single()

      setUserId(userData?.id)
    }
    getUserId()
  })

  const handlePlayerSelect = (index: number) => {
    // Don't allow selection if the role is already taken
    if (selectedRoles[index]) {
      return
    }
    setSelectedPlayer((prev) => (prev === index ? null : index))
  }

  const handleGameStart = async () => {
    // Check if all roles are filled
    // https://stackoverflow.com/a/53897696
    if (!selectedRoles.every(Boolean)) {
      setErrorMessage('Please select all roles before starting the game.')
      return
    }

    const data: CreateGameJson = {
      game_code: parseInt(gameCode),
      team1_id: 1,
      team2_id: 2,
      turn_time: turnTime,
    }
    await fetch('/api/createGame', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
    })
  }

  useEffect(() => {
    const updatePlayer = async () => {
      if (selectedPlayer === null) return

      const role = selectedPlayer >= 2 // false = Spymaster, true = Operative
      const teamName = selectedPlayer % 2 === 1 ? 'blue' : 'red'

      // Get ID from teamName
      const { data: teamData, error: teamError } = await supabase
        .from('Team')
        .select('id, name')
        .ilike('name', teamName)

      if (teamError) {
        console.error('Team fetch error:', teamError)
        return
      }

      if (!teamData || teamData.length === 0) {
        console.error('No team found for name:', teamName)
        return
      }

      const teamId = teamData[0].id

      const { error: upsertError } = await supabase.from('Player').upsert(
        {
          user_id: userId,
          game_code: gameCode,
          is_guesser: role,
          team_id: teamId,
        },
        { onConflict: 'user_id' }
      )

      if (upsertError) {
        console.error('Failed to update player:', upsertError)
        return
      }
    }
    updatePlayer()
  }, [selectedPlayer])

  const renderPlayerButtons = () => {
    const teams = [
      { name: 'Red Team', cssClass: 'red-team-group', indices: [0, 2] },
      { name: 'Blue Team', cssClass: 'blue-team-group', indices: [1, 3] },
    ]

    return (
      <div className="player-teams-container">
        {teams.map((team) => (
          <div key={team.name} className={`team-group ${team.cssClass}`}>
            <h2>{team.name}</h2>
            <div className="player-buttons-container">
              {team.indices.map((index) => {
                const roleLabel = index < 2 ? 'Spymaster' : 'Field Operative'
                const customStyle = selectedRoles[index]
                  ? {
                      backgroundColor: team.cssClass.startsWith('red') ? 'red' : 'blue',
                    }
                  : {}

                return (
                  <div className="player-button-wrapper" key={index}>
                    <PlayerSelectButton
                      index={index}
                      selected={selectedRoles[index]}
                      label={roleLabel}
                      onSelect={handlePlayerSelect}
                      customStyle={customStyle}
                    />
                    <span className="player-label">{players[index]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="main-container">
      <TitleImage gameCode={gameCode} />
      {renderPlayerButtons()}
      <div className="turn-time">
        <span className="turn-time-label">Seconds per turn:</span>
        <input
          type="number"
          min="1"
          max="1000"
          value={turnTime}
          className="turn-time-input"
          onChange={(e) => setTurnTime(parseInt(e.target.value))}
        />
      </div>
      <div className="start-button-container">
        <button onClick={handleGameStart} className="start-button" data-testid={'start-button'}>
          Start
        </button>
      </div>
      {errorMessage && (
        <div className="error-popup">
          <div className="error-popup-content">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Close</button>
          </div>
        </div>
      )}
      <div className="flex flex-col mt-4 space-y-2">
        <button onClick={() => setShowFriendsList(true)} className="invite-friends-toggle">
          📨 Invite Friends
        </button>
        <button onClick={() => setShowRules(!showRules)} className="invite-friends-toggle">
          {showRules ? "📖 Hide Rules" : "📖 Show Rules"}
        </button>
      </div>
      {showFriendsList && <InviteFriendsPopup gameCode={gameCode} onClose={() => setShowFriendsList(false)} />}

      {showRules && <RulesPopup />}
    </div>
  )
}

export default function CodenamesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CodenamesPageContent />
    </Suspense>
  )
}
