// api/steam-wishlist.js (Vercel Serverless Function)

export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID;

  if (!steamId) {
    return response.status(500).json({ error: 'Steam ID not configured in environment variables.' });
  }

  // URL для нового эндпоинта списка желаемого
  const wishlistServiceUrl = `https://api.steampowered.com/IWishlistService/GetWishlist/v1?steamid=${steamId}&l=russian`;

  try {
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
      if (wishlistServiceRes.status === 403 || (wishlistServiceData.response && Object.keys(wishlistServiceData.response).length === 0) ) { // Пустой response или 403
        return response.status(200).json({ games: [], message: "Список желаемого приватный, пуст или недоступен." });
      }
      return response.status(wishlistServiceRes.status).json({ error: errorMessage });
    }

    const wishlistItems = wishlistServiceData.response.items;

    if (!Array.isArray(wishlistItems) || wishlistItems.length === 0) {
      return response.status(200).json([]); // Список желаемого пуст
    }

    // Теперь для каждого appid запрашиваем детали
    const gameDetailsPromises = wishlistItems.map(async (item) => {
      const appid = item.appid;
      try {
        // cc=US для получения цен в USD, если они вдруг понадобятся в будущем, l=russian для русских названий
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
            name: gameData.name || `Игра (ID: ${appid})`, // Название из деталей
            header_image: gameData.header_image, // Обложка из деталей
            priority: item.priority, // Приоритет из IWishlistService
            added_timestamp: item.date_added, // Дата добавления из IWishlistService
            // Цены здесь не обрабатываем, как и договаривались
          };
        }
        return null;
      } catch (e) {
        console.error(`Error fetching details for appid ${appid}:`, e);
        return null;
      }
    });

    let gamesWithDetails = (await Promise.all(gameDetailsPromises)).filter(game => game !== null);

    // Сортировка
    gamesWithDetails.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        return b.added_timestamp - a.added_timestamp;
    });

    response.status(200).json(gamesWithDetails);

  } catch (error) {
    console.error('Error processing Steam wishlist:', error);
    response.status(500).json({ error: 'Internal server error while processing wishlist' });
  }
}