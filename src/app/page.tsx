"use client";

import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { TelegramLogin } from "@/components/TelegramLogin";
import { Sidebar } from "@/components/Sidebar";
import { PostCard } from "@/components/PostCard";
import { ChannelList } from "@/components/ChannelList";
import { AddChannelModal } from "@/components/AddChannelModal";
import { DEFAULT_POSTS, DEFAULT_CHANNELS } from "@/lib/mockData";
import type { Post, Comment, TelegramUser, Channel } from "@/types";

export default function Home() {
  const { user, login, isReady } = useAuth();
  const [posts, setPosts] = useState<Post[]>(() =>
    DEFAULT_POSTS.map((p) => ({ ...p, comments: [...(p.comments || [])], isLiked: false }))
  );
  const [channels, setChannels] = useState<Channel[]>(DEFAULT_CHANNELS);
  const [feedTab, setFeedTab] = useState<"for-you" | "following">("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const [addChannelOpen, setAddChannelOpen] = useState(false);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes + (p.isLiked ? -1 : 1), isLiked: !p.isLiked }
          : p
      )
    );
  }, []);

  const handleComment = useCallback((postId: string, text: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorName: user?.first_name ?? "Guest",
      authorUsername: user?.username,
      text,
      date: Math.floor(Date.now() / 1000),
      likes: 0,
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
      )
    );
  }, [user]);

  const handleAddChannel = useCallback(async (username: string) => {
    const res = await fetch(`/api/channel?username=${encodeURIComponent(username)}`);
    const data = await res.json();
    const newChannel: Channel = {
      id: data.channel?.id ?? username,
      title: data.channel?.title ?? username,
      username: data.channel?.username ?? username,
      lastPostAt: Date.now() / 1000,
    };
    const fromApi = (data.posts || []).map((p: Post) => ({
      ...p,
      comments: [],
      isLiked: false,
    }));
    const existing = channels.find((c) => c.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      setPosts((prev) => {
        const withoutOld = prev.filter((p) => (p.channelUsername || p.channelId || "").toLowerCase() !== username.toLowerCase());
        return [...fromApi, ...withoutOld];
      });
      return;
    }
    setChannels((prev) => [...prev, newChannel]);
    setPosts((prev) => [...fromApi, ...prev]);
  }, [channels]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.date - a.date);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return sortedPosts;
    const q = searchQuery.trim().toLowerCase();
    return sortedPosts.filter(
      (p) =>
        p.text.toLowerCase().includes(q) ||
        p.channelTitle.toLowerCase().includes(q) ||
        p.channelUsername.toLowerCase().includes(q)
    );
  }, [sortedPosts, searchQuery]);

  const last5ByChannel = useMemo(() => {
    const byChannel: Record<string, Post[]> = {};
    for (const p of sortedPosts) {
      const key = p.channelId || p.channelUsername;
      if (!byChannel[key]) byChannel[key] = [];
      if (byChannel[key].length < 5) byChannel[key].push(p);
    }
    return byChannel;
  }, [sortedPosts]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-ton border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-gradient-ton flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
            T
          </div>
          <span className="inline-block px-2 py-0.5 rounded bg-ton-light text-ton text-xs font-semibold mb-4">TON · Wallet ready</span>
          <h1 className="text-3xl font-bold text-x-black mb-2">Telex</h1>
          <p className="text-x-gray mb-8">
            Your Telegram channels in one feed. Sign in with Telegram to see posts from your channels.
          </p>
          <div className="mb-6">
            <TelegramLogin />
          </div>
          <p className="text-sm text-x-gray mb-4">No bot? For local dev:</p>
          <button
            type="button"
            onClick={() =>
              login({
                id: 123456789,
                first_name: "Demo",
                last_name: "User",
                username: "local_user",
                auth_date: Math.floor(Date.now() / 1000),
                hash: "demo",
              } as TelegramUser)
            }
            className="px-6 py-3 rounded-full bg-x-bg hover:bg-x-border text-x-black text-sm font-bold transition-colors border border-x-border cursor-pointer"
          >
            Sign in as demo user
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <main className="flex-1 flex justify-center border-x border-x-border max-w-[600px] min-w-0">
        <div className="w-full">
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border">
            <div className="flex">
              <button
                type="button"
                onClick={() => setFeedTab("for-you")}
                className={`flex-1 py-4 font-bold text-[15px] transition-colors relative cursor-pointer ${feedTab === "for-you" ? "text-x-black" : "text-x-gray hover:bg-x-bg"}`}
              >
                For you
                {feedTab === "for-you" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ton rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setFeedTab("following")}
                className={`flex-1 py-4 font-bold text-[15px] transition-colors relative cursor-pointer ${feedTab === "following" ? "text-x-black" : "text-x-gray hover:bg-x-bg"}`}
              >
                Following
                {feedTab === "following" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ton rounded-full" />
                )}
              </button>
            </div>
          </div>
          <div>
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center text-x-gray">
                {searchQuery.trim() ? "No posts match your search." : "No posts yet. Add a channel to get started."}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div id={`post-${post.id}`} key={post.id}>
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <aside className="hidden lg:flex flex-col w-[350px] flex-shrink-0 overflow-y-auto">
        <div className="sticky top-0 p-4 space-y-4 bg-white z-10">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-x-bg border border-x-border pl-12 py-3 text-[15px] text-x-black placeholder-x-gray focus:outline-none focus:ring-2 focus:ring-ton focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-x-gray pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <ChannelList
            channels={channels}
            onAddChannel={() => setAddChannelOpen(true)}
          />
          {channels.slice(0, 3).map((ch) => {
            const last5 = last5ByChannel[ch.id] ?? last5ByChannel[ch.username] ?? [];
            if (last5.length === 0) return null;
            return (
              <div key={ch.id} className="rounded-2xl bg-x-bg border border-x-border overflow-hidden">
                <div className="p-4 border-b border-x-border">
                  <h3 className="font-bold text-x-black">{ch.title}</h3>
                  <p className="text-xs text-x-gray">Last {last5.length} posts</p>
                </div>
                <ul className="divide-y divide-x-border max-h-64 overflow-y-auto">
                  {last5.map((p) => (
                    <li key={p.id}>
                      <a href={`#post-${p.id}`} className="block p-3 hover:bg-white/80 transition-colors cursor-pointer">
                        <p className="text-sm text-x-black line-clamp-2">{p.text}</p>
                        <span className="text-xs text-x-gray mt-1 block">
                          {new Date(p.date * 1000).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="rounded-2xl bg-gradient-to-br from-ton-light to-white border border-x-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-ton flex items-center justify-center text-white text-xs font-bold">TON</span>
              <h3 className="font-bold text-x-black">TON & Wallet</h3>
            </div>
            <p className="text-sm text-x-gray">
              Telex is ready for TON and in-app wallets. Connect your wallet and use the same feed with crypto superpowers.
            </p>
            <a
              href="https://ton.org"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-ton font-bold text-sm hover:underline"
            >
              Learn about TON
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
      <AddChannelModal
        isOpen={addChannelOpen}
        onClose={() => setAddChannelOpen(false)}
        onAdd={handleAddChannel}
      />
    </div>
  );
}
