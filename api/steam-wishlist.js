// api/steam-wishlist.js (Vercel Serverless Function)

export default async function handler(request, response) {
  const steamId = process.env.STEAM_ID; // Ваш Steam ID (64-битный)
  // API ключ больше не нужен для этого эндпоинта
  // const apiKey = process.env.STEAM_API_KEY;

  if (!steamId) {
    return response.status(500).json({ error: 'Steam ID not configured in environment variables.' });
  }

  // Новый URL для получения JSON списка желаемого через IWishlistService
  // l=russian для названий на русском, если API это поддерживает для данного эндпоинта.
  // Если нет, можно использовать l=english или убрать параметр языка.
  const wishlistUrl = `https://api.steampowered.com/IWishlistService/GetWishlist/v1?steamid=${steamId}&l=russian`;
  // Альтернативно, без языка:
  // const wishlistUrl = `https://api.steampowered.com/IWishlistService/GetWishlist/v1?steamid=${steamId}`;


  try {
    const wishlistRes = await fetch(wishlistUrl); // Ключ API здесь не передаем

    if (!wishlistRes.ok) {
      // Попытка прочитать тело ответа при ошибке
      let errorBody = "Unknown error from Steam API.";
      try {
        const errorData = await wishlistRes.json(); // Steam часто возвращает JSON с ошибкой
        if (errorData && errorData.error_description) {
          errorBody = errorData.error_description;
        } else if (errorData && errorData.errormsg) {
            errorBody = errorData.errormsg;
        } else {
            errorBody = await wishlistRes.text(); // Если не JSON, пробуем как текст
        }
      } catch (e) {
        errorBody = await wishlistRes.text().catch(() => `Status ${wishlistRes.status}`);
      }
      console.warn(`Failed to fetch Steam wishlist for ${steamId} (status ${wishlistRes.status}): ${errorBody}`);
      // Статус 403 может означать, что список желаемого приватный
      if (wishlistRes.status === 403) {
        return response.status(200).json({ wishlist: [], error_message: "Список желаемого приватный или недоступен." });
      }
      return response.status(wishlistRes.status).json({ error: `Steam API Error: ${errorBody}` });
    }

    const responseData = await wishlistRes.json();

    // Структура ответа от IWishlistService/GetWishlist/v1:
    // responseData: {
    //   "wishlist": [
    //     {
    //       "appid": 730,
    //       "priority": 0,
    //       "added": 1346390683,
    //       "name": "Counter-Strike 2", // Название может быть включено
    //       "capsule": "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg", // Обложка
    //       "review_score": 9,
    //       "review_desc": "Very Positive",
    //       "reviews_total": "8,068,465",
    //       "reviews_percent": 88,
    //       "release_date": "1345593600",
    //       "release_string": "21 Aug, 2012",
    //       "platform_icons": "<span class=\"platform_img win\"></span><span class=\"platform_img mac\"></span><span class=\"platform_img linux\"></span>",
    //       "subs": [ { "discount_block": "...", "discount_pct": 0, "price": "0" } ], // Информация о цене (может быть сложной)
    //       "type": "Game",
    //       "tags": [ "FPS", "Shooter", ... ],
    //       "is_free_game": true,
    //       // ... и другие поля
    //     }
    //   ],
    //   "success": 1 (или другой код успеха)
    // }

    if (responseData && responseData.wishlist && Array.isArray(responseData.wishlist)) {
      const games = responseData.wishlist.map(game => ({
        appid: game.appid,
        name: game.name || `AppID: ${game.appid}`, // Используем название из ответа, если есть
        header_image: game.capsule || `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`, // Используем capsule или формируем стандартный URL
        priority: game.priority,
        added_timestamp: game.added,
        // Цены мы больше не запрашиваем отдельно и не обрабатываем
        // is_free: game.is_free_game || (game.subs && game.subs.some(sub => sub.price === "0")),
      }));

      // Сортировка по приоритету (меньше = выше) или по дате добавления (новее = выше)
      games.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        return b.added_timestamp - a.added_timestamp; // Новые сверху
      });

      response.status(200).json(games);
    } else {
      console.error('Unexpected data structure from IWishlistService:', responseData);
      response.status(200).json([]); // Возвращаем пустой массив при неожиданном формате
    }

  } catch (error) {
    console.error('Error processing Steam wishlist with IWishlistService:', error);
    response.status(500).json({ error: 'Internal server error while processing wishlist' });
  }
}