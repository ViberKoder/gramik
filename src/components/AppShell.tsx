"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!user && pathname !== "/") {
      router.replace("/");
    }
  }, [user, isReady, pathname, router]);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
