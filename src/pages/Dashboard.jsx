import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
// Recharts больше не используется для этой секции, удаляем импорты, если они были только для пончика
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/Dashboard.css";
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
  const [steamStats, setSteamStats] = useState(null); // Состояние для Steam статистики
  const [isLoadingAnixart, setIsLoadingAnixart] = useState(true);
  const [isLoadingSteam, setIsLoadingSteam] = useState(true); // Отдельный лоадер для Steam
  const [errorAnixart, setErrorAnixart] = useState(null);
  const [errorSteam, setErrorSteam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anixartError, setAnixartError] = useState(null); // Отдельное состояние для ошибки Anixart
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchAnixartStats = async () => {
      setIsLoading(true);
      setAnixartError(null); // Сбрасываем предыдущую ошибку
      try {
        const response = await fetch('https://api.anixart.tv/profile/1932711');

        if (!response.ok) {
          // Попытка прочитать тело ошибки, если сервер его предоставил
          let errorBody = "";
          try {
            errorBody = await response.text();
          } catch (e) { /* игнорируем ошибку чтения тела */ }
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
        // Устанавливаем сообщение об ошибке, которое будет отображено в блоке
        setAnixartError(e.message || "Произошла неизвестная ошибка при загрузке данных Anixart.");
        setAnixartStats(null); // Убедимся, что старые данные не отображаются
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnixartStats();
  }, []); // Пустой массив зависимостей - запускается один раз при монтировании

  useEffect(() => {
    const fetchSteamStats = async () => {
      setIsLoadingSteam(true);
      setErrorSteam(null);
      try {
        // const response = await fetch('/api/steam-stats');
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

  const formatPlaytime = (minutes) => {
    if (minutes === 0) return "0 ч";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    let result = "";
    if (hours > 0) {
      result += `${hours} ч `;
    }
    // Можно добавить отображение минут, если нужно
    // if (mins > 0) {
    //   result += `${mins} мин`;
    // }
    return result.trim() || "<1 ч"; // Если меньше часа, но не 0
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

  // Общий лоадер для всей страницы, если это необходимо
  // if (isLoading && !anixartStats && !anixartError) {
  //   return <div className='page-loading-container'><LoadingSpinner /></div>;
  // }

  if (isLoadingAnixart && isLoadingSteam) {
    return <div className='page-loading-container'><LoadingSpinner /></div>;
  }

  const steamAvatarGifUrl = "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/1070330/97227479c36b82d531c866562be67193c691a6d5.gif";
  const steamAvatarFrameUrl = "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/2873080/7591f6defdeafebf72d2bfdc75fc7568262557ba.png";


  return (
    <motion.div
      className='dashboard-container container'
      initial='initial' animate='animate' exit='exit'
      variants={pageTransition} transition={pageTransition.transition}
    >
      <h1>Моя доска</h1>
      <section className='dashboard-section'>
        <h2>Статистика GitHub</h2><p>Здесь будет ваша статистика с GitHub.</p>
      </section>

      <section className='dashboard-section steam-stats'>
        <h2>Моя Steam статистика</h2>
        {isLoadingSteam && <LoadingSpinner />}
        {errorSteam && !steamStats && <p className='error-message'>Ошибка загрузки Steam данных: {errorSteam}</p>}
        {steamStats && steamStats.profile && ( // Убедимся, что profile существует
          <>
            <div className='steam-profile-header'>
              <div className="steam-avatar-container">
                <img
                  src={steamAvatarGifUrl} // Ваша анимированная аватарка GIF
                  alt={steamStats.profile.personaname || 'Steam Avatar'}
                  className='steam-avatar-actual'
                />
                <img
                  src={steamAvatarFrameUrl} // Ваша анимированная рамка (APNG)
                  alt="Steam Avatar Frame"
                  className='steam-avatar-frame'
                />
              </div>
              <div className='steam-profile-info'>
                <h3>
                  <a href={steamStats.profile.profileurl} target="_blank" rel="noopener noreferrer">
                    {steamStats.profile.personaname || 'Неизвестный игрок'}
                  </a>
                </h3>
                {steamStats.profile.realname && <p>Имя: {steamStats.profile.realname}</p>}
                {steamStats.profile.loccountrycode && <p>Страна: {steamStats.profile.loccountrycode}</p>}
              </div>
            </div>

            <h4>Недавно сыгранные игры (за 2 недели):</h4>
            {steamStats.recentlyPlayed && steamStats.recentlyPlayed.length > 0 ? (
              <ul className='steam-games-list'>
                {steamStats.recentlyPlayed.map(game => (
                  <li key={game.appid} className='steam-game-item'>
                    <img src={game.img_icon_url} alt={game.name} className='steam-game-icon' />
                    <div className='steam-game-details'>
                      <span className='steam-game-name'>{game.name}</span>
                      <span className='steam-game-playtime'>
                        За 2 недели: {formatPlaytime(game.playtime_2weeks)} <br />
                        Всего: {formatPlaytime(game.playtime_forever)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{steamStats.total_games_played_2weeks > 0 ? `Сыграно игр за 2 недели: ${steamStats.total_games_played_2weeks}, но нет детальной статистики.` : 'Нет данных о недавно сыгранных играх.'}</p>
            )}
          </>
        )}
      </section>

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
             <p>Данные Anixart не загружены.</p> // На случай если stats null, но ошибки нет (маловероятно при такой логике)
        )}
      </section>

      <section className='dashboard-section'>
        <h2>Моя игровая статистика</h2><p>Здесь будет ваша игровая статистика.</p>
      </section>
    </motion.div>
  );
}

export default Dashboard;