"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (username: string) => Promise<void>;
};

export function AddChannelModal({ isOpen, onClose, onAdd }: Props) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.replace(/^@/, "").trim();
    if (!clean) {
      setError("Enter channel username");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onAdd(clean);
      setUsername("");
      onClose();
    } catch (err) {
      setError("Could not load channel. Try another username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Add channel"
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-x-black">Add channel</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-x-bg text-x-gray hover:text-x-black transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-x-gray mb-4">
          Enter a public Telegram channel username (e.g. telegram, durov). Posts will be loaded from the channel.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@username"
            className="w-full rounded-xl bg-x-bg border border-x-border px-4 py-3 text-[15px] text-x-black placeholder-x-gray focus:outline-none focus:ring-2 focus:ring-ton"
            disabled={loading}
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <div className="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-x-bg text-x-black font-bold text-sm hover:bg-x-border transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full bg-ton hover:bg-ton-hover text-white font-bold text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Loading…" : "Add channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
