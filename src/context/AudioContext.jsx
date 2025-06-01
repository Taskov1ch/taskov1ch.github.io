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
    if (tracks.length === 0 && !tracksError) {
        fetchMusicData();
    }
  }, []);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentTrackIndex] || null;

  const updateMediaSession = useCallback(() => {
    if (!currentTrack || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.composer,
      album: "Taskov1ch Portfolio Mix",
      artwork: [
        { src: currentTrack.cover, sizes: "512x512", type: "image/jpeg" },
      ],
    });
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [currentTrack, isPlaying]);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlayPause = useCallback(() => setIsPlaying((prev) => !prev), []);

  const switchTrack = useCallback((newIndexCallback) => {
    setIsLoading(true);
    setCurrentTrackIndex(newIndexCallback);
  }, []);

  const seekTrack = useCallback((time) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    switchTrack((prevIndex) =>
      prevIndex === null ? 0 : (prevIndex + 1) % tracks.length
    );
  }, [tracks.length, switchTrack]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    switchTrack((prevIndex) =>
      prevIndex === null
        ? tracks.length - 1
        : (prevIndex - 1 + tracks.length) % tracks.length
    );
  }, [tracks.length, switchTrack]);

  const setRandomTrack = useCallback(() => {
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
      togglePlayPause();
    } else {
      setIsLoading(true);
      setCurrentTrackIndex(newTrackIndex);
      setIsPlaying(true);
    }
  }, [tracks, currentTrackIndex, togglePlayPause]);

  useEffect(() => {
    if (currentTrackIndex !== null) {
      const audio = audioRef.current;
      audio.src = tracks[currentTrackIndex].src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
    }
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    const audio = audioRef.current;

    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration);
      if (isPlaying) {
        audio.play().catch((e) => console.error("Play on ready failed:", e));
      }
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleError = () => setIsLoading(false);

    const handlePauseEvent = () => {
      if (!justEndedRef.current) {
        setIsPlaying(false);
      }
      justEndedRef.current = false;
    };

    const handleEnded = () => {
      justEndedRef.current = true;
      nextTrack();
      setIsPlaying(true);
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

    if (!isLoading) {
      if (isPlaying && audio.paused) {
        audio.play().catch((e) => console.error("Play failed:", e));
      } else if (!isPlaying && !audio.paused) {
        audio.pause();
      }
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
  }, [isPlaying, isLoading, nextTrack]);

  useEffect(() => {
    updateMediaSession();
  }, [currentTrack, isPlaying, updateMediaSession]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
    navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    };
  }, [play, pause, prevTrack, nextTrack]);

  const value = {
    currentTrack,
    isPlaying,
    isLoading,
    tracks,
    currentTime,
    duration,
    play,
    pause,
    nextTrack,
    prevTrack,
    setRandomTrack,
    togglePlayPause,
    selectTrackById,
    seekTrack,
    togglePlayPause
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
