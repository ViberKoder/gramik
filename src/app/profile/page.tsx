"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getSubscribedChannels, setSubscribedChannels } from "@/lib/storage";
import type { Channel } from "@/types";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [channels, setChannelsState] = useState<Channel[]>([]);

  useEffect(() => {
    setChannelsState(getSubscribedChannels());
  }, []);

  const removeChannel = (username: string) => {
    const next = channels.filter((c) => c.username.toLowerCase() !== username.toLowerCase());
    setSubscribedChannels(next);
    setChannelsState(next);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border px-4 py-4">
        <h1 className="text-xl font-bold text-x-black">Profile</h1>
      </div>
      <div className="p-4 space-y-6">
        <div className="flex items-center gap-4">
          {user.photo_url ? (
            <img src={user.photo_url} alt="" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-ton flex items-center justify-center text-white text-2xl font-bold">
              {user.first_name?.[0] ?? "?"}
            </div>
          )}
          <div>
            <p className="text-xl font-bold text-x-black">
              {user.first_name} {user.last_name ?? ""}
            </p>
            <p className="text-x-gray">@{user.username ?? "user"}</p>
            <p className="text-sm text-x-gray mt-1">
              Signed in with Telegram
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-x-black mb-3">Subscribed channels</h2>
          {channels.length === 0 ? (
            <p className="text-x-gray text-sm">No channels yet. Add some from <Link href="/explore" className="text-ton font-semibold hover:underline">Explore</Link> or from your feed.</p>
          ) : (
            <ul className="space-y-2">
              {channels.map((ch) => (
                <li key={ch.id} className="flex items-center justify-between rounded-xl bg-x-bg border border-x-border p-3">
                  <a
                    href={`https://t.me/${ch.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-x-black hover:underline"
                  >
                    {ch.title} (@{ch.username})
                  </a>
                  <button
                    type="button"
                    onClick={() => removeChannel(ch.username)}
                    className="text-sm text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full py-3 rounded-full border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
