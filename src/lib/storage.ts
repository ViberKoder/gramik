import type { Channel, Post } from "@/types";

const KEYS = {
  CHANNELS: "telex_subscribed_channels",
  BOOKMARKS: "telex_bookmarks",
  POSTS_CACHE: "telex_posts_cache",
  CACHE_TTL_MS: 5 * 60 * 1000,
} as const;

export function getSubscribedChannels(): Channel[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.CHANNELS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setSubscribedChannels(channels: Channel[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.CHANNELS, JSON.stringify(channels));
  } catch (_) {}
}

export function getBookmarkedPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setBookmarkedPosts(posts: Post[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(posts));
  } catch (_) {}
}

export function addBookmark(post: Post): void {
  const list = getBookmarkedPosts();
  if (list.some((p) => p.id === post.id)) return;
  setBookmarkedPosts([...list, { ...post, comments: post.comments ?? [] }]);
}

export function removeBookmark(postId: string): void {
  setBookmarkedPosts(getBookmarkedPosts().filter((p) => p.id !== postId));
}

export function isBookmarked(postId: string): boolean {
  return getBookmarkedPosts().some((p) => p.id === postId);
}

export interface CachedPosts {
  posts: Post[];
  fetchedAt: number;
}

export function getCachedPosts(): CachedPosts | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.POSTS_CACHE);
    if (!raw) return null;
    const data: CachedPosts = JSON.parse(raw);
    if (Date.now() - data.fetchedAt > KEYS.CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function setCachedPosts(posts: Post[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      KEYS.POSTS_CACHE,
      JSON.stringify({ posts, fetchedAt: Date.now() })
    );
  } catch (_) {}
}
