// src/context/AudioContext.jsx
import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  const [isTracksLoading, setIsTracksLoading] = useState(true);
  const [tracksError, setTracksError] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(new Audio());
  const justEndedRef = useRef(false);

  // 'all' - повтор всего плейлиста, 'one' - повтор текущего трека
  const [repeatMode, setRepeatMode] = useState('all'); // Начальное состояние - повтор всего плейлиста

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setIsTracksLoading(true);
        setTracksError(null);
        const response = await fetch('https://raw.githubusercontent.com/2Taskov1ch/tynaevtaskovich.github.io/refs/heads/main/data/music.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTracks(data);
      } catch (e) {
        console.error("Failed to fetch music data:", e);
        setTracksError(e.message);
        setTracks([]);
      } finally {
        setIsTracksLoading(false);
      }
    };
    if (tracks.length === 0 && !tracksError) { //
        fetchMusicData();
    }
  }, [tracks.length, tracksError]); // Добавил tracksError в зависимости

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentTrackIndex] || null;

  const updateMediaSession = useCallback(() => {
    if (!currentTrack || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.composer,
      album: "Taskov1ch Portfolio Mix", // Можно изменить
      artwork: [
        { src: currentTrack.cover, sizes: "512x512", type: "image/jpeg" }, // Убедитесь, что тип корректен
      ],
    });
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [currentTrack, isPlaying]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const switchTrack = useCallback((newIndexCallback) => {
    setIsLoading(true);
    // Если newIndexCallback это функция, вызываем ее с предыдущим значением
    setCurrentTrackIndex(prevIndex =>
        typeof newIndexCallback === 'function' ? newIndexCallback(prevIndex) : newIndexCallback
    );
  }, []);


  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    switchTrack((prevIndex) =>
      prevIndex === null || prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
    );
  }, [tracks.length, switchTrack]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    switchTrack((prevIndex) =>
      prevIndex === null || prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  }, [tracks.length, switchTrack]);

  const setRandomTrack = useCallback(() => { //
    if (tracks.length === 0) return; // Добавил проверку на пустой массив треков
    setIsLoading(true);
    const randomIndex = Math.floor(Math.random() * tracks.length);
    setCurrentTrackIndex(randomIndex);
  }, [tracks.length]);

  const selectTrackById = useCallback((trackId) => {
    if (!tracks || tracks.length === 0) return;
    const newTrackIndex = tracks.findIndex(t => t.id === trackId);
    if (newTrackIndex === -1) {
      console.warn(`Track with id ${trackId} not found.`);
      return;
    }
    if (newTrackIndex === currentTrackIndex) {
      setIsPlaying(prev => !prev); // Используем setIsPlaying для переключения
    } else {
      setIsLoading(true);
      setCurrentTrackIndex(newTrackIndex);
      setIsPlaying(true);
    }
  }, [tracks, currentTrackIndex]);

  // Переключатель Play/Pause, который используется в плеерах
  const togglePlayPause = useCallback(() => {
      if (!currentTrack && tracks.length > 0) { // Если трек не выбран, но треки есть, выбираем первый и играем
          setCurrentTrackIndex(0);
          setIsPlaying(true);
      } else if (currentTrack) {
          setIsPlaying(prev => !prev);
      }
  }, [currentTrack, tracks.length]);


  useEffect(() => {
    if (currentTrackIndex !== null && tracks[currentTrackIndex]) { // Добавил проверку tracks[currentTrackIndex]
      const audio = audioRef.current;
      audio.src = tracks[currentTrackIndex].src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      // Если isPlaying было true, пытаемся запустить трек
      // Это полезно при переключении треков, когда isPlaying уже true
      if (isPlaying) {
        audio.play().catch(e => console.error("Play on track switch failed:", e));
      }
    }
  }, [currentTrackIndex, tracks]); // isPlaying убрал из зависимостей здесь, чтобы не было конфликта с другим useEffect

  useEffect(() => {
    const audio = audioRef.current;
    const handleCanPlay = () => { setIsLoading(false); setDuration(audio.duration); if (isPlaying && audio.paused) audio.play().catch(e => console.error("Play on ready failed:", e)); };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const handleLoadStart = () => setIsLoading(true);
    const handleError = (e) => { setIsLoading(false); console.error("Audio Error:", e); setErrorSteam("Ошибка загрузки трека"); }; // Пример установки ошибки
    const handlePauseEvent = () => { if (!justEndedRef.current) setIsPlaying(false); justEndedRef.current = false; };

    const handleEnded = () => {
      justEndedRef.current = true; // Флаг, что трек закончился сам
      if (repeatMode === 'one' && tracks.length > 0) {
        audio.currentTime = 0;
        audio.play().catch(e => console.error("Play on repeat one failed:", e));
        // isPlaying уже должно быть true, или установится через handlePlaying
      } else if (repeatMode === 'all' && tracks.length > 0) {
        nextTrack();
        setIsPlaying(true);
      } else {
        // Если это был последний трек и repeatMode = 'all', nextTrack уже переключил на первый.
        // Если repeatMode не 'one' и не 'all' (хотя у нас только эти два), или треков нет.
        setIsPlaying(false); // Останавливаем воспроизведение, если нет других условий
      }
    };

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("pause", handlePauseEvent);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    // Синхронизация состояния isPlaying с HTML5 audio элементом
    if (currentTrack) { // Только если есть текущий трек
        if (isPlaying && audio.paused) {
            audio.play().catch(e => console.error("Play sync failed:", e));
        } else if (!isPlaying && !audio.paused) {
            audio.pause();
        }
    } else if (!isPlaying && !audio.paused) { // Если трека нет, но аудио играет (маловероятно, но для безопасности)
        audio.pause();
    }


    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("pause", handlePauseEvent);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isPlaying, nextTrack, repeatMode, currentTrack]); // currentTrack добавлен в зависимости

  useEffect(() => {
    updateMediaSession();
  }, [currentTrack, isPlaying, updateMediaSession]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => { if(currentTrack) play(); else if(tracks.length > 0) { setCurrentTrackIndex(0); play();} });
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
    navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
    // Дополнительные обработчики, если нужны (например, seek)
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, [play, pause, prevTrack, nextTrack, currentTrack, tracks]); // Добавлены currentTrack и tracks

  const seekTrack = useCallback((time) => { //
    if (audioRef.current && isFinite(time) && audioRef.current.duration) { // Добавил audioRef.current.duration для проверки
      audioRef.current.currentTime = Math.max(0, Math.min(time, audioRef.current.duration)); // Ограничиваем время
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const toggleRepeatMode = useCallback(() => {
    setRepeatMode(prevMode => (prevMode === 'all' ? 'one' : 'all'));
  }, []);

  const value = {
    currentTrack,
    isPlaying,
    isLoading: isLoading || isTracksLoading, // Объединенный флаг загрузки
    tracks,
    tracksError, // Передаем ошибку загрузки треков
    currentTime,
    duration,
    play, // Оставляем для прямого вызова, если нужно
    pause, // Оставляем для прямого вызова, если нужно
    nextTrack,
    prevTrack,
    setRandomTrack,
    selectTrackById,
    togglePlayPause, // Основной метод для UI
    seekTrack,
    repeatMode,
    toggleRepeatMode,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};