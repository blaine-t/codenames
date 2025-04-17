"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../globals.css";
import { useUserProfile } from "@/utils/supabase/useUserProfile";

export default function AccountPage() {
  const router = useRouter();
  const { profile, loading, error } = useUserProfile();

  const handleSettings = () => {
    router.push("/protected/settings");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (error || !profile) {
    return <p className="text-center mt-10 text-red-600">Error: {error ?? "User profile not found."}</p>;
  }

  return (
    <div className="account-container">
      {/* Profile Section */}
      <div className="profile-section">
        <Image
          src="/samplePFP.png"   //{profile.image} will implement later
          alt="Profile Picture"
          width={100}
          height={100}
          className="profile-pic"
        />
        <h2 className="username">{profile.username}</h2>
        <p>Wins: {profile.wins}</p>
        <p>Losses: {profile.losses}</p>
        <p>ELO: {profile.elo}</p>
        <button className="settings-button" onClick={handleSettings}>
          ⚙️ Settings
        </button>
      </div>

      {/* Friends List */}
      <div className="friends-section">
        <h3 className="friends-title">Friends</h3>
        <ul className="friends-list">
          <li className="friend">👤 Friend 1</li>
          <li className="friend">👤 Friend 2</li>
          <li className="friend">👤 Friend 3</li>
        </ul>
      </div>
    </div>
  );
}
