import { motion } from 'framer-motion';
import { Users, Clock, Star, MoreVertical } from 'lucide-react';
import { StatusBadge, Rating } from '../ui';
import type { Game } from '../../api/types';
import type { ViewMode } from '../../store/uiStore';
import styles from './GameCard.module.css';

interface GameCardProps {
  game: Game;
  viewMode?: ViewMode;
  onClick?: () => void;
}

export function GameCard({ game, viewMode = 'grid', onClick }: GameCardProps) {
  if (viewMode === 'list') {
    return <GameListItem game={game} onClick={onClick} />;
  }

  if (viewMode === 'table') {
    return <GameTableRow game={game} onClick={onClick} />;
  }

  return (
    <motion.article
      className={styles.card}
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Cover Image */}
      <div className={styles.cover}>
        {game.coverUrl ? (
          <img src={game.coverUrl} alt={game.title} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <span>{game.title.charAt(0)}</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={styles.overlay}>
          <button className={styles.moreButton} aria-label="More options">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Status Badge */}
        <div className={styles.status}>
          <StatusBadge status={game.status} size="sm" />
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.title}>{game.title}</h3>
        
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Users size={14} />
            {game.minPlayers === game.maxPlayers
              ? game.minPlayers
              : `${game.minPlayers}-${game.maxPlayers}`}
          </span>
          <span className={styles.metaItem}>
            <Clock size={14} />
            {game.playtimeMin === game.playtimeMax
              ? `${game.playtimeMin}m`
              : `${game.playtimeMin}-${game.playtimeMax}m`}
          </span>
        </div>

        {game.rating !== null && (
          <div className={styles.rating}>
            <Rating value={game.rating} size="sm" readOnly />
          </div>
        )}
      </div>
    </motion.article>
  );
}

// List Item View
function GameListItem({ game, onClick }: { game: Game; onClick?: () => void }) {
  return (
    <motion.article
      className={styles.listItem}
      onClick={onClick}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.15 }}
    >
      {/* Cover */}
      <div className={styles.listCover}>
        {game.coverUrl ? (
          <img src={game.coverUrl} alt="" loading="lazy" />
        ) : (
          <div className={styles.listPlaceholder}>
            {game.title.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className={styles.listInfo}>
        <h3 className={styles.listTitle}>{game.title}</h3>
        <div className={styles.listMeta}>
          <span>{game.minPlayers}-{game.maxPlayers} players</span>
          <span>•</span>
          <span>{game.playtimeMin}-{game.playtimeMax} min</span>
          {game.categories.length > 0 && (
            <>
              <span>•</span>
              <span>{game.categories.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className={styles.listRating}>
        {game.rating !== null ? (
          <Rating value={game.rating} size="sm" readOnly showValue />
        ) : (
          <span className={styles.noRating}>Not rated</span>
        )}
      </div>

      {/* Status */}
      <div className={styles.listStatus}>
        <StatusBadge status={game.status} />
      </div>

      {/* Actions */}
      <button className={styles.listMore} aria-label="More options">
        <MoreVertical size={18} />
      </button>
    </motion.article>
  );
}

// Table Row View
function GameTableRow({ game, onClick }: { game: Game; onClick?: () => void }) {
  return (
    <motion.article
      className={styles.tableRow}
      onClick={onClick}
      whileHover={{ backgroundColor: 'var(--color-surface-hover)' }}
    >
      <div className={styles.tableCell}>
        <div className={styles.tableCover}>
          {game.coverUrl ? (
            <img src={game.coverUrl} alt="" loading="lazy" />
          ) : (
            <div className={styles.tablePlaceholder}>
              {game.title.charAt(0)}
            </div>
          )}
        </div>
        <span className={styles.tableTitle}>{game.title}</span>
      </div>
      <div className={styles.tableCell}>
        {game.minPlayers}-{game.maxPlayers}
      </div>
      <div className={styles.tableCell}>
        {game.playtimeMin}-{game.playtimeMax} min
      </div>
      <div className={styles.tableCell}>
        {game.rating !== null ? (
          <div className={styles.tableRating}>
            <Star size={14} fill="currentColor" />
            {game.rating.toFixed(1)}
          </div>
        ) : (
          '–'
        )}
      </div>
      <div className={styles.tableCell}>
        <StatusBadge status={game.status} size="sm" />
      </div>
    </motion.article>
  );
}

export default GameCard;

