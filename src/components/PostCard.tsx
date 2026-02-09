"use client";

import { useState } from "react";
import type { Post, Comment } from "@/types";

function formatDate(ts: number) {
  const d = new Date(ts * 1000);
  const now = Date.now() / 1000;
  const diff = now - ts;
  if (diff < 3600) return `${Math.floor(diff / 60)} мин`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} д`;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function PostCard({
  post,
  onLike,
  onComment,
}: {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText("");
  };

  return (
    <article className="border-b border-gray-800/80 hover:bg-white/[0.02] transition-colors">
      <div className="p-4 flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/80 to-blue-700/80 flex items-center justify-center text-white font-bold text-lg">
            {post.channelTitle[0]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{post.channelTitle}</span>
            <span className="text-gray-500">@{post.channelUsername}</span>
            <span className="text-gray-500">·</span>
            <time className="text-gray-500 text-sm" dateTime={new Date(post.date * 1000).toISOString()}>
              {formatDate(post.date)}
            </time>
          </div>
          <p className="mt-1 text-gray-200 whitespace-pre-wrap break-words">{post.text}</p>
          {post.views !== undefined && (
            <p className="mt-2 text-sm text-gray-500">
              {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views} просмотров
            </p>
          )}
          <div className="mt-3 flex items-center gap-6">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments.length}</span>
            </button>
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 transition-colors ${post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
            >
              <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Поделиться
            </button>
          </div>

          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-800/60">
              <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Написать комментарий..."
                  className="flex-1 rounded-xl bg-gray-800/60 border border-gray-700 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  Отправить
                </button>
              </form>
              <ul className="space-y-3">
                {post.comments.map((c) => (
                  <CommentItem key={c.id} comment={c} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <li className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-300 flex-shrink-0">
        {comment.authorName[0]}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.authorName}</span>
          <span className="text-gray-500 text-xs">{formatDate(comment.date)}</span>
        </div>
        <p className="text-sm text-gray-300 mt-0.5">{comment.text}</p>
        {comment.likes > 0 && (
          <span className="text-xs text-gray-500 mt-1 inline-block">{comment.likes} ❤️</span>
        )}
      </div>
    </li>
  );
}
