"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../globals.css";

export default function SettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState("CurrentUser");
  const [profilePic, setProfilePic] = useState("/samplePFP.png");

  const handleBack = () => {
    router.push("/protected/account");
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="settings-container">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>
      <div className="settings-section">
        <h2 className="settings-title">Settings</h2>
        <div className="profile-settings">
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        </div>
        <div className="username-settings">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="username-input"
          />
        </div>
        <button className="save-button">Save Changes</button>
      </div>
    </div>
  );
}
