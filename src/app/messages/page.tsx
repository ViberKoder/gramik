"use client";

export default function MessagesPage() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border px-4 py-4">
        <h1 className="text-xl font-bold text-x-black">Messages</h1>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-x-bg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-x-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-x-black mb-2">Direct messages</h2>
        <p className="text-x-gray max-w-sm mx-auto">
          Direct messages between users are coming soon.
        </p>
      </div>
    </div>
  );
}
