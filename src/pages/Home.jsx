import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="home-container container">
      <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
      >
        Привет, я <span className="highlight">Taskov1ch</span>! 👋
      </motion.h1>

      <motion.p
        className="subtitle"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        Начинающий <span className="highlight-python">Python</span> разработчик из Кыргызстана.
      </motion.p>

      <motion.div
        className="about-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <p>
          Увлекаюсь созданием полезных инструментов и автоматизацией рутины с помощью Python.
          Активно изучаю веб-разработку, включая фреймворки, такие как Django и Flask,
          а также основы frontend с React.
        </p>
        <p>
          Мне нравится решать сложные задачи и постоянно учиться новому.
          Моя цель - стать full-stack разработчиком и создавать качественные веб-приложения.
        </p>
        <p>
          В свободное время люблю [добавьте сюда свои хобби, например: читать техническую литературу,
          играть в шахматы, гулять в горах].
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, delay: 0.1 }}
      >
        <Link to="/projects" className="cta-button">
          Посмотреть мои проекты →
        </Link>
      </motion.div>
    </div>
  );
}

export default Home;