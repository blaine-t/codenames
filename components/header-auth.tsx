import { accountAction, backAction, signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export default async function AuthButton({ pathname }: { pathname: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(pathname)
  const showBackButton = pathname !== "/protected"; 
  const showAccountButton = pathname !== '/protected/account';

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <>
      {showBackButton && <form action={backAction}>
        <Button style={{ backgroundColor: "lightgray" }} className="back-button" type="submit" variant={"outline"}>
          ← Back
        </Button>
      </form>}
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        {showAccountButton && <form action={accountAction}>
          <Button type="submit" variant={"outline"}>
            Account
          </Button>
        </form>}
        <form action={signOutAction}>
          <Button
            type="submit"
            variant={"outline"}
            style={{
              color: "white",
              backgroundColor: "rgb(239 68 68 / var(--tw-bg-opacity, 1))",
            }}
          >
            Sign out
          </Button>
        </form>
      </div>
    </>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
