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

  // Disable scrolling by setting the body's overflow to hidden.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Example function for profile navigation (add more as needed)
  const handleProfileClick = () => {
    router.push('/protected/account');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        width: '100%',
        padding: '0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Middle: Codenames Logo Image */}
      <TitleImage />

      {/* You can add more components or elements here as needed */}

      {/* Example: a profile button */}
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
    </div>
  );
}
