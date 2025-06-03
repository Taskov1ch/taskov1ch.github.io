import React, { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import "../styles/InfoCard.css";

const staticMotionProps = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 },
  whileHover: { scale: 1.03, boxShadow: "0 5px 15px rgba(0, 123, 255, 0.1)" },
};

const InfoCard = memo(function InfoCard({ item }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e) => {
      if (item.type !== "copy" || copied) return;

      e.preventDefault();
      e.stopPropagation();

      navigator.clipboard
        .writeText(item.value)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Ошибка копирования: ", err);
          alert("Не удалось скопировать. Попробуйте вручную.");
        });
    },
    [item.type, item.value, copied]
  );

  const CardContent = useCallback(() => (
    <>
      <img
        src={item.icon}
        alt={`${item.title} icon`}
        className='info-card-icon'
      />
      <div className='info-card-content'>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <span
        className={`info-card-action-icon ${item.type === "copy" ? "copy-icon" : "arrow-icon"}`}
      >
        {item.type === "link" ? "→" : "📋"}
      </span>
      {copied && <span className='copied-feedback'>✓ Скопировано!</span>}
    </>
  ), [item.icon, item.title, item.description, item.type, copied]);

  if (item.type === "link") {
    return (
      <motion.a
        href={item.value}
        target='_blank'
        rel='noopener noreferrer'
        className='info-card'
        initial={staticMotionProps.initial}
        animate={staticMotionProps.animate}
        transition={staticMotionProps.transition}
        whileHover={staticMotionProps.whileHover}
      >
        <CardContent />
      </motion.a>
    );
  } else {
    return (
      <motion.div
        className='info-card copyable'
        initial={staticMotionProps.initial}
        animate={staticMotionProps.animate}
        transition={staticMotionProps.transition}
        whileHover={staticMotionProps.whileHover}
        onClick={handleCopy}
      >
        <CardContent />
      </motion.div>
    );
  }
});

export default InfoCard;