import styles from './Card.module.css';

interface CardProps {
  word: string;
}

export default function Card({ word }: CardProps) {
  return (
    <div className={styles.card}>
        <button className={styles.cardButton}>{word}</button>
    </div>
  );
}
