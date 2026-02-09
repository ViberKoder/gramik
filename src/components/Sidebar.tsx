"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-[72px] xl:w-[280px] flex flex-col items-center xl:items-stretch border-r border-gray-800/80 bg-[#0a0f1a]/80 min-h-screen sticky top-0">
      <Link
        href="/"
        className="mt-4 mb-2 flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full hover:bg-white/5 transition-colors group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
          T
        </div>
        <span className="hidden xl:inline text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          Telex
        </span>
      </Link>

      <nav className="flex-1 flex flex-col gap-1 mt-6 w-full px-2">
        <Link
          href="/"
          className="flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="hidden xl:inline">Лента</span>
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden xl:inline">Поиск</span>
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="hidden xl:inline">Уведомления</span>
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="hidden xl:inline">Сообщения</span>
        </Link>
      </nav>

      {user && (
        <div className="p-2 border-t border-gray-800/80 w-full">
          <div className="flex items-center gap-3 px-3 py-2 rounded-full">
            {user.photo_url ? (
              <img src={user.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                {user.first_name?.[0] ?? "?"}
              </div>
            )}
            <div className="hidden xl:block flex-1 min-w-0">
              <p className="font-medium truncate">{user.first_name} {user.last_name ?? ""}</p>
              <p className="text-sm text-gray-500 truncate">@{user.username ?? "user"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-2 w-full flex items-center justify-center xl:justify-start gap-3 px-4 py-2 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden xl:inline">Выйти</span>
          </button>
        </div>
      )}
    </aside>
  );
}
