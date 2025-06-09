import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.KV_URL,
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

if (!redisClient.isOpen) {
    await redisClient.connect();
}

export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID;

  if (!steamId) {
    return response.status(500).json({ error: 'Steam ID not configured in environment variables.' });
  }

  const CACHE_KEY = `steam:wishlist:${steamId}`;
  const CACHE_TTL_SECONDS = 3600 * 24;

  try {
    const cachedString = await redisClient.get(CACHE_KEY);
    if (cachedString) {
      return response.status(200).json(JSON.parse(cachedString));
    }

    const wishlistServiceUrl = `https://api.steampowered.com/IWishlistService/GetWishlist/v1?steamid=${steamId}&l=russian`;

    const wishlistServiceRes = await fetch(wishlistServiceUrl);
    let wishlistServiceData;

    try {
      wishlistServiceData = await wishlistServiceRes.json();
    } catch (e) {
      const textError = await wishlistServiceRes.text();
      console.error(`Steam IWishlistService API did not return valid JSON. Status: ${wishlistServiceRes.status}, Body: ${textError}`);
      return response.status(502).json({ error: `Steam API (IWishlistService) returned non-JSON: ${textError.substring(0,100)}` });
    }

    if (!wishlistServiceRes.ok || !wishlistServiceData.response || !wishlistServiceData.response.items) {
      const errorMessage = wishlistServiceData?.response?.error_description || wishlistServiceData?.response?.errormsg || `Failed to fetch wishlist data (status ${wishlistServiceRes.status})`;
      console.warn(`Steam Wishlist (IWishlistService) for ${steamId}: ${errorMessage}`);
      if (wishlistServiceRes.status === 403 || (wishlistServiceData.response && Object.keys(wishlistServiceData.response).length === 0) ) {
        const privateWishlistMessage = { games: [], message: "Список желаемого приватный, пуст или недоступен." };
        await redisClient.set(CACHE_KEY, JSON.stringify(privateWishlistMessage), { EX: CACHE_TTL_SECONDS });
        return response.status(200).json(privateWishlistMessage);
      }
      return response.status(wishlistServiceRes.status).json({ error: errorMessage });
    }

    const wishlistItems = wishlistServiceData.response.items;

    if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) {
        await redisClient.set(CACHE_KEY, JSON.stringify([]), { EX: CACHE_TTL_SECONDS });
        return response.status(200).json([]);
    }

    const gameDetailsPromises = wishlistItems.map(async (item) => {
        const appid = item.appid;
        try {
            const appDetailsUrl = `http://store.steampowered.com/api/appdetails?appids=${appid}&cc=US&l=russian`;
            const appRes = await fetch(appDetailsUrl);
            if (!appRes.ok) {
              console.warn(`Failed to fetch details for appid ${appid}: ${appRes.status}`);
              return null;
            }
            const appData = await appRes.json();

            if (appData && appData[appid] && appData[appid].success) {
              const gameData = appData[appid].data;
              return {
                appid: appid,
                name: gameData.name || `Игра (ID: ${appid})`,
                header_image: gameData.header_image,
                added_timestamp: item.date_added,
              };
            }
            return null;
        } catch (e) {
            console.error(`Error fetching details for appid ${appid}:`, e);
            return null;
        }
    });

    let gamesWithDetails = (await Promise.all(gameDetailsPromises)).filter(game => game !== null);

    gamesWithDetails.sort((a, b) => b.added_timestamp - a.added_timestamp);
    await redisClient.set(CACHE_KEY, JSON.stringify(gamesWithDetails), { EX: CACHE_TTL_SECONDS });
    response.status(200).json(gamesWithDetails);

  } catch (error) {
    console.error('Error processing Steam wishlist:', error);
    response.status(500).json({ error: 'Internal server error while processing wishlist' });
  }
}