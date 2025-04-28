import { generate } from "random-words"

enum Allegiance {
    Blue = "blue",
    Red = "red",
    Bystander = "bystander",
    Assassin = "assassin"
}

// https://stackoverflow.com/a/2450976
function shuffle(array: any[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

export async function POST(req: Request) {
    const words = generate({ minLength: 3, maxLength: 7, exactly: 25 }) as string[]
    const allegiances = [
        ...Array(8).fill(Allegiance.Blue),
        ...Array(7).fill(Allegiance.Red),
        ...Array(9).fill(Allegiance.Bystander),
        ...Array(1).fill(Allegiance.Assassin)
    ]
    shuffle(allegiances)

    const board = words.map((word, i) => {
        return {
            word,
            allegiance: allegiances[i],
            guessed: false
        }
    })

    return Response.json(board)
}
