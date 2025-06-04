export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID;
  const apiKey = process.env.STEAM_API_KEY;

  if (!steamId || !apiKey) {
    return response.status(500).json({ error: 'Steam ID or API Key not configured' });
  }

  const playerSummaryUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
  const recentlyPlayedUrl = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;

  try {
    const [playerSummaryRes, recentlyPlayedRes] = await Promise.all([
      fetch(playerSummaryUrl),
      fetch(recentlyPlayedUrl)
    ]);

    if (!playerSummaryRes.ok || !recentlyPlayedRes.ok) {
      const summaryError = !playerSummaryRes.ok ? await playerSummaryRes.text() : '';
      const playedError = !recentlyPlayedRes.ok ? await recentlyPlayedRes.text() : '';
      console.error('Steam API error:', {
          summaryStatus: playerSummaryRes.status, summaryError,
          playedStatus: recentlyPlayedRes.status, playedError
      });
      return response.status(502).json({ error: 'Failed to fetch data from Steam API' });
    }

    const playerData = await playerSummaryRes.json();
    const recentlyPlayedData = await recentlyPlayedRes.json();

    const profile = playerData.response?.players?.[0] || {};
    const games = recentlyPlayedData.response?.games || [];

    response.status(200).json({
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
    });

  } catch (error) {
    console.error('Error fetching Steam stats:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}