import { NextRequest, NextResponse } from "next/server";

const RSS_BRIDGES = [
  "https://rss-bridge.privacydev.net",
  "https://rss.0x0c.link",
];

function parseRssItems(xml: string): { title: string; link: string; description: string; pubDate: string }[] {
  const items: { title: string; link: string; description: string; pubDate: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      ?? block.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/<[^>]+>/g, "") ?? "";
    const link = block.match(/<link>(.*?)<\/link>/)?.[1] ?? "";
    const description = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      ?? block.match(/<description>([\s\S]*?)<\/description>/)?.[1]?.replace(/<[^>]+>/g, "") ?? "";
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
    items.push({ title, link, description, pubDate });
  }
  return items;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.replace(/^@/, "").trim();
  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  let xml: string | null = null;
  for (const base of RSS_BRIDGES) {
    try {
      const url = `${base}/?action=display&bridge=Telegram&context=Channel&u=${encodeURIComponent(username)}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        xml = await res.text();
        if (xml && xml.includes("<item>")) break;
      }
    } catch (_) {}
  }
  try {
    if (!xml || !xml.includes("<item>")) throw new Error("RSS fetch failed");
    const items = parseRssItems(xml);
    const channelTitle = username.charAt(0).toUpperCase() + username.slice(1);
    const posts = items.slice(0, 20).map((item, i) => ({
      id: `rss-${username}-${i}`,
      channelId: username,
      channelTitle,
      channelUsername: username,
      text: item.description || item.title,
      date: item.pubDate ? Math.floor(new Date(item.pubDate).getTime() / 1000) : Math.floor(Date.now() / 1000) - i * 3600,
      views: undefined,
      likes: 0,
      comments: [],
      link: item.link,
    }));
    return NextResponse.json({ channel: { id: username, title: channelTitle, username }, posts });
  } catch (e) {
    console.error("Channel fetch error:", e);
    return NextResponse.json({ error: "Could not fetch channel", posts: [] }, { status: 200 });
  }
}
