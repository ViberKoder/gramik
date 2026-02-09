export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface Channel {
  id: string;
  title: string;
  username: string;
  photo?: string;
  lastPostAt?: number;
}

export interface Post {
  id: string;
  channelId: string;
  channelTitle: string;
  channelUsername: string;
  channelPhoto?: string;
  text: string;
  media?: string[];
  date: number;
  views?: number;
  likes: number;
  comments: Comment[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorUsername?: string;
  authorPhoto?: string;
  text: string;
  date: number;
  likes: number;
}
