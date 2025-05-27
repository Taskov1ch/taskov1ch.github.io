import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import { musicPlaylist } from '../data/music';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [playlist] = useState(musicPlaylist);
  const [currentSongIndex, setCurrentSongIndex] = useState(null); // null - не выбрано
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false); // Для полного плеера
  const audioRef = useRef(null);

  // Выбираем случайный трек для старта
  const playRandom = useCallback(() => {
    if (playlist.length > 0) {
        const randomIndex = Math.floor(Math.random() * playlist.length);
        setCurrentSongIndex(randomIndex);
        setIsPlaying(true);
    }
  }, [playlist]);


  const playPause = () => {
      if (currentSongIndex === null && playlist.length > 0) {
          playRandom(); // Если ничего не играло, запускаем случайный
      } else if (currentSongIndex !== null) {
          setIsPlaying(!isPlaying);
      }
  };

  const nextSong = useCallback(() => {
      if (playlist.length === 0) return;
      setCurrentSongIndex((prevIndex) =>
        prevIndex === null ? 0 : (prevIndex + 1) % playlist.length
      );
      setIsPlaying(true);
  }, [playlist.length]);

  const prevSong = () => {
      if (playlist.length === 0) return;
      setCurrentSongIndex((prevIndex) =>
          prevIndex === null ? playlist.length - 1 : (prevIndex - 1 + playlist.length) % playlist.length
      );
      setIsPlaying(true);
  };

   const selectSong = (index) => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
   };

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying && currentSongIndex !== null) {
            audioRef.current.src = playlist[currentSongIndex].src;
            audioRef.current.play().catch(error => console.error("Audio play failed:", error));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentSongIndex, playlist]);

   // Автоматически переключать на следующий трек
   useEffect(() => {
       const audio = audioRef.current;
       if (audio) {
           const handleEnded = () => nextSong();
           audio.addEventListener('ended', handleEnded);
           return () => audio.removeEventListener('ended', handleEnded);
       }
   }, [nextSong]);


  const currentSong = currentSongIndex !== null ? playlist[currentSongIndex] : null;

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        currentSongIndex,
        currentSong,
        isPlaying,
        isPlayerVisible,
        playPause,
        nextSong,
        prevSong,
        selectSong,
        playRandom,
        setIsPlayerVisible,
        audioRef, // Передаем ref, чтобы прелоадер мог его использовать
      }}
    >
      {children}
       <audio ref={audioRef} /> {/* HTML5 аудио элемент */}
    </PlayerContext.Provider>
  );
};