"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../globals.css";

export default function AccountPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/protected");
  };

  const handleSettings = () => {
    router.push("/protected/settings");
  };

  return (
    <div className="account-container">
      {/* Profile Section */}
      <div className="profile-section">
        <Image
          src="/samplePFP.png"
          alt="Profile Picture"
          width={100}
          height={100}
          className="profile-pic"
        />
        <h2 className="username">blaine-t</h2>
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
