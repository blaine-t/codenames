import styles from './StatusBox.module.css';

interface RoleBoxProps {
  clue: string;
  guesses: number;
  guessesLeft: number;
}

export default function StatusBox({ clue, guesses, guessesLeft }: RoleBoxProps) {
  
  return (
    <div className={styles.box}>
        <h1>HINT: {clue.toUpperCase()} - {guesses}</h1>
        <h1>GUESSES LEFT - {guessesLeft}</h1>
    </div>
  );
}
