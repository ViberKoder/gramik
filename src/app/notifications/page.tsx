"use client";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-x-border px-4 py-4">
        <h1 className="text-xl font-bold text-x-black">Notifications</h1>
      </div>
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-x-bg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-x-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-x-black mb-2">No notifications yet</h2>
        <p className="text-x-gray max-w-sm mx-auto">
          When channels you follow post new content, notifications will appear here.
        </p>
      </div>
    </div>
  );
}
