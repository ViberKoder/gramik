# Telex — Telegram meets X

Feed from your Telegram channels in a Twitter/X-style layout. Sign in with Telegram, get recommendations, comments and likes. TON & Wallet ready.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sign in with Telegram

1. Create a bot in [@BotFather](https://t.me/BotFather).
2. Run `/setdomain` and set your domain (for local dev you can use the demo sign-in).
3. In `src/components/TelegramLogin.tsx` set `BOT_USERNAME` to your bot’s username.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. In BotFather run `/setdomain` for your Vercel domain (e.g. `your-app.vercel.app`).

## Stack

- Next.js 14, React 18, TypeScript
- Tailwind CSS (Inter, light theme, TON blue accent)
- Telegram Login Widget for auth
