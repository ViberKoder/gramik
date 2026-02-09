# Telex — Твиттер + Telegram

Сайт объединяет ленту из Telegram-каналов в стиле X (Twitter): авторизация через Telegram, посты в виде рекомендаций, комментарии и лайки.

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Авторизация через Telegram

1. Создайте бота в [@BotFather](https://t.me/BotFather).
2. Выполните `/setdomain` и укажите домен (для локальной разработки можно использовать демо-вход).
3. В `src/components/TelegramLogin.tsx` замените `BOT_USERNAME` на имя вашего бота.

## Деплой на Vercel

1. Залейте проект в GitHub.
2. Подключите репозиторий в [Vercel](https://vercel.com).
3. В BotFather выполните `/setdomain` для домена вида `your-app.vercel.app`.

## Стек

- Next.js 14, React 18, TypeScript
- Tailwind CSS (Inter, синие градиенты в стиле TON/wallet.tg)
- Telegram Login Widget для входа
