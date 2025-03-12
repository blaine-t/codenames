import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import "../../globals.css";
import CardGrid from "@/components/game/cardGrid";

export default async function GamePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <CardGrid />
  );
}
