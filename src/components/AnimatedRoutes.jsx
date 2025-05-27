import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from '../pages/Home';
import Projects from '../pages/Projects';
// import Skills from '../pages/Skills';
// import Contact from '../pages/Contact';

function AnimatedRoutes() {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      // x: '-100vw', // Можно добавить сдвиг для другого эффекта
    },
    in: {
      opacity: 1,
      // x: 0,
    },
    out: {
      opacity: 0,
      // x: '100vw',
    },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.1, // Длительность анимации потухания/появления
  };

  return (
    <AnimatePresence mode='wait'> {/* 'wait' гарантирует, что старая страница уйдет до появления новой */}
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Projects />
            </motion.div>
          }
        />
        {/* Добавьте роуты для других страниц здесь */}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;