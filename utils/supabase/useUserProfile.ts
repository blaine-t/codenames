'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface UserProfile {
  username: string
  wins: number
  losses: number
  elo: number
  image: string | null
}

export function useUserProfile() {
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setError('Failed to get user')
        setLoading(false)
        return
      }

      const { data, error: profileError } = await supabase
        .from('User')
        .select('username, wins, losses, elo, image')
        .eq('auth_id', user.id)
        .single()

      if (profileError || !data) {
        setError('Profile not found')
        setLoading(false)
        return
      }

      setProfile({
        username: data.username,
        wins: data.wins,
        losses: data.losses,
        elo: data.elo,
        image: data.image || '/samplePFP.png',
      })

      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  return { profile, loading, error }
}
