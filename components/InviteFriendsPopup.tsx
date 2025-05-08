"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getFriends } from "@/utils/supabase/useFriends";
import { createClient } from "@/utils/supabase/client";

export function InviteFriendsPopup({ gameCode, onClose }: { gameCode: string; onClose: () => void }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!user || authError) {
        setError("Authentication failed");
        setLoading(false);
        return;
      }

      try {
        const friendList = await getFriends(user.id);
        setFriends(friendList);
      } catch (e) {
        setError("Failed to fetch friends");
      }
      setLoading(false);
    };
    fetchFriends();
  }, []);

  const handleSendInvite = async (receiverId: string) => {
    const supabase = createClient();

    try {
      const { error, status, statusText } = await supabase.from("Notifications").insert([
        {
          receiver_id: receiverId,
          type: "invite",
          message: `You've been invited to a game! Code: ${gameCode}`,
          metadata: { gameCode },
          created_at: new Date().toISOString(),
        }
      ]);

      if (error) {
        console.error("Supabase error:", error);
        alert(`Failed to send invite.\nStatus: ${status}\nReason: ${statusText || error.message}`);
      } else {
        alert("Invite sent!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred. Check console for details.");
    }
  };

  return (
    <div className="friends-popup">
      <div className="friends-popup-content">
        <h3 className="text-lg font-semibold mb-3">Invite Friends</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : friends.length === 0 ? (
          <p>No friends found</p>
        ) : (
          <ul className="friends-list">
            {friends.map((friend, idx) => (
              <li key={idx} className="friend-invite-row flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={friend.image || "/samplePFP.png"}
                    alt={friend.username}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  <span>{friend.username}</span>
                </div>
                <button
                  onClick={() => handleSendInvite(friend.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Send Invite
                </button>
              </li>
            ))}
          </ul>
        )}
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
