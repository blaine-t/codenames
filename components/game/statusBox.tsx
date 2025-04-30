import Clue from '@/types/Clue';
import styles from './StatusBox.module.css';

interface RoleBoxProps {
  clue?: Clue;
}

export default function StatusBox({ clue }: RoleBoxProps) {

  return (
    <div className={styles.box}>
      {(clue) ? <>
        <h1>HINT: {clue.phrase.toUpperCase()} - {clue.count}</h1>
        <h1>GUESSES LEFT - {clue.remaining_guesses}</h1>
      </> : <h1>Waiting for clue...</h1>
      }
    </div>
  );
}
