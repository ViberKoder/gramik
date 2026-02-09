"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { TelegramLogin } from "@/components/TelegramLogin";
import { Sidebar } from "@/components/Sidebar";
import { PostCard } from "@/components/PostCard";
import { ChannelList } from "@/components/ChannelList";
import { MOCK_POSTS, MOCK_CHANNELS } from "@/lib/mockData";
import type { Post, Comment, TelegramUser } from "@/types";

export default function Home() {
  const { user, login, isReady } = useAuth();
  const [posts, setPosts] = useState<Post[]>(() =>
    MOCK_POSTS.map((p) => ({ ...p, comments: [...p.comments], isLiked: false }))
  );
  const [channels] = useState(MOCK_CHANNELS);
  const [feedTab, setFeedTab] = useState<"for-you" | "following">("for-you");

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes + (p.isLiked ? -1 : 1), isLiked: !p.isLiked }
          : p
      )
    );
  };

  const handleComment = (postId: string, text: string) => {
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
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );
  };

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.date - a.date);
  }, [posts]);

  const last5ByChannel = useMemo(() => {
    const byChannel: Record<string, Post[]> = {};
    for (const p of sortedPosts) {
      if (!byChannel[p.channelId]) byChannel[p.channelId] = [];
      if (byChannel[p.channelId].length < 5) byChannel[p.channelId].push(p);
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
            className="px-6 py-3 rounded-full bg-x-bg hover:bg-x-border text-x-black text-sm font-bold transition-colors border border-x-border"
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
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-x-border">
            <div className="flex">
              <button
                onClick={() => setFeedTab("for-you")}
                className={`flex-1 py-4 font-bold text-[15px] transition-colors relative ${feedTab === "for-you" ? "text-x-black" : "text-x-gray hover:bg-x-bg"}`}
              >
                For you
                {feedTab === "for-you" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ton rounded-full" />
                )}
              </button>
              <button
                onClick={() => setFeedTab("following")}
                className={`flex-1 py-4 font-bold text-[15px] transition-colors relative ${feedTab === "following" ? "text-x-black" : "text-x-gray hover:bg-x-bg"}`}
              >
                Following
                {feedTab === "following" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ton rounded-full" />
                )}
              </button>
            </div>
          </div>
          <div>
            {sortedPosts.map((post) => (
              <div id={`post-${post.id}`} key={post.id}>
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      <aside className="hidden lg:flex flex-col w-[350px] flex-shrink-0 overflow-y-auto">
        <div className="sticky top-0 p-4 space-y-4 bg-white">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="w-full rounded-full bg-x-bg border border-x-border pl-12 py-3 text-[15px] text-x-black placeholder-x-gray focus:outline-none focus:ring-2 focus:ring-ton focus:border-transparent"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-x-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <ChannelList channels={channels} onAddChannel={() => {}} />
          {channels.slice(0, 2).map((ch) => {
            const last5 = last5ByChannel[ch.id] ?? [];
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
                      <a href={`#post-${p.id}`} className="block p-3 hover:bg-white/80 transition-colors">
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
    </div>
  );
}
