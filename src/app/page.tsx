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
      authorName: user?.first_name ?? "Гость",
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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1a] px-4">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-glow">
            T
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
            Telex
          </h1>
          <p className="text-gray-400 mb-8">
            Лента из Telegram-каналов в стиле X. Войдите через Telegram, чтобы видеть посты из своих каналов.
          </p>
          <div className="mb-6">
            <TelegramLogin />
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Нет бота? Для локальной разработки:
          </p>
          <button
            onClick={() =>
              login({
                id: 123456789,
                first_name: "Локальный",
                last_name: "Пользователь",
                username: "local_user",
                auth_date: Math.floor(Date.now() / 1000),
                hash: "demo",
              } as TelegramUser)
            }
            className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium transition-colors border border-gray-700"
          >
            Войти как демо-пользователь
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      <Sidebar />
      <main className="flex-1 flex justify-center border-x border-gray-800/80 max-w-[600px] min-w-0">
        <div className="w-full">
          <div className="sticky top-0 z-10 bg-[#0a0f1a]/95 backdrop-blur border-b border-gray-800/80 px-4 py-4">
            <h2 className="text-xl font-bold text-white">Лента</h2>
            <p className="text-sm text-gray-500 mt-0.5">Рекомендации из ваших каналов</p>
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
      <aside className="hidden lg:block w-[350px] flex-shrink-0 p-4 overflow-y-auto">
        <div className="sticky top-4 space-y-4">
          <ChannelList channels={channels} onAddChannel={() => {}} />
          {channels.slice(0, 2).map((ch) => {
            const last5 = last5ByChannel[ch.id] ?? [];
            if (last5.length === 0) return null;
            return (
              <div key={ch.id} className="rounded-2xl bg-gray-900/50 border border-gray-800/80 overflow-hidden">
                <div className="p-4 border-b border-gray-800/80">
                  <h3 className="font-semibold text-white">{ch.title}</h3>
                  <p className="text-xs text-gray-500">Последние {last5.length} постов</p>
                </div>
                <ul className="divide-y divide-gray-800/60 max-h-64 overflow-y-auto">
                  {last5.map((p) => (
                    <li key={p.id}>
                      <a href={`#post-${p.id}`} className="block p-3 hover:bg-white/5 transition-colors">
                        <p className="text-sm text-gray-300 line-clamp-2">{p.text}</p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(p.date * 1000).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="rounded-2xl bg-gray-900/50 border border-gray-800/80 p-4">
            <h3 className="font-semibold text-white mb-2">О Telex</h3>
            <p className="text-sm text-gray-500">
              Объединяем Telegram и X: ваши каналы — в одной ленте. Лайки, комментарии и рекомендации.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
