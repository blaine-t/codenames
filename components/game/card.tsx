import styles from './Card.module.css';

interface CardProps {
  handleClick: any;
  id: number;
  word: string;
  covered: boolean;
  role?: string;
}

export default function Card({ handleClick, id, word, covered, role="" }: CardProps) {

  let roleStyle = ""
  let textHint = ""
  switch (role) {
    case 'Red':
      roleStyle = styles.red
      textHint = "R"
      break
    case 'Blue':
      roleStyle = styles.blue
      textHint = "B"
      break
    case 'Assassin':
      roleStyle = styles.assassin
      textHint = "A"
      break
    case 'Bystander':
      roleStyle = styles.bystander
      textHint = "I"
      break
    default:
      roleStyle = ""
      textHint = ""
      break
  }

  const coveredStyle = covered ? styles.covered : ""
  return (
    <div onClick={!covered ? () => handleClick(id) : () => {}} className={[styles.card, roleStyle, coveredStyle].join(" ")}>
        {textHint !== "" && <p className={styles.textHint}>{textHint}</p>}
        <div className={[styles.cardButton, roleStyle, coveredStyle].join(" ")}>{word}</div>
    </div>
  );
}
