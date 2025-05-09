import { accountAction, backAction, signOutAction } from '@/app/actions'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function AuthButton({ pathname }: { pathname: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const showBackButton = pathname !== '/protected'
  const showAccountButton = pathname !== '/protected/account'

  return user ? (
    <>
      {showBackButton && (
        <form action={backAction}>
          <Button
            className="back-button"
            type="submit"
            variant={'outline'}
            data-testid={'back-button'}
          >
            ← Back
          </Button>
        </form>
      )}
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        {showAccountButton && (
          <form action={accountAction}>
            <Button type="submit" variant={'outline'} data-testid={'account-button'}>
              Account
            </Button>
          </form>
        )}
        <form action={signOutAction}>
          <Button
            type="submit"
            variant={'outline'}
            style={{
              color: 'white',
              backgroundColor: 'rgb(239 68 68 / var(--tw-bg-opacity, 1))',
            }}
            data-testid={'signout-button'}
          >
            Sign out
          </Button>
        </form>
      </div>
    </>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  )
}
