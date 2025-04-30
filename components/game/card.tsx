import styles from './Card.module.css';

interface CardProps {
  handleClick: any;
  id: number;
  word: string;
}

export default function Card({ handleClick, id, word }: CardProps) {

  return (
    <div onClick={() => handleClick(id)} className={styles.card}>
        <button className={styles.cardButton}>{word}</button>
    </div>
  );
}
