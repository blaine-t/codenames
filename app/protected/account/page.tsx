"use client";
import React, { useEffect } from 'react';
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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleProfileClick = () => {
    router.push('/protected/account');
  };

  return (
    <div className="codenames-container">
      <TitleImage />
      <button className="profile-button" onClick={handleProfileClick}>Account</button>
    </div>
  );
}
