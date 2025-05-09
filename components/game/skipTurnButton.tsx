import styles from './skipTurnButton.module.css'

interface skipTurnButtonProps {
  isSelected: boolean
  isGuesser: boolean
  setTimerUp: any
}

export default function SkipTurnButton({ isSelected, isGuesser, setTimerUp }: skipTurnButtonProps) {
    return (
        <>
            {isSelected && isGuesser && <button onClick={() => setTimerUp(true)} className={styles.skipTurnButton}>Skip Turn</button>}
        </>
    )
}
