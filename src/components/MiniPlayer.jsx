import React, { useContext, useRef, useState, useEffect } from "react";
import { AudioContext } from "../context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/MiniPlayer.css";

const PlayIcon = () => (
  <svg viewBox='0 0 24 24'>
    <path d='M8 5v14l11-7z'></path>
  </svg>
);
const PauseIcon = () => (
  <svg viewBox='0 0 24 24'>
    <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z'></path>
  </svg>
);
const PrevIcon = () => (
  <svg viewBox='0 0 24 24'>
    <path d='M6 6h2v12H6zm3.5 6l8.5 6V6z'></path>
  </svg>
);
const NextIcon = () => (
  <svg viewBox='0 0 24 24'>
    <path d='M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z'></path>
  </svg>
);

function MiniPlayer({ onOpenPlaylistModal }) {
  const { currentTrack, isPlaying, isLoading, togglePlayPause, prevTrack, nextTrack } = useContext(AudioContext);
  const [isNearFooter, setIsNearFooter] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const triggerElement = document.getElementById(
      "footer-intersection-trigger"
    );
    if (!triggerElement) return;

    const observerMargin = `-150px`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearFooter(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: `0px 0px ${observerMargin} 0px`,
        threshold: 0,
      }
    );

    observer.observe(triggerElement);
    return () => observer.unobserve(triggerElement);
  }, []);

  const handleControlClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const transitionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div
      ref={playerRef}
      className={`mini-player ${isLoading ? "loading" : ""} ${isNearFooter ? "hidden" : ""}`}
    >
      <div className="player-clickable-area" onClick={onOpenPlaylistModal}>
        <div className='player-cover-container'>
          <AnimatePresence mode='wait'>
            {isLoading ? (
              <motion.div
                key='spinner'
                {...transitionProps}
                className='spinner-wrapper'
              >
                <LoadingSpinner />
              </motion.div>
            ) : (
              <motion.img
                key={currentTrack.id}
                src={currentTrack.cover}
                alt='Album Cover'
                className='player-cover'
                {...transitionProps}
              />
            )}
          </AnimatePresence>
        </div>

        <div className='player-info'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentTrack.id}
              {...transitionProps}
              className='track-info-wrapper'
            >
              <div className='track-title'>{currentTrack.title}</div>
              <div className='track-composer'>{currentTrack.composer}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className='player-controls'>
        <button
          onClick={(e) => handleControlClick(e, prevTrack)}
          className='control-btn'
          aria-label='Previous Track'
          disabled={isLoading}
        >
          <PrevIcon />
        </button>
        <button
          onClick={(e) => handleControlClick(e, togglePlayPause)}
          className='control-btn play-pause-btn'
          aria-label={isPlaying ? "Pause" : "Play"}
          disabled={isLoading}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          onClick={(e) => handleControlClick(e, nextTrack)}
          className='control-btn'
          aria-label='Next Track'
          disabled={isLoading}
        >
          <NextIcon />
        </button>
      </div>
    </div>
  );
}

export default MiniPlayer;
