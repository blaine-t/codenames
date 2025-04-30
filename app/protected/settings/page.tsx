'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { useUserProfile } from '@/utils/supabase/useUserProfile'
import '../../globals.css'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile, loading, error } = useUserProfile()

  const [username, setUsername] = useState('')
  const [profilePic, setProfilePic] = useState('/samplePFP.png')

  useEffect(() => {
    if (profile) {
      setUsername(profile.username)
      setProfilePic(profile.image || '/samplePFP.png')
    }
  }, [profile])

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfilePic(imageUrl)
    }
  }

  const handleSaveChanges = async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      alert('You must be logged in to update settings.')
      return
    }

    const { error: updateError } = await supabase
      .from('User')
      .update({
        username: username,
        image: profilePic,
      })
      .eq('auth_id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      alert('Failed to update profile.')
    } else {
      router.push('/protected/account')
    }
  }

  const handleResetPassword = () => {
    router.push('/protected/reset-password')
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center text-red-600">Error: {error}</p>

  return (
    <div className="settings-container">
      <div className="settings-section">
        <h2 className="settings-title">Settings</h2>

        <div className="profile-settings">
          <Image src={profilePic} alt="Profile Picture" width={100} height={100} className="profile-pic" />
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        </div>

        <div className="username-settings">
          <label>Username:</label>
          <input type="text" onChange={handleUsernameChange} className="username-input" />
        </div>

        <div>
          <label>Password:</label>
          <br />
          <br />
          <a className="action-button" onClick={handleResetPassword} data-testid="reset-password-button">
            Reset your Password
          </a>
        </div>

        <button onClick={handleSaveChanges} className="save-button" data-testid="save-button">
          Save Changes
        </button>
      </div>
    </div>
  )
}
