"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../globals.css";

export default function AccountPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Logout functionality (To be implemented)
    console.log("Logging out...");
  };

  const handleBack = () => {
    router.push("/protected/main");
  };

  const handleSettings = () => {
    router.push("/protected/settings");
  };

  return (
    <div className="account-container">
      {/* Back Button */}
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>

      {/* Profile Section */}
      <div className="profile-section">
        <Image
          src="/samplePFP.png"
          alt="Profile Picture"
          width={100}
          height={100}
          className="profile-pic"
        />
        <h2 className="username">BT5000</h2> {/* Will handle actual account name Later */}
        <button className="settings-button" onClick={handleSettings}>
          ⚙️ Settings
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
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
