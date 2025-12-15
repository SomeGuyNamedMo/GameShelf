import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import type { Game } from '../../api/types';
import styles from './Coverflow.module.css';

interface CoverflowProps {
  games: Game[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

const CARD_WIDTH = 280;
const CARD_GAP = 20;
const MAX_ROTATION = 45;
const SCALE_FACTOR = 0.15;

export function Coverflow({ games, activeIndex, onIndexChange }: CoverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 300, damping: 30 });

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = CARD_WIDTH / 4;
      const velocity = info.velocity.x;
      const offset = info.offset.x;

      let newIndex = activeIndex;

      if (Math.abs(velocity) > 500) {
        // Velocity-based navigation
        newIndex = velocity > 0 ? activeIndex - 1 : activeIndex + 1;
      } else if (Math.abs(offset) > threshold) {
        // Offset-based navigation
        newIndex = offset > 0 ? activeIndex - 1 : activeIndex + 1;
      }

      // Clamp to valid range
      newIndex = Math.max(0, Math.min(games.length - 1, newIndex));
      onIndexChange(newIndex);
      dragX.set(0);
    },
    [activeIndex, games.length, onIndexChange, dragX]
  );

  const handleCardClick = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        onIndexChange(index);
      }
    },
    [activeIndex, onIndexChange]
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <motion.div
        className={styles.track}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x: springX }}
      >
        {games.map((game, index) => {
          const distance = index - activeIndex;
          
          return (
            <CoverflowCard
              key={game.id}
              game={game}
              distance={distance}
              dragX={springX}
              onClick={() => handleCardClick(index)}
              isActive={index === activeIndex}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

interface CoverflowCardProps {
  game: Game;
  distance: number;
  dragX: ReturnType<typeof useSpring>;
  onClick: () => void;
  isActive: boolean;
}

function CoverflowCard({ game, distance, dragX, onClick, isActive }: CoverflowCardProps) {
  // Calculate position and transforms based on distance from center
  const baseX = distance * (CARD_WIDTH + CARD_GAP);
  
  // Add drag offset to x position
  const x = useTransform(dragX, (value) => baseX + value * 0.5);
  
  // Scale based on distance
  const scale = 1 - Math.abs(distance) * SCALE_FACTOR;
  const clampedScale = Math.max(0.6, Math.min(1, scale));
  
  // Opacity based on distance
  const opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.2);

  return (
    <motion.div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      style={{
        x,
        rotateY: distance === 0 ? 0 : distance < 0 ? MAX_ROTATION : -MAX_ROTATION,
        scale: clampedScale,
        zIndex: 10 - Math.abs(distance),
        opacity,
      }}
      initial={false}
      animate={{
        rotateY: distance === 0 ? 0 : distance < 0 ? MAX_ROTATION : -MAX_ROTATION,
        scale: clampedScale,
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={isActive ? { scale: clampedScale * 1.02 } : undefined}
    >
      <div className={styles.cardInner}>
        {game.coverUrl ? (
          <img src={game.coverUrl} alt={game.title} className={styles.cover} />
        ) : (
          <div className={styles.placeholder}>
            <span>{game.title.charAt(0)}</span>
          </div>
        )}
        <div className={styles.reflection} />
      </div>
    </motion.div>
  );
}

export default Coverflow;

