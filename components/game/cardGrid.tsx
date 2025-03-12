import Card from "./card";

export default function CardGrid() {
    return (
        <div className="card-grid">
            <Card word="Pool" />
            {Array.from({ length: 24 }).map((_, index) => (
            <Card key={index} word={`Card ${index + 1}`} />
            ))}
        </div>
    );
  }
  