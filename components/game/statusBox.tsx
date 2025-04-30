import Clue from '@/types/Clue';
import styles from './StatusBox.module.css';

interface RoleBoxProps {
  clue?: Clue;
  isGuesser: boolean;
  needClue: boolean;
  submitClue: any;
}

export default function StatusBox({ clue, isGuesser, needClue, submitClue }: RoleBoxProps) {
  return (
    <div className={styles.box}>
      {(clue) ? <>
        <h1>HINT: {clue.phrase.toUpperCase()} - {clue.count}</h1>
        <h1>GUESSES LEFT - {clue.remaining_guesses}</h1>
      </> : 
      (!isGuesser && needClue) ? <form onSubmit={submitClue} className={styles.inputContainer}>
        <div className={styles.wrapper}>
        <label className={styles.label}>Hint</label>
        <input type='text' className={styles.textInput} name='phrase'></input>
        </div>
        <div className={styles.wrapper}>
        <label className={styles.label}>Count</label>
        <input className={styles.numberInput} type='number' name='count'></input>
        </div>
        <button type='submit'>Submit</button>
      </form> : 
      <h1>Waiting for clue...</h1>
      }
    </div>
  );
}
