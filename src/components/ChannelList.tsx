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
    <div className="rounded-2xl bg-gray-900/50 border border-gray-800/80 overflow-hidden">
      <div className="p-4 border-b border-gray-800/80">
        <h3 className="font-semibold text-white">Ваши каналы</h3>
        <p className="text-sm text-gray-500 mt-0.5">Последние 5 постов из каждого</p>
      </div>
      <ul className="divide-y divide-gray-800/60">
        {channels.map((ch) => (
          <li key={ch.id}>
            <a
              href={`https://t.me/${ch.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/80 to-blue-700/80 flex items-center justify-center text-white font-bold">
                {ch.title[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{ch.title}</p>
                <p className="text-sm text-gray-500">@{ch.username}</p>
              </div>
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
      {onAddChannel && (
        <button
          onClick={onAddChannel}
          className="w-full p-4 flex items-center justify-center gap-2 text-blue-400 hover:bg-blue-500/10 transition-colors border-t border-gray-800/60"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить канал
        </button>
      )}
    </div>
  );
}
