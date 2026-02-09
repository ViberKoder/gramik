"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import type { TelegramUser } from "@/types";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

const BOT_USERNAME = "gramixxbot";

export function TelegramLogin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    window.onTelegramAuth = (user: TelegramUser) => {
      login(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "window.onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      window.onTelegramAuth = undefined;
      if (containerRef.current && script.parentNode) script.remove();
    };
  }, [login]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center [&>script]:!block"
      aria-label="Log in with Telegram"
    />
  );
}
