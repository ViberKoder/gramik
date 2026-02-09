"use client";

import { useAuth } from "./AuthProvider";
import { TelegramLogin } from "./TelegramLogin";
import type { TelegramUser } from "@/types";

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="relative z-10 text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gradient-ton flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
          T
        </div>
        <span className="inline-block px-2 py-0.5 rounded bg-ton-light text-ton text-xs font-semibold mb-4">
          TON · Wallet ready
        </span>
        <h1 className="text-3xl font-bold text-x-black mb-2">Telex</h1>
        <p className="text-x-gray mb-8">
          Your Telegram channels in one feed. Sign in with Telegram to get started.
        </p>
        <div className="mb-6">
          <TelegramLogin />
        </div>
        <p className="text-sm text-x-gray mb-4">Local development:</p>
        <button
          type="button"
          onClick={() =>
            login({
              id: 123456789,
              first_name: "Demo",
              last_name: "User",
              username: "local_user",
              auth_date: Math.floor(Date.now() / 1000),
              hash: "demo",
            } as TelegramUser)
          }
          className="px-6 py-3 rounded-full bg-x-bg hover:bg-x-border text-x-black text-sm font-bold transition-colors border border-x-border cursor-pointer"
        >
          Sign in as demo user
        </button>
      </div>
    </div>
  );
}
