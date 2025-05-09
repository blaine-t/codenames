'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../globals.css'
import TitleImage from '@/components/titleImage'
import InviteListener from '@/components/InviteListener'

export default function CodenamesPage() {
  const router = useRouter()
  const [code, setCode] = useState('')

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const handleJoinClick = () => {
    if (code.length === 4) {
      router.push(`/protected/matchmaking?code=${code}`)
    } else {
      alert('Please enter a 4-digit code before joining.')
    }
  }
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    if (/^\d{0,4}$/.test(newValue)) {
      setCode(newValue)
    }
  }
  const handleHostClick = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    router.push(`/protected/matchmaking?code=${randomCode}`)
  }

  return (
    <div className="page-container">
      <TitleImage />

      <div className="join-section">
        <input
          type="text"
          placeholder="Enter code here"
          value={code}
          onChange={handleCodeChange}
          className="code-input"
          data-testid="code-input"
        />
        <button className="action-button" onClick={handleJoinClick} data-testid={'join-button'}>
          Join
        </button>
      </div>

      <div className="host-section">
        <button className="action-button" onClick={handleHostClick} data-testid={'host-button'}>
          Host
        </button>
      </div>
      <InviteListener />
    </div>
  )
}
