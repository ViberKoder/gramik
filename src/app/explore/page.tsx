"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSubscribedChannels, setSubscribedChannels } from "@/lib/storage";
import type { Channel } from "@/types";

const SUGGESTED: { username: string; title: string; description: string }[] = [
  { username: "telegram", title: "Telegram", description: "Official Telegram channel" },
  { username: "durov", title: "Durov's Channel", description: "Founder of Telegram" },
  { username: "tondev", title: "TON Dev", description: "TON blockchain development" },
  { username: "ton_blockchain", title: "TON", description: "The Open Network" },
  { username: "telegramtips", title: "Telegram Tips", description: "Tips and tricks" },
];

export default function ExplorePage() {
  const router = useRouter();
  const [adding, setAdding] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = useCallback(async (username: string) => {
    setError(null);
    setAdding(username);
    try {
      const res = await fetch(`/api/channel?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      const newChannel: Channel = {
        id: data.channel?.id ?? username,
        title: data.channel?.title ?? username,
        username: data.channel?.username ?? username,
        lastPostAt: Date.now() / 1000,
      };
      const list = getSubscribedChannels();
      if (list.some((c) => c.username.toLowerCase() === username.toLowerCase())) {
        setAdding(null);
        router.push("/");
        return;
      }
      setSubscribedChannels([...list, newChannel]);
      router.push("/");
    } catch {
      setError("Could not load channel. Try again.");
    } finally {
      setAdding(null);
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border px-4 py-4">
        <h1 className="text-xl font-bold text-x-black">Explore</h1>
        <p className="text-sm text-x-gray mt-0.5">Discover and add Telegram channels to your feed</p>
      </div>
      <div className="p-4 space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {SUGGESTED.map((ch) => {
          const added = getSubscribedChannels().some((c) => c.username.toLowerCase() === ch.username.toLowerCase());
          return (
            <div
              key={ch.username}
              className="rounded-2xl border border-x-border p-4 flex items-center justify-between gap-4 hover:bg-x-bg/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gradient-ton flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {ch.title[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-x-black">{ch.title}</p>
                  <p className="text-sm text-x-gray">@{ch.username}</p>
                  <p className="text-sm text-x-gray mt-0.5">{ch.description}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={adding !== null || added}
                onClick={() => handleAdd(ch.username)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-ton hover:bg-ton-hover text-white font-bold text-sm disabled:opacity-50 cursor-pointer"
              >
                {adding === ch.username ? "Adding…" : added ? "Added" : "Add to feed"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
