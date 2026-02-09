import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Telex — Telegram meets X",
  description: "Your Telegram channels in one feed. TON & Wallet ready.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white text-[#0f1419] min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
