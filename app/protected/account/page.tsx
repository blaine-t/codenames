"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../../globals.css";
import { useUserProfile } from "@/utils/supabase/useUserProfile";
import {
  getFriends,
  getIncomingRequests,
  acceptFriendRequest,
  sendFriendRequestByUsername
} from "@/utils/supabase/useFriends";
import { createClient } from "@/utils/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const { profile, loading, error } = useUserProfile();

  const [friends, setFriends] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(true);

  const handleSettings = () => {
    router.push("/protected/settings");
  };

  const fetchAll = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
      try {
        const [friendList, requestList] = await Promise.all([
          getFriends(user.id),
          getIncomingRequests(user.id),
        ]);
        setFriends(friendList);
        setIncoming(requestList.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    setLoadingFriends(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAccept = async (requestId: number) => {
    await acceptFriendRequest(requestId);
    setIncoming((prev) => prev.filter((r) => r.id !== requestId));
    fetchAll();
  };

  const handleSendRequest = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && searchUsername.trim()) {
      const { error } = await sendFriendRequestByUsername(user.id, searchUsername.trim());
      if (error) {
        alert("Error sending request: " + error.message);
      } else {
        alert("Friend request sent!");
        setSearchUsername("");
      }
    }
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
          src={profile.image || "/samplePFP.png"}
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

      {/* Add Friend */}
      <div className="add-friend-section mt-6">
        <h3 className="friends-title">Send Friend Request</h3>
        <input
          type="text"
          placeholder="Enter username"
          className="p-2 border rounded mr-2"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
        />
        <button onClick={handleSendRequest} className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>

      {/* Incoming Requests */}
      <div className="requests-section mt-6">
        <h3 className="friends-title">Pending Friend Requests</h3>
        {incoming.length === 0 ? (
          <p>No incoming requests</p>
        ) : (
          <ul className="friends-list">
            {incoming.map((req) => (
              <li className="friend" key={req.id}>
                <Image
                  src={req.requester.profile_picture || "/samplePFP.png"}
                  alt="Requester"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-2">{req.requester.username}</span>
                <button
                  onClick={() => handleAccept(req.id)}
                  className="ml-4 p-1 px-3 bg-green-500 text-white rounded"
                >
                  Accept
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Friends List */}
      <div className="friends-section mt-6">
        <h3 className="friends-title">Friends</h3>
        {loadingFriends ? (
          <p>Loading friends...</p>
        ) : friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          <ul className="friends-list">
            {friends.map((friend, index) => (
              <li className="friend" key={index}>
                <Image
                  src={friend.profile_picture || "/samplePFP.png"}
                  alt={`${friend.username}'s profile`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-2">{friend.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
