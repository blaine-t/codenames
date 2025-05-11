import { accountAction, backAction, signOutAction } from '@/app/actions'
import Link from 'next/link'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'

export default async function AuthButton() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('User').select('username').eq('auth_id', user?.id).single()

  return user ? (
    <>
      
      <form action={backAction}>
        <Button className="back-button" type="submit" variant={'outline'} data-testid={'back-button'}>
          ← Back
        </Button>
      </form>
      <div className="flex items-center gap-4">
        Hey, {userData?.username}!
        <form action={accountAction}>
          <Button type="submit" variant={'outline'} data-testid={'account-button'}>
            Account
          </Button>
        </form>
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
