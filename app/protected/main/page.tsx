"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import "../../globals.css";

function TitleImage() {
  return (
    <div className="title-image">
      <Image 
        src="/codenameslogo.png" 
        alt="Codenames Logo" 
        width={300} 
        height={80}
      />
    </div>
  );
}

export default function CodenamesPage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleProfileClick = () => router.push('/protected/account');
  const handleJoinClick = () => {
    if (code.length === 4) {
      router.push(`/protected/matchmaking?code=${code}`);
    } else {
      alert('Please enter a 4-digit code before joining.');
    }
  };
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (/^\d{0,4}$/.test(newValue)) {
      setCode(newValue);
    }
  };
  const handleHostClick = () => router.push('/protected/matchmaking');

  return (
    <div className="page-container">
      <TitleImage />

      <button onClick={handleProfileClick} className="profile-button">
        Account
      </button>

      <div className="join-section">
        <button onClick={handleJoinClick}>Join</button>
        <input
          type="text"
          placeholder="Enter code here"
          value={code}
          onChange={handleCodeChange}
          className="code-input"
        />
      </div>

      <div className="host-section">
        <button onClick={handleHostClick}>Host</button>
      </div>
    </div>
  );
}
