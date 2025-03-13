import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import "../../globals.css";
import CardGrid from "@/components/game/cardGrid";
import TimeBox from "@/components/game/timeBox";
import RoleBox from "@/components/game/roleBox";
import StatusBox from "@/components/game/statusBox";

export default async function GamePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <TimeBox seconds={30} />
      <div className="table">
        <RoleBox role={"Guesser"} />
        <CardGrid />
        <StatusBox clue="green" guesses={5} guessesLeft={6}/>
      </div>
    </>
  );
}
