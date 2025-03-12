import Card from "./card";

export default function CardGrid() {
    return (
        <div className="card-grid">
            {Array.from({ length: 25 }).map((_, index) => (
            <Card key={index} word={`Card ${index + 1}`} />
            ))}
        </div>
    );
  }
  