"use client";

import React from "react";

export function RulesPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="rules-popup">
      <div className="rules-popup-content">
        <h3 className="text-lg font-semibold mb-3">Game Rules</h3>
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>Two teams compete to find all their agents using one-word clues.</li>
          <li>Each team has a spymaster who knows the identities of the agents.</li>
          <li>Spymasters give clues that relate to multiple words on the board.</li>
          <li>Field operatives guess words based on the clue. Wrong guesses can help the other team—or end the game!</li>
          <li>The first team to find all their agents wins. Avoid the assassin word at all costs!</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
