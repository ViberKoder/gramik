"use client";

import { useState } from "react";
import type { Post, Comment } from "@/types";

function formatDate(ts: number) {
  const now = Date.now() / 1000;
  const diff = now - ts;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
    <article className="border-b border-x-border hover:bg-x-bg/50 transition-colors">
      <div className="px-4 py-3 flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-ton flex items-center justify-center text-white font-bold text-lg">
            {post.channelTitle[0]}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-x-black">{post.channelTitle}</span>
            <span className="text-x-gray text-[15px]">@{post.channelUsername}</span>
            <span className="text-x-gray">·</span>
            <time className="text-x-gray text-[15px]" dateTime={new Date(post.date * 1000).toISOString()}>
              {formatDate(post.date)}
            </time>
          </div>
          <p className="mt-0.5 text-[15px] text-x-black whitespace-pre-wrap break-words leading-5">{post.text}</p>
          {post.views !== undefined && (
            <p className="mt-1 text-[13px] text-x-gray">
              {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views} views
            </p>
          )}
          <div className="mt-3 flex items-center gap-1 max-w-[425px]">
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 min-w-0 flex-1 text-x-gray hover:text-ton transition-colors group cursor-pointer"
            >
              <span className="p-2 rounded-full group-hover:bg-ton-light transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
              <span className="text-[13px]">{post.comments?.length ?? 0}</span>
            </button>
            <button type="button" className="flex items-center gap-2 min-w-0 flex-1 text-x-gray hover:text-green-500 transition-colors group cursor-pointer">
              <span className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 min-w-0 flex-1 group cursor-pointer ${post.isLiked ? "text-red-500" : "text-x-gray hover:text-red-500"}`}
            >
              <span className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              <span className="text-[13px]">{post.likes}</span>
            </button>
            <button type="button" className="flex items-center gap-2 min-w-0 flex-1 text-x-gray hover:text-ton transition-colors group cursor-pointer">
              <span className="p-2 rounded-full group-hover:bg-ton-light transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </span>
            </button>
            <button type="button" className="flex items-center min-w-0 text-x-gray hover:text-ton transition-colors group cursor-pointer">
              <span className="p-2 rounded-full group-hover:bg-ton-light transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </span>
            </button>
          </div>

          {showComments && (
            <div className="mt-4 pt-4 border-t border-x-border">
              <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Post your reply..."
                  className="flex-1 rounded-full bg-x-bg border border-x-border px-4 py-2.5 text-[15px] text-x-black placeholder-x-gray focus:outline-none focus:ring-2 focus:ring-ton focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2.5 rounded-full bg-ton hover:bg-ton-hover text-white text-sm font-bold disabled:opacity-50 transition-opacity"
                >
                  Reply
                </button>
              </form>
              <ul className="space-y-3">
                {(post.comments ?? []).map((c) => (
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
      <div className="w-8 h-8 rounded-full bg-ton-light flex items-center justify-center text-xs font-bold text-ton flex-shrink-0">
        {comment.authorName[0]}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-x-black">{comment.authorName}</span>
          <span className="text-x-gray text-[13px]">{formatDate(comment.date)}</span>
        </div>
        <p className="text-[15px] text-x-black mt-0.5">{comment.text}</p>
        {comment.likes > 0 && (
          <span className="text-[13px] text-x-gray mt-1 inline-block">{comment.likes} likes</span>
        )}
      </div>
    </li>
  );
}
