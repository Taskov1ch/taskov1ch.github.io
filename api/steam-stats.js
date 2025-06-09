// /api/steam-stats.js
import { createClient } from 'redis';

// --- Начало изменений ---

// Создаем и подключаем клиент Redis один раз за пределами обработчика
// чтобы переиспользовать соединение между вызовами функции
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));
// Убедимся, что клиент подключен перед тем как принимать запросы
if (!redisClient.isOpen) {
    await redisClient.connect();
}

// --- Конец изменений ---

export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamId || !apiKey) {
    return response.status(500).json({ error: 'Steam ID or API Key not configured' });
  }

  const CACHE_KEY = `steam:stats:${steamId}`;
  const CACHE_TTL_SECONDS = 3600;

  try {
    // --- Начало изменений ---
    // 1. Получаем данные из Redis (они придут в виде строки)
    const cachedString = await redisClient.get(CACHE_KEY);

    if (cachedString) {
      // Если строка существует, парсим ее в объект и возвращаем
      return response.status(200).json(JSON.parse(cachedString));
    }
    // --- Конец изменений ---

    // Если в кэше пусто, делаем запросы к Steam API
    const playerSummaryUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    const recentlyPlayedUrl = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;

    const [playerSummaryRes, recentlyPlayedRes] = await Promise.all([
      fetch(playerSummaryUrl),
      fetch(recentlyPlayedUrl)
    ]);

    if (!playerSummaryRes.ok || !recentlyPlayedRes.ok) {
        return response.status(502).json({ error: 'Failed to fetch data from Steam API' });
    }

    const playerData = await playerSummaryRes.json();
    const recentlyPlayedData = await recentlyPlayedRes.json();

    const profile = playerData.response?.players?.[0] || {};
    const games = recentlyPlayedData.response?.games || [];

    const dataToRespondAndCache = {
      profile: {
        steamid: profile.steamid,
        personaname: profile.personaname,
        avatarfull: profile.avatarfull,
        profileurl: profile.profileurl,
        realname: profile.realname,
        loccountrycode: profile.loccountrycode,
      },
      recentlyPlayed: games.map(game => ({
        appid: game.appid,
        name: game.name,
        playtime_2weeks: game.playtime_2weeks,
        playtime_forever: game.playtime_forever,
        img_icon_url: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        img_logo_url: `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`,
      })),
      total_games_played_2weeks: recentlyPlayedData.response?.total_count || 0,
    };

    // --- Начало изменений ---
    // 4. Преобразуем объект в строку и сохраняем в Redis с указанием времени жизни (EX)
    await redisClient.set(CACHE_KEY, JSON.stringify(dataToRespondAndCache), {
      EX: CACHE_TTL_SECONDS,
    });
    // --- Конец изменений ---

    return response.status(200).json(dataToRespondAndCache);

  } catch (error) {
    console.error('Error in steam-stats handler:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}