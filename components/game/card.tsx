import styles from './Card.module.css';

interface CardProps {
  handleClick: any;
  id: number;
  word: string;
  role?: string;
}

export default function Card({ handleClick, id, word, role="" }: CardProps) {

  let roleStyle = ""
  let textHint = ""
  switch (role) {
    case 'Red':
      roleStyle = styles.red
      textHint = "Y"
      break
    case 'Blue':
      roleStyle = styles.blue
      textHint = "O"
      break
    case 'Assassin':
      roleStyle = styles.assassin
      textHint = "A"
      break
    case 'Bystander':
      roleStyle = styles.bystander
      textHint = "B"
      break
    default:
      roleStyle = ""
      textHint = ""
      break
  }

  return (
    <div onClick={() => handleClick(id)} className={[styles.card, roleStyle].join(" ")}>
        {textHint !== "" && <p className={styles.textHint}>{textHint}</p>}
        <button className={styles.cardButton}>{word}</button>
    </div>
  );
}
