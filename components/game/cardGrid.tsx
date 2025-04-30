import Board from '@/types/Board';
import styles from './CardGrid.module.css';
import Card from "./card";

interface CardGridProps {
    isGuesser: boolean;
    board: Board[] | null;
    handleClick: any;
}

export default function CardGrid({ isGuesser, board, handleClick }: CardGridProps) {
    return (
        <div className={styles.cardGrid}>
            {board?.map((card, id) => {
                let role = ""
                if (!isGuesser || card.guessed) {
                    if (card.team_id === 1) {
                        role = "Red"
                    } else if (card.team_id === 2) {
                        role = "Blue"
                    } else if (card.is_assassin) {
                        role = "Assassin"
                    } else if (card.is_bystander) {
                        role = "Bystander"
                    }
                }
                let covered = card.guessed
                return (
                    <Card handleClick={handleClick} key={id} id={id} word={card.word} role={role} covered={covered} />
                )
            })}
        </div>
    );
}
