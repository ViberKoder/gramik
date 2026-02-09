"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const nav = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/notifications", label: "Notifications" },
  { href: "/messages", label: "Messages" },
  { href: "/bookmarks", label: "Bookmarks" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-[72px] xl:w-[275px] flex flex-col items-center xl:items-stretch border-r border-x-border bg-white min-h-screen sticky top-0">
      <Link
        href="/"
        className="mt-2 mb-2 flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full hover:bg-x-bg transition-colors min-h-[52px]"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-ton flex items-center justify-center text-white font-bold text-lg">
            T
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 px-1 rounded bg-ton border border-white text-[9px] font-bold text-white leading-tight">
            TON
          </span>
        </div>
        <span className="hidden xl:inline text-xl font-bold text-x-black">Telex</span>
      </Link>

      <nav className="flex-1 flex flex-col gap-1 mt-2 w-full px-2">
        {nav.map(({ href, label }) => {
          const isHome = href === "/";
          const active = isHome ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-center xl:justify-start gap-3 px-4 py-3 rounded-full transition-colors min-h-[52px] ${active ? "font-semibold text-x-black bg-x-bg" : "text-x-black hover:bg-x-bg"}`}
            >
              {href === "/" && (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              )}
              {href === "/explore" && (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {href === "/notifications" && (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              )}
              {href === "/messages" && (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              {href === "/bookmarks" && (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
              <span className="hidden xl:inline">{label}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-2 border-t border-x-border w-full">
          <Link
            href="/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-full hover:bg-x-bg transition-colors cursor-pointer ${pathname === "/profile" ? "bg-x-bg" : ""}`}
          >
            {user.photo_url ? (
              <img src={user.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-ton flex items-center justify-center text-white font-semibold">
                {user.first_name?.[0] ?? "?"}
              </div>
            )}
            <div className="hidden xl:block flex-1 min-w-0">
              <p className="font-bold truncate text-sm text-x-black">{user.first_name} {user.last_name ?? ""}</p>
              <p className="text-sm text-x-gray truncate">@{user.username ?? "user"}</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="mt-2 w-full flex items-center justify-center xl:justify-start gap-3 px-4 py-2 rounded-full hover:bg-x-bg text-x-gray hover:text-red-500 transition-colors text-sm cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden xl:inline">Log out</span>
          </button>
        </div>
      )}
    </aside>
  );
}
