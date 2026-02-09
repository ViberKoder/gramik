import type { Channel, Post } from "@/types";

export const MOCK_CHANNELS: Channel[] = [
  { id: "1", title: "Telegram", username: "telegram", lastPostAt: Date.now() / 1000 - 3600 },
  { id: "2", title: "TON Dev", username: "tondev", lastPostAt: Date.now() / 1000 - 7200 },
  { id: "3", title: "Durov's Channel", username: "durov", lastPostAt: Date.now() / 1000 - 86400 },
];

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    channelId: "1",
    channelTitle: "Telegram",
    channelUsername: "telegram",
    text: "Telegram 10.0 — новые стикеры, улучшенные звонки и многое другое. Обновляйтесь в App Store и Google Play.",
    date: Math.floor(Date.now() / 1000) - 3600,
    views: 12500,
    likes: 342,
    comments: [
      { id: "c1", authorName: "Alex", authorUsername: "alex", text: "Крутое обновление!", date: Math.floor(Date.now() / 1000) - 3500, likes: 12 },
    ],
  },
  {
    id: "p2",
    channelId: "2",
    channelTitle: "TON Dev",
    channelUsername: "tondev",
    text: "TON Connect 2.0 — единый способ подключения кошельков во всех dApp. Документация обновлена.",
    date: Math.floor(Date.now() / 1000) - 7200,
    views: 8900,
    likes: 201,
    comments: [],
  },
  {
    id: "p3",
    channelId: "1",
    channelTitle: "Telegram",
    channelUsername: "telegram",
    text: "Fragment запускает аукцион usernames. Теперь можно приобрести короткие и запоминающиеся имена для вашего аккаунта.",
    date: Math.floor(Date.now() / 1000) - 10800,
    views: 45000,
    likes: 1200,
    comments: [],
  },
  {
    id: "p4",
    channelId: "3",
    channelTitle: "Durov's Channel",
    channelUsername: "durov",
    text: "Свобода слова — основа прогресса. Платформы должны защищать право людей на выражение мнений.",
    date: Math.floor(Date.now() / 1000) - 86400,
    views: 200000,
    likes: 15000,
    comments: [],
  },
  {
    id: "p5",
    channelId: "2",
    channelTitle: "TON Dev",
    channelUsername: "tondev",
    text: "Jetton standard (JRC-2) — создание токенов на TON. Примеры и туториалы в репозитории.",
    date: Math.floor(Date.now() / 1000) - 90000,
    views: 5600,
    likes: 89,
    comments: [],
  },
];
