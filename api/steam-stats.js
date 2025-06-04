// api/steam-wishlist.js (Vercel Serverless Function)

export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID; // Ваш Steam ID (64-битный)
  const apiKey = process.env.STEAM_API_KEY; // Ваш Steam API Key (если нужен для appdetails, хотя appdetails часто работает без него)

  if (!steamId) {
    return response.status(500).json({ error: 'Steam ID not configured' });
  }

  // URL для получения JSON списка желаемого
  // cc=US для цен в USD. l=english для названий на английском (можно изменить)
  const wishlistUrl = `https://store.steampowered.com/wishlist/profiles/${steamId}/wishlistdata/?cc=US&l=english&p=0&json=1`;

  try {
    const wishlistRes = await fetch(wishlistUrl);
    if (!wishlistRes.ok) {
      // Список желаемого может быть приватным или пустым
      if (wishlistRes.status === 404 || wishlistRes.status === 403 || wishlistRes.status === 500) { // 500 если пустой или приватный
        console.warn(`Steam Wishlist for ${steamId} might be private, empty, or not found (status ${wishlistRes.status}).`);
        return response.status(200).json([]); // Возвращаем пустой массив, если список желаемого недоступен
      }
      throw new Error(`Failed to fetch Steam wishlist: ${wishlistRes.status}`);
    }

    const wishlistData = await wishlistRes.json();

    if (!wishlistData || typeof wishlistData !== 'object') {
      // Если wishlistData это массив (например, при ошибке "The wishlist is empty"), то он не содержит appid
      if (Array.isArray(wishlistData) && wishlistData.length === 0) {
        return response.status(200).json([]); // Список желаемого пуст
      }
      console.error('Unexpected wishlist data format:', wishlistData);
      return response.status(200).json([]); // Возвращаем пустой массив при неожиданном формате
    }

    const appIds = Object.keys(wishlistData);
    if (appIds.length === 0) {
      return response.status(200).json([]); // Список желаемого пуст
    }

    // Получаем детали для каждой игры из списка желаемого
    // Steam API для appdetails может принимать несколько appid через запятую, но для простоты и надежности делаем отдельные запросы
    const gameDetailsPromises = appIds.map(async (appid) => {
      try {
        const appDetailsUrl = `http://store.steampowered.com/api/appdetails?appids=${appid}&cc=US&l=english`;
        const appRes = await fetch(appDetailsUrl);
        if (!appRes.ok) {
          console.warn(`Failed to fetch details for appid ${appid}: ${appRes.status}`);
          return null; // Пропускаем игру, если не удалось получить детали
        }
        const appData = await appRes.json();

        // appData будет объектом, где ключ - это appid
        if (appData && appData[appid] && appData[appid].success) {
          const gameData = appData[appid].data;
          const wishlistInfo = wishlistData[appid] || {}; // Доп. инфо из wishlistdata

          return {
            appid: appid,
            name: gameData.name,
            header_image: gameData.header_image, // URL обложки
            // Информация о цене
            is_free: gameData.is_free || false,
            price_overview: gameData.price_overview ? {
              currency: gameData.price_overview.currency,
              initial: gameData.price_overview.initial, // Изначальная цена в центах
              final: gameData.price_overview.final,     // Финальная цена в центах
              discount_percent: gameData.price_overview.discount_percent,
              initial_formatted: gameData.price_overview.initial_formatted, // Уже отформатированная строка старой цены
              final_formatted: gameData.price_overview.final_formatted,     // Уже отформатированная строка новой цены
            } : null,
            // Дополнительная информация из списка желаемого, если нужна
            priority: wishlistInfo.priority,
            added: wishlistInfo.added, // timestamp добавления
          };
        }
        return null;
      } catch (e) {
        console.error(`Error fetching details for appid ${appid}:`, e);
        return null;
      }
    });

    const gamesWithDetails = (await Promise.all(gameDetailsPromises)).filter(game => game !== null);

    // Сортировка по приоритету в списке желаемого (если есть) или по названию
    gamesWithDetails.sort((a, b) => {
        if (a.priority !== undefined && b.priority !== undefined) {
            return a.priority - b.priority;
        }
        return a.name.localeCompare(b.name);
    });

    response.status(200).json(gamesWithDetails);

  } catch (error) {
    console.error('Error processing Steam wishlist:', error);
    response.status(500).json({ error: 'Internal server error while processing wishlist' });
  }
}