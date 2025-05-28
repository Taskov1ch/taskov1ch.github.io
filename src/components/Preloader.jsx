import React, { useState, useEffect } from "react";
import "../styles/Preloader.css";

const HeartIcon = () => (
  <svg className='heart-icon' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
  </svg>
);

function Preloader({ onComplete }) {
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      setTimeout(() => setShowText(true), 400);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (showText && !closing) {
      setClosing(true);

      setTimeout(onComplete, 700);
    }
  };

  return (
    <div
      className={`preloader-overlay ${closing ? "closing" : ""}`}
      onClick={handleClick}
    >
      <div className={`heart-container ${loading ? "pulsing" : "exiting"}`}>
        <HeartIcon />
      </div>
      <div className={`continue-text ${showText ? "visible" : ""}`}>
        Нажмите чтобы продолжить
      </div>
    </div>
  );
}

export default Preloader;
