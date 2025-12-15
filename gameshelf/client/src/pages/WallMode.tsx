import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Users, Clock, Star } from 'lucide-react';
import { Coverflow } from '../components/coverflow/Coverflow';
import { mockGames } from '../api/mock';
import type { Game } from '../api/types';
import styles from './WallMode.module.css';

export function WallMode() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    // Filter to games with covers for better visual
    setGames(mockGames.filter((g) => g.coverUrl));
  }, []);

  const activeGame = games[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : games.length - 1));
  }, [games.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0));
  }, [games.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          navigate(-1);
          break;
        case ' ':
          setShowInfo((prev) => !prev);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, navigate]);

  if (games.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Background */}
      <div className={styles.background}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame?.id}
            className={styles.bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: activeGame?.coverUrl
                ? `url(${activeGame.coverUrl})`
                : undefined,
            }}
          />
        </AnimatePresence>
        <div className={styles.bgOverlay} />
      </div>

      {/* Close Button */}
      <button
        className={styles.closeButton}
        onClick={() => navigate(-1)}
        aria-label="Exit Wall Mode"
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      <button
        className={`${styles.navButton} ${styles.navPrev}`}
        onClick={handlePrev}
        aria-label="Previous game"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        className={`${styles.navButton} ${styles.navNext}`}
        onClick={handleNext}
        aria-label="Next game"
      >
        <ChevronRight size={32} />
      </button>

      {/* Coverflow */}
      <div className={styles.coverflowContainer}>
        <Coverflow
          games={games}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />
      </div>

      {/* Game Info */}
      <AnimatePresence>
        {showInfo && activeGame && (
          <motion.div
            className={styles.gameInfo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className={styles.gameTitle}>{activeGame.title}</h1>
            <div className={styles.gameMeta}>
              <div className={styles.metaItem}>
                <Users size={18} />
                <span>
                  {activeGame.minPlayers === activeGame.maxPlayers
                    ? `${activeGame.minPlayers} players`
                    : `${activeGame.minPlayers}-${activeGame.maxPlayers} players`}
                </span>
              </div>
              <div className={styles.metaItem}>
                <Clock size={18} />
                <span>{activeGame.playtimeMin}-{activeGame.playtimeMax} min</span>
              </div>
              {activeGame.rating && (
                <div className={styles.metaItem}>
                  <Star size={18} fill="currentColor" />
                  <span>{activeGame.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            {activeGame.categories.length > 0 && (
              <div className={styles.categories}>
                {activeGame.categories.slice(0, 3).map((cat) => (
                  <span key={cat} className={styles.category}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className={styles.progress}>
        <span className={styles.progressText}>
          {activeIndex + 1} / {games.length}
        </span>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            animate={{ width: `${((activeIndex + 1) / games.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Help */}
      <div className={styles.help}>
        Press <kbd>←</kbd> <kbd>→</kbd> to navigate • <kbd>Space</kbd> to toggle info • <kbd>Esc</kbd> to exit
      </div>
    </div>
  );
}

export default WallMode;

