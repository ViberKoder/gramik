"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { LoginPage } from "@/components/LoginPage";
import { PostCard } from "@/components/PostCard";
import { ChannelList } from "@/components/ChannelList";
import { AddChannelModal } from "@/components/AddChannelModal";
import {
  getSubscribedChannels,
  setSubscribedChannels,
  getCachedPosts,
  setCachedPosts,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "@/lib/storage";
import type { Post, Comment, Channel } from "@/types";

function HomeFeed() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addChannelOpen, setAddChannelOpen] = useState(false);

  const loadChannels = useCallback(() => {
    setChannels(getSubscribedChannels());
  }, []);

  const loadPosts = useCallback(async (skipCache = false) => {
    const list = getSubscribedChannels();
    if (list.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }
    const cached = skipCache ? null : getCachedPosts();
    if (cached && cached.posts.length > 0) {
      setPosts(cached.posts);
      setLoading(false);
      return;
    }
    setLoading(true);
    const allPosts: Post[] = [];
    for (const ch of list) {
      try {
        const res = await fetch(`/api/channel?username=${encodeURIComponent(ch.username)}`);
        const data = await res.json();
        const fromApi = (data.posts || []).map((p: Post) => ({
          ...p,
          comments: p.comments ?? [],
          isLiked: false,
        }));
        allPosts.push(...fromApi);
      } catch (_) {}
    }
    const sorted = allPosts.sort((a, b) => b.date - a.date);
    setCachedPosts(sorted);
    setPosts(sorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  useEffect(() => {
    if (channels.length > 0) {
      loadPosts();
    } else {
      setLoading(false);
    }
  }, [channels.length, loadPosts]);

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
    const list = getSubscribedChannels();
    const existing = list.find((c) => c.username.toLowerCase() === username.toLowerCase());
    if (existing) {
      const updated = list.map((c) => (c.username.toLowerCase() === username.toLowerCase() ? newChannel : c));
      setSubscribedChannels(updated);
      setPosts((prev) => {
        const without = prev.filter((p) => (p.channelUsername || p.channelId || "").toLowerCase() !== username.toLowerCase());
        return [...fromApi, ...without].sort((a, b) => b.date - a.date);
      });
    } else {
      setSubscribedChannels([...list, newChannel]);
      setChannels([...list, newChannel]);
      setPosts((prev) => [...fromApi, ...prev].sort((a, b) => b.date - a.date));
    }
    setCachedPosts([]);
  }, []);

  const handleRemoveChannel = useCallback((username: string) => {
    const list = getSubscribedChannels().filter((c) => c.username.toLowerCase() !== username.toLowerCase());
    setSubscribedChannels(list);
    setChannels(list);
    setPosts((prev) => prev.filter((p) => (p.channelUsername || p.channelId || "").toLowerCase() !== username.toLowerCase()));
    setCachedPosts([]);
  }, []);

  const handleBookmark = useCallback((post: Post) => {
    if (isBookmarked(post.id)) {
      removeBookmark(post.id);
    } else {
      addBookmark({ ...post, comments: post.comments ?? [] });
    }
  }, []);

  const sortedPosts = useMemo(() => [...posts].sort((a, b) => b.date - a.date), [posts]);

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

  const hasChannels = channels.length > 0;

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-1 flex flex-col min-w-0 border-x border-x-border max-w-[600px]">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border flex items-center justify-between px-4">
          <h2 className="py-4 font-bold text-[15px] text-x-black">For you</h2>
          {hasChannels && (
            <button
              type="button"
              onClick={() => { setCachedPosts([]); loadPosts(true); }}
              disabled={loading}
              className="p-2 rounded-full hover:bg-x-bg text-x-gray hover:text-ton transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh feed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-2 border-ton border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !hasChannels ? (
            <div className="p-8 text-center">
              <h2 className="text-xl font-bold text-x-black mb-2">Add your first channel</h2>
              <p className="text-x-gray mb-6 max-w-sm mx-auto">
                Subscribe to Telegram channels and see their posts here. Add a channel to get started.
              </p>
              <button
                type="button"
                onClick={() => setAddChannelOpen(true)}
                className="px-6 py-3 rounded-full bg-ton hover:bg-ton-hover text-white font-bold cursor-pointer"
              >
                Add channel
              </button>
              <p className="mt-4 text-sm text-x-gray">
                or browse <a href="/explore" className="text-ton font-semibold hover:underline">Explore</a> to discover channels
              </p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-x-gray">
              {searchQuery.trim() ? "No posts match your search." : "No posts yet. Pull to refresh or add more channels."}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div id={`post-${post.id}`} key={post.id}>
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onBookmark={handleBookmark}
                  isBookmarked={isBookmarked(post.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
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
            onRemoveChannel={handleRemoveChannel}
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
              Telex is ready for TON and in-app wallets.
            </p>
            <a href="https://ton.org" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-ton font-bold text-sm hover:underline">
              Learn about TON
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
      <AddChannelModal isOpen={addChannelOpen} onClose={() => setAddChannelOpen(false)} onAdd={handleAddChannel} />
    </div>
  );
}

export default function Home() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-ton border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <HomeFeed />;
}
