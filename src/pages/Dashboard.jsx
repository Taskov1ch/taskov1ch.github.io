import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import "./Dashboard.css";
import LoadingSpinner from "../components/LoadingSpinner";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ANIME_STATUS_COLORS = {
  watching: "#00c65c",
  plan: "#d600ff",
  completed: "#0098ff",
  hold_on: "#ffa500",
  dropped: "#ff0000",
};

const ANIME_STATUS_NAMES_RU = {
  watching: "Смотрю",
  plan: "В планах",
  completed: "Просмотрено",
  hold_on: "Отложено",
  dropped: "Брошено",
};

function Dashboard() {
  const [anixartStats, setAnixartStats] = useState(null);
  const [steamStats, setSteamStats] = useState(null);
  const [isLoadingAnixart, setIsLoadingAnixart] = useState(true);
  const [isLoadingSteam, setIsLoadingSteam] = useState(true);
  const [errorAnixart, setErrorAnixart] = useState(null);
  const [errorSteam, setErrorSteam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anixartError, setAnixartError] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchAnixartStats = async () => {
      setIsLoading(true);
      setAnixartError(null);
      try {
        const response = await fetch('https://api.anixart.tv/profile/1932711');

        if (!response.ok) {
          let errorBody = "";
          try {
            errorBody = await response.text();
          } catch (e) {}
          console.error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
          throw new Error(`Не удалось получить данные от Anixart. Статус: ${response.status}`);
        }

        const data = await response.json();

        if (data.code === 0 && data.profile) {
          setAnixartStats(data.profile);
        } else {
          console.error("Invalid data structure from Anixart API:", data);
          throw new Error("Получена некорректная структура данных от Anixart.");
        }
      } catch (e) {
        console.error("Не удалось загрузить статистику Anixart:", e);
        setAnixartError(e.message || "Произошла неизвестная ошибка при загрузке данных Anixart.");
        setAnixartStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnixartStats();
  }, []);

  useEffect(() => {
    const fetchSteamStats = async () => {
      setIsLoadingSteam(true);
      setErrorSteam(null);
      try {
        const response = await fetch('/api/steam-stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Steam Stats API error: ${response.status}`);
        }
        const data = await response.json();
        setSteamStats(data);
      } catch (e) {
        console.error('Failed to fetch Steam stats:', e);
        setErrorSteam(e.message);
      } finally {
        setIsLoadingSteam(false);
      }
    };
    fetchSteamStats();
  }, []);

  useEffect(() => {
    const fetchSteamWishlist = async () => {
      setIsLoadingWishlist(true);
      setErrorWishlist(null);
      try {
        const response = await fetch('/api/steam-wishlist');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: `Steam Wishlist API error: ${response.status}` }));
          throw new Error(errorData.error || `Steam Wishlist API: ${response.status}`);
        }
        const data = await response.json();
        setSteamWishlist(data);
      } catch (e) {
        console.error('Failed to fetch Steam wishlist:', e);
        setErrorWishlist(e.message || "Ошибка загрузки списка желаемого Steam.");
        setSteamWishlist([]);
      } finally {
        setIsLoadingWishlist(false);
      }
    };
    fetchSteamWishlist();
  }, []);

  const formatPlaytime = (minutes) => {
    if (minutes === 0) return "0 ч";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours} ч `;
    }
    if (mins > 0) {
      result += `${mins} мин`;
    }
    return result.trim() || "<1 ч";
  };

  const preparedAnimeStats = useMemo(() => {
    if (!anixartStats) return [];
    const counts = {
      watching: anixartStats.watching_count || 0, plan: anixartStats.plan_count || 0,
      completed: anixartStats.completed_count || 0, hold_on: anixartStats.hold_on_count || 0,
      dropped: anixartStats.dropped_count || 0,
    };
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    if (totalCount === 0) return [];
    return Object.keys(ANIME_STATUS_NAMES_RU).map(statusKey => ({
      name: ANIME_STATUS_NAMES_RU[statusKey], value: counts[statusKey],
      percentage: totalCount > 0 ? (counts[statusKey] / totalCount) * 100 : 0,
      color: ANIME_STATUS_COLORS[statusKey], key: statusKey,
    })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  }, [anixartStats]);

  const pageTransition = {
    initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }, transition: { duration: 0.25, ease: "easeInOut" },
  };

  if (isLoadingAnixart && isLoadingSteam) {
    return <div className='page-loading-container'><LoadingSpinner /></div>;
  }

  const steamAvatarGifUrl = "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/1070330/97227479c36b82d531c866562be67193c691a6d5.gif";

  if (isLoadingAnixart && isLoadingSteam) {
    return <div className='page-loading-container'><LoadingSpinner /></div>;
  }
  const steamAvatarFrameUrl = "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/2873080/7591f6defdeafebf72d2bfdc75fc7568262557ba.png";


  return (
    <motion.div
      className='dashboard-container container'
      initial='initial' animate='animate' exit='exit'
      variants={pageTransition} transition={pageTransition.transition}
    >
      <h1>Моя доска</h1>



      <section className='dashboard-section anixart-stats'>
        <h2>Моя аниме статистика (Anixart)</h2>
        {isLoading && <LoadingSpinner />}
        {anixartError && !isLoading && (
          <p className="error-message-inline">Не удалось получить данные: {anixartError}</p>
        )}
        {!isLoading && !anixartError && anixartStats && (
          <>
            <div className='anixart-profile-header'>
              {anixartStats.avatar && (<img src={anixartStats.avatar} alt={anixartStats.login} className='anixart-avatar' />)}
              <div className='anixart-profile-info'>
                <h3>
                  {anixartStats.login}
                  {anixartStats.badge?.image_url && (<img src={anixartStats.badge.image_url} alt={anixartStats.badge.name} className='anixart-badge' title={anixartStats.badge.name} />)}
                </h3>
                {anixartStats.status && <p className='anixart-status' dangerouslySetInnerHTML={{ __html: anixartStats.status.replace(/\n/g, '<br />') }}></p>}
              </div>
            </div>

            <h4>Статусы просмотра:</h4>
            {preparedAnimeStats.length > 0 ? (
              <div className="custom-progress-bar-container">
                <div className="custom-progress-bar">
                  {preparedAnimeStats.map(stat => (
                    <div
                      key={stat.key}
                      className="custom-progress-bar-segment"
                      style={{ width: `${stat.percentage}%`, backgroundColor: stat.color }}
                      title={`${stat.name}: ${stat.value} (${stat.percentage.toFixed(1)}%)`}
                    >
                      {stat.percentage > (isMobile ? 10 : 7) && (
                        <span className="segment-percentage">
                          {stat.percentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="custom-legend">
                  {preparedAnimeStats.map(stat => (
                    <div key={stat.key} className="custom-legend-item">
                      <span className="legend-color-indicator" style={{ backgroundColor: stat.color }}></span>
                      <span className="legend-text">
                        {stat.name}: {stat.value} <span className="legend-percentage">({stat.percentage.toFixed(1)}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : ( <p>Нет данных о статусах просмотра.</p> )}

            <h4>История просмотров:</h4>
            {anixartStats.history && anixartStats.history.length > 0 ? (
              <ul className='anixart-history-list'>
                {anixartStats.history.slice(0, 10).map((item) => {
                  const animeId = item.id;
                  const anixartReleaseUrl = `https://beta.anixart.tv/release/${animeId}`;
                  return (
                    <a key={item['@id'] || animeId} href={anixartReleaseUrl} target="_blank" rel="noopener noreferrer" className='anixart-history-item-link'>
                      <li className='anixart-history-item-content'>
                        <img src={item.image || `https://via.placeholder.com/50x70?text=${item.title_ru?.charAt(0) || 'A'}`} alt={item.title_ru || 'Обложка аниме'} className='history-poster' />
                        <div className='history-details'>
                          <span className='history-title'>{item.title_ru || 'Без названия'}</span>
                          <span className='history-episode'>Эпизод: {item.last_view_episode?.name || 'N/A'}</span>
                          <span className='history-time'>Просмотрено: {formatTimestamp(item.last_view_timestamp)}</span>
                        </div>
                      </li>
                    </a>
                  );
                })}
              </ul>
            ) : ( <p>История просмотров пуста.</p> )}
          </>
        )}
        {!isLoading && !anixartError && !anixartStats && (
             <p>Данные Anixart не загружены.</p>
        )}
      </section>

      <section className='dashboard-section steam-stats'>
        <h2>Моя Steam статистика</h2>
        {errorSteam && <p className='error-message'>Ошибка Steam: {errorSteam}</p>}
        {!errorSteam && !steamStats && !isLoadingSteam && <p>Данные Steam не загружены.</p>}
        {steamStats && steamStats.profile && (
          <div className='steam-profile-header'>
            <div className="steam-avatar-container">
              <img
                src={steamAvatarGifUrl}
                alt={steamStats.profile.personaname || 'Steam Avatar'}
                className='steam-avatar-actual'
                onError={(e) => { e.target.onerror = null; e.target.src = STEAM_AVATAR_FALLBACK_URL; }}
              />
              <img
                src={steamAvatarFrameUrl}
                alt="Steam Avatar Frame"
                className='steam-avatar-frame'
              />
            </div>
            <div className='steam-profile-info'>
              <h3>
                <a href={steamStats.profile.profileurl} target="_blank" rel="noopener noreferrer">
                  {steamStats.profile.personaname || 'Игрок Steam'}
                </a>
              </h3>
              {steamStats.profile.realname && <p>Имя: {steamStats.profile.realname}</p>}
              {steamStats.profile.loccountrycode && <p>Страна: {steamStats.profile.loccountrycode}</p>}
            </div>
          </div>
        )}

        {steamStats?.recentlyPlayed && (
            <>
                <h4>Недавно сыгранные игры (за 2 недели):</h4>
                {steamStats.recentlyPlayed.length > 0 ? (
                  <ul className='steam-games-list'>
                    {steamStats.recentlyPlayed.map(game => {
                      const gameStoreUrl = `https://store.steampowered.com/app/${game.appid}`;
                      return (
                        <a
                          key={game.appid}
                          href={gameStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="steam-game-item-link"
                        >
                          <li className='steam-game-item-content'>
                            <img src={game.img_icon_url} alt={game.name} className='steam-game-icon' />
                            <div className='steam-game-details'>
                              <span className='steam-game-name'>{game.name}</span>
                              <span className='steam-game-playtime'>
                                За 2 нед.: {formatPlaytime(game.playtime_2weeks)} | Всего: {formatPlaytime(game.playtime_forever)}
                              </span>
                            </div>
                          </li>
                        </a>
                      );
                    })}
                  </ul>
                ) : (
                  <p>{steamStats.total_games_played_2weeks > 0 ? `Сыграно игр за 2 недели: ${steamStats.total_games_played_2weeks}, но нет детальной статистики.` : 'Нет данных о недавно сыгранных играх.'}</p>
                )}
            </>
        )}
      </section>

       <section className='dashboard-section steam-wishlist-section'>
        <h2>Мои желания в Steam</h2>
        {isLoadingWishlist && <LoadingSpinner />}
        {errorWishlist && <p className='error-message'>Ошибка: {errorWishlist}</p>}
        {!isLoadingWishlist && !errorWishlist && steamWishlist.length === 0 && <p>Список желаемого пуст или не удалось загрузить.</p>}

        {steamWishlist.length > 0 && (
          <div className="steam-wishlist-grid">
            {steamWishlist.map(game => {
              // Ссылка для "подарка" - просто ссылка на страницу игры.
              // Подарок самому себе невозможен, но ссылка на страницу игры полезна.
              // Для подарка другому пользователю нужен его SteamID, но это усложнит.
              // Просто ссылка на страницу игры:
              const gameStoreUrl = `https://store.steampowered.com/app/${game.appid}/`;
              // Для прямой отправки подарка (если бы это было возможно через URL для КОНКРЕТНОГО ДРУГА):
              // const giftUrl = `steam://run//gift/${game.appid}/TARGET_STEAM_ID`; (это не работает просто так)
              // Так как дарим "taskov1ch" (т.е. себе, что Steam не позволит напрямую через URL для покупки в подарок),
              // то просто откроем страницу игры. Если бы был другой Steam ID, то можно было бы попробовать
              // сформировать ссылку для покупки в подарок, но это не всегда работает через URL.
              // Безопаснее всего просто ссылка на страницу игры.

              return (
                <a
                  key={game.appid}
                  href={gameStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wishlist-game-card"
                  title={`Перейти на страницу ${game.name} в Steam`}
                >
                  <img src={game.header_image} alt={game.name} className="wishlist-game-image" />
                  <div className="wishlist-game-info">
                    <h5 className="wishlist-game-name">{game.name}</h5>
                    {game.price_overview ? (
                      <div className="wishlist-game-price">
                        {game.price_overview.discount_percent > 0 ? (
                          <>
                            <span className="original-price">{game.price_overview.initial_formatted}</span>
                            <span className="discounted-price">{game.price_overview.final_formatted}</span>
                            <span className="discount-badge">-{game.price_overview.discount_percent}%</span>
                          </>
                        ) : (
                          <span className="current-price">{game.price_overview.final_formatted}</span>
                        )}
                      </div>
                    ) : game.is_free ? (
                      <span className="current-price free-game">Бесплатно</span>
                    ) : (
                      <span className="current-price">Цена не указана</span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <section>
        Возможно ещё что-то будет здесь...
      </section>

    </motion.div>
  );
}

export default Dashboard;