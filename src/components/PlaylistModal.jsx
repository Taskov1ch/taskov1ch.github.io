import React, { useContext, useEffect, useRef } from "react";
import { AudioContext } from "../context/AudioContext";
import "../styles/PlaylistModal.css";
import { motion } from "framer-motion";

const SpotifyIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.19 14.33c-.14.23-.44.3-.67.16-.97-.59-2.2-.73-3.63-.4-1.43.33-2.73 1-3.66 1.83-.17.15-.43.15-.6 0-.17-.15-.17-.4 0-.55.98-.87 2.37-1.58 3.9-1.94 1.53-.36 2.86-.2 3.9.43.23.14.3.44.16.67zm1.26-2.12c-.17.28-.55.37-.83.2-1.13-.68-2.8-.88-4.15-.48-1.35.4-2.7.97-3.66 1.6-.2.13-.48.1-.68-.1-.2-.2-.23-.48-.03-.68 1.06-.7 2.5-1.3 3.96-1.73 1.46-.43 3.3-.23 4.5.5.28.17.37.55.2.83zm.13-2.3c-.2.33-.65.43-1 .2-1.3-.8-3.33-1-5.1-.55-1.77.45-3.33 1.1-4.33 1.73-.25.15-.58.06-.73-.2-.15-.25-.06-.58.2-.73 1.1-.7 2.76-1.4 4.66-1.88 1.9-.48 4.08-.28 5.5.6.35.2.45.65.2 1z' />
  </svg>
);
const PlayIconMini = () => (
  <svg className='track-play-icon' viewBox='0 0 24 24'>
    <path d='M8 5v14l11-7z'></path>
  </svg>
);

const PlayIcon = () => <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;

function PlaylistModal({ isOpen, onClose, spotifyLink }) {
  const {
    tracks,
    selectTrackById,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    seekTrack,
    isLoading,
    togglePlayPause
  } = useContext(AudioContext);

  const seekBarRef = useRef(null);

  useEffect(() => {
    const seekBar = seekBarRef.current;
    if (seekBar && duration > 0 && currentTrack) {
      const progressPercentage = (currentTime / duration) * 100;
      seekBar.style.background = `linear-gradient(to right, var(--primary-blue) ${progressPercentage}%, rgba(255, 255, 255, 0.15) ${progressPercentage}%)`;
    } else if (seekBar) {
      seekBar.style.background = 'rgba(255, 255, 255, 0.15)';
    }
  }, [currentTime, duration, currentTrack, isLoading]);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleTrackClick = (trackId) => {
    selectTrackById(trackId);
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleSeekChange = (e) => {
    seekTrack(Number(e.target.value));
  };

  const formatTime = (timeInSeconds) => {
    const value = Math.floor(timeInSeconds || 0);
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <motion.div
      className='modal-overlay playlist-modal-overlay'
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className='modal-content playlist-modal-content'
        onClick={handleModalContentClick}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <button className='close-button' onClick={onClose}>
          ×
        </button>
        <h2>Список треков</h2>
        <ul className='track-list'>
          {tracks.map((track) => (
            <li
              key={track.id}
              className={`track-item ${currentTrack?.id === track.id ? "active" : ""} ${currentTrack?.id === track.id && isPlaying ? "playing" : ""}`}
              onClick={() => handleTrackClick(track.id)}
            >
              <img
                src={track.cover}
                alt={track.title}
                className='track-item-cover'
              />
              <div className='track-item-info'>
                <span className='track-item-title'>{track.title}</span>
                <span className='track-item-composer'>{track.composer}</span>
              </div>
              {currentTrack?.id === track.id && isPlaying && <PlayIconMini />}
            </li>
          ))}
        </ul>
        <a
          href={spotifyLink}
          target='_blank'
          rel='noopener noreferrer'
          className='spotify-button-modal'
        >
          <SpotifyIcon />
          <span>Мой плейлист на Spotify</span>
        </a>

        <div className="playlist-now-playing-bar">
          {currentTrack ? (
            <>
              <img src={currentTrack.cover} alt={currentTrack.title} className="now-playing-cover" />
              <div className="now-playing-details">
                <div className="now-playing-info">
                  <span className="now-playing-title">{currentTrack.title}</span>
                  <span className="now-playing-composer">{currentTrack.composer}</span>
                </div>
                <div className="now-playing-controls-progress">
                  <button
                    onClick={togglePlayPause}
                    className="modal-play-pause-button"
                    disabled={isLoading || !currentTrack}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                  <div className="playback-progress">
                    <span className="time current-time">{formatTime(currentTime)}</span>
                    <input
                    ref={seekBarRef}
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeekChange}
                      className="seek-bar"
                      disabled={!duration || isLoading}
                    />
                    <span className="time duration-time">{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-track-info">Выберите трек для воспроизведения</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PlaylistModal;
