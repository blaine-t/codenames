interface CardProps {
  word: string;
}

export default function Card({ word }: CardProps) {
  return (
    <button className="card">{word}</button>
  );
}
