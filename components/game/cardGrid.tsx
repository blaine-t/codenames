import styles from './CardGrid.module.css';
import Card from "./card";

export default function CardGrid() {
    return (
        <div className={styles.cardGrid}>
            <Card word="Pool" />
            {Array.from({ length: 24 }).map((_, index) => (
            <Card key={index} word={`Card ${index + 1}`} />
            ))}
        </div>
    );
  }
  