import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import musicData from '../data/music.js';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [tracks] = useState(musicData);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());
  const justEndedRef = useRef(false); // <-- Флаг, чтобы отследить конец трека

  const currentTrack = tracks[currentTrackIndex] || null;

  // --- MEDIA SESSION ---
  const updateMediaSession = useCallback(() => {
    if (!currentTrack || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.composer,
      album: 'Taskov1ch Portfolio Mix',
      artwork: [{ src: currentTrack.cover, sizes: '512x512', type: 'image/jpeg' }],
    });
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [currentTrack, isPlaying]);

  // --- УПРАВЛЕНИЕ ---
  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlayPause = useCallback(() => setIsPlaying(prev => !prev), []);

  const switchTrack = useCallback((newIndexCallback) => {
    setIsLoading(true);
    setCurrentTrackIndex(newIndexCallback);
  }, []);

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    switchTrack(prevIndex => prevIndex === null ? 0 : (prevIndex + 1) % tracks.length);
  }, [tracks.length, switchTrack]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    switchTrack(prevIndex => prevIndex === null ? tracks.length - 1 : (prevIndex - 1 + tracks.length) % tracks.length);
  }, [tracks.length, switchTrack]);

  const setRandomTrack = useCallback(() => {
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * tracks.length);
    setCurrentTrackIndex(randomIndex);
  }, [tracks.length]);


  // --- ЭФФЕКТЫ ---

  // Эффект 1: Загрузка трека
  useEffect(() => {
    if (currentTrackIndex !== null) {
      const audio = audioRef.current;
      audio.src = tracks[currentTrackIndex].src;
      audio.load();
    }
  }, [currentTrackIndex, tracks]);

  // Эффект 2: Управление аудио и событиями
  useEffect(() => {
    const audio = audioRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) {
        audio.play().catch(e => console.error("Play on ready failed:", e));
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const handleLoadStart = () => setIsLoading(true);
    const handleError = () => setIsLoading(false);

    // --- ИСПРАВЛЕНА ЛОГИКА ПАУЗЫ ---
    const handlePauseEvent = () => {
        // Устанавливаем паузу, ТОЛЬКО если это не произошло сразу после 'ended'
        if (!justEndedRef.current) {
            setIsPlaying(false);
        }
        justEndedRef.current = false; // Сбрасываем флаг
    };
    // ---------------------------------

    // --- ИСПРАВЛЕНА ЛОГИКА ENDED ---
    const handleEnded = () => {
        justEndedRef.current = true; // Ставим флаг, что трек закончился
        nextTrack(); // Переключаем на следующий
        setIsPlaying(true); // <-- ГЛАВНОЕ: Говорим, что следующий трек ДОЛЖЕН играть
    };
    // ---------------------------------

    // Добавляем слушатели
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);
    audio.addEventListener('pause', handlePauseEvent);
    audio.addEventListener('ended', handleEnded);

    // Логика Play/Pause на основе isPlaying
    if (!isLoading) {
        if (isPlaying && audio.paused) {
            audio.play().catch(e => console.error("Play failed:", e));
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    }

    return () => { // Очистка
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('pause', handlePauseEvent);
        audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, isLoading, nextTrack]); // <-- Зависим от isPlaying, isLoading и nextTrack

  // Эффект 3: Обновление MediaSession
  useEffect(() => {
    updateMediaSession();
  }, [currentTrack, isPlaying, updateMediaSession]);

  // Эффект 4: MediaSession Action Handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [play, pause, prevTrack, nextTrack]);


  const value = {
    currentTrack,
    isPlaying,
    isLoading,
    play,
    pause,
    nextTrack,
    prevTrack,
    setRandomTrack,
    togglePlayPause,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};