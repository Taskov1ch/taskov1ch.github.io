import { useState, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Links from "./pages/Links";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Preloader from "./components/Preloader";
import MiniPlayer from "./components/MiniPlayer";
import { AudioContext } from "./context/AudioContext";
import "./styles/App.css";
import Donate from "./pages/Donate";
import PlaylistModal from "./components/PlaylistModal";
import "./styles/index.css";
import Dashboard from "./pages/Dashboard";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.25, ease: "easeInOut" },
};
const SPOTIFY =
  "https://open.spotify.com/playlist/3hqWWWwaNflFPwQffTGQSq?si=ZXDcpJPCTwuxemWJiwjDBw";

function App() {
  const location = useLocation();
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const { setRandomTrack, play } = useContext(AudioContext);

  const handlePreloaderComplete = () => {
    setPreloaderDone(true);
    setRandomTrack();
    // play();
  };

  const openPlaylistModal = () => setIsPlaylistModalOpen(true);
  const closePlaylistModal = () => setIsPlaylistModalOpen(false);

  return (
    <div className='app-container'>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      <Header />
      <ScrollToTop />
      <main>
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route
              path='/'
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path='/projects'
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <Projects />
                </motion.div>
              }
            />

            <Route
              path='/links'
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <Links />
                </motion.div>
              }
            />
            <Route
              path='/contacts'
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <Contacts />
                </motion.div>
              }
            />
            <Route
              path='/donate'
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <Donate />
                </motion.div>
              }
            />
            <Route
              path='/dashboard' // Новый маршрут
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <Dashboard />
                </motion.div>
              }
            />
            <Route
              path='*'
              element={
                <motion.div
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={pageTransition}
                  transition={pageTransition.transition}
                >
                  <NotFound />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      {preloaderDone && <MiniPlayer
          onOpenPlaylistModal={openPlaylistModal}
          isPlaylistModalOpen={isPlaylistModalOpen}
        />}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={closePlaylistModal}
        spotifyLink={SPOTIFY}
      />
      <div
        id='footer-intersection-trigger'
        style={{ height: "1px", marginBottom: "-1px" }}
      ></div>
      <Footer />
    </div>
  );
}

export default App;
