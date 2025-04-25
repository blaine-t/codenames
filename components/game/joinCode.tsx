"use client";
import React, { useState } from "react";

export function JoinCodeForm({ onJoin }: { onJoin: (code: string) => void }) {
  const [code, setCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (/^\d{0,4}$/.test(v)) setCode(v);
  };

  const handleClick = () => {
    if (code.length === 4) onJoin(code);
    else alert("Please enter a 4-digit code before joining.");
  };

  return (
    <div data-testid="join-form">
      <input
        placeholder="Enter code here"
        value={code}
        onChange={handleChange}
        data-testid="code-input"
      />
      <button onClick={handleClick} data-testid="join-button">
        Join
      </button>
    </div>
  );
}
