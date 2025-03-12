interface CardProps {
  word: string;
}

export default function Card({ word }: CardProps) {
  return (
    <div className="card">
        <button className="card-button">{word}</button>
    </div>
  );
}
