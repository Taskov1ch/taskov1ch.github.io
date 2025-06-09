import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

if (!redisClient.isOpen) {
    await redisClient.connect();
}

export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamId || !apiKey) {
    return response.status(500).json({ error: 'Steam ID or API Key not configured' });
  }

  const CACHE_KEY = `steam:stats:${steamId}`;
  const CACHE_TTL_SECONDS = 3600;

  try {
    const cachedString = await redisClient.get(CACHE_KEY);

    if (cachedString) {
      return response.status(200).json(JSON.parse(cachedString));
    }

    const playerSummaryUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
    const recentlyPlayedUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;

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
        img_icon_url: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        img_logo_url: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`,
      })),
      total_games_played_2weeks: recentlyPlayedData.response?.total_count || 0,
    };

    await redisClient.set(CACHE_KEY, JSON.stringify(dataToRespondAndCache), {
      EX: CACHE_TTL_SECONDS,
    });

    return response.status(200).json(dataToRespondAndCache);

  } catch (error) {
    console.error('Error in steam-stats handler:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}