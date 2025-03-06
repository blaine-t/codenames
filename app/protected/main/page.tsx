"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// This component displays the logo image in the top-middle.
function TitleImage() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center', // Center the logo horizontally
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >
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

  // Disable scrolling by setting the body's overflow to hidden.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Navigates to /protected/account when profile button is clicked.
  const handleProfileClick = () => {
    router.push('/protected/account');
  };

  // Navigates to /protected/matchmaking and passes the code as a query parameter.
  const handleJoinClick = () => {
    if (code.length === 4) {
      router.push(`/protected/matchmaking?code=${code}`);
    } else {
      alert('Please enter a 4-digit code before joining.');
    }
  };

  // Only allow up to 4 digits in the code input.
  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (/^\d{0,4}$/.test(newValue)) {
      setCode(newValue);
    }
  };

  // Navigates to /protected/matchmaking when host button is clicked.
  const handleHostClick = () => {
    router.push('/protected/matchmaking');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      width: '100%',
      padding: '0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Middle: Codenames Logo Image */}
      <TitleImage />

      {/* Top Right: Profile button */}
      <button 
        onClick={handleProfileClick}
        style={{
          position: 'fixed',
          top: '90px',
          right: '20px',
          cursor: 'pointer'
        }}
      >
        Account
      </button>

      {/* Join section */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <button onClick={handleJoinClick}>
            Join
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter code here"
            value={code}
            onChange={handleCodeChange}
            style={{
              width: '150px',
              padding: '8px',
              textAlign: 'center'
            }}
          />
        </div>
      </div>

      {/* Host button */}
      <div style={{
        width: '100%',
        textAlign: 'center'
      }}>
        <button onClick={handleHostClick}>
          Host
        </button>
      </div>
    </div>
  );
}
