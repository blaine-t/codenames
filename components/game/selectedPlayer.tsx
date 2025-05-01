import PlayerData from '@/types/PlayerData'
import styles from './selectedPlayer.module.css'

interface SelectedPlayerProps {
  selectedPlayer?: PlayerData
}

export default function SelectedPlayer({ selectedPlayer }: SelectedPlayerProps) {
  if (!selectedPlayer) {
    return
  }

  const username = selectedPlayer.User.username
  const pfp = selectedPlayer.User.image

  return (
    <div className={styles.selectedPlayer}>
      <h1>{username}</h1>
      {pfp && <img src={pfp} alt={`${username}'s profile`} />}
    </div>
  )
}
