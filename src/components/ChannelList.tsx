"use client";

import type { Channel } from "@/types";

export function ChannelList({
  channels,
  onAddChannel,
  onRemoveChannel,
}: {
  channels: Channel[];
  onAddChannel?: () => void;
  onRemoveChannel?: (username: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-x-bg border border-x-border overflow-hidden">
      <div className="p-4 border-b border-x-border">
        <h3 className="font-bold text-x-black text-xl">Your channels</h3>
        <p className="text-sm text-x-gray mt-0.5">Last 5 posts from each</p>
      </div>
      <ul className="divide-y divide-x-border">
        {channels.map((ch) => (
          <li key={ch.id} className="group">
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
              <div className="flex items-center gap-1">
                {onRemoveChannel && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); onRemoveChannel(ch.username); }}
                    className="p-1.5 rounded-full hover:bg-red-100 text-x-gray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Remove channel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
                <svg className="w-5 h-5 text-x-gray flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {onAddChannel && (
        <button
          type="button"
          onClick={onAddChannel}
          className="w-full p-4 flex items-center justify-center gap-2 text-ton hover:bg-ton-light transition-colors border-t border-x-border font-medium cursor-pointer"
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
