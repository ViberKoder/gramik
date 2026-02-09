"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";
import { getBookmarkedPosts, removeBookmark } from "@/lib/storage";
import type { Post } from "@/types";

export default function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getBookmarkedPosts());
  }, []);

  const handleLike = () => {};
  const handleComment = () => {};
  const handleBookmark = (post: Post) => {
    removeBookmark(post.id);
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border px-4 py-4">
        <h1 className="text-xl font-bold text-x-black">Bookmarks</h1>
        <p className="text-sm text-x-gray mt-0.5">Posts you saved</p>
      </div>
      <div>
        {posts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-x-bg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-x-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-x-black mb-2">No bookmarks yet</h2>
            <p className="text-x-gray max-w-sm mx-auto">
              Tap the bookmark icon on any post to save it here.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id}>
              <PostCard
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onBookmark={handleBookmark}
                isBookmarked={true}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
