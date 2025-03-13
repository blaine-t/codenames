import styles from './TimeBox.module.css';

interface TimeBoxProps {
  seconds: number;
}

export default function Card({ seconds }: TimeBoxProps) {
  // God forgive me for I have sinned
  const minutes = (seconds / 60).toString()[0]
  seconds = seconds % 60
  let displaySeconds = (seconds % 60).toString()
  if (seconds < 10) {
    displaySeconds = "0" + displaySeconds
  }
  return (
    <div className={styles.box}>
        <h1>{minutes}:{displaySeconds}</h1>
    </div>
  );
}
