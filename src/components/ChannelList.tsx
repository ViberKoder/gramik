"use client";

import type { Channel } from "@/types";

export function ChannelList({
  channels,
  onAddChannel,
}: {
  channels: Channel[];
  onAddChannel?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-x-bg border border-x-border overflow-hidden">
      <div className="p-4 border-b border-x-border">
        <h3 className="font-bold text-x-black text-xl">Your channels</h3>
        <p className="text-sm text-x-gray mt-0.5">Last 5 posts from each</p>
      </div>
      <ul className="divide-y divide-x-border">
        {channels.map((ch) => (
          <li key={ch.id}>
            <a
              href={`https://t.me/${ch.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 hover:bg-white/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-ton flex items-center justify-center text-white font-bold">
                {ch.title[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-x-black truncate">{ch.title}</p>
                <p className="text-sm text-x-gray">@{ch.username}</p>
              </div>
              <svg className="w-5 h-5 text-x-gray flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
      {onAddChannel && (
        <button
          onClick={onAddChannel}
          className="w-full p-4 flex items-center justify-center gap-2 text-ton hover:bg-ton-light transition-colors border-t border-x-border font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add channel
        </button>
      )}
    </div>
  );
}
