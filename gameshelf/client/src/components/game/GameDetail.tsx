import {
  Users,
  Clock,
  MapPin,
  Calendar,
  Package,
  X,
  Star,
} from 'lucide-react';
import { Modal, Button, Rating, StatusBadge } from '../ui';
import type { GameDetail as GameDetailType } from '../../api/types';
import styles from './GameDetail.module.css';

interface GameDetailProps {
  game: GameDetailType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameDetail({ game, isOpen, onClose }: GameDetailProps) {
  if (!game) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <div className={styles.container}>
        {/* Header with Cover */}
        <div className={styles.header}>
          <div className={styles.coverWrapper}>
            {game.coverUrl ? (
              <img src={game.coverUrl} alt={game.title} className={styles.cover} />
            ) : (
              <div className={styles.coverPlaceholder}>
                {game.title.charAt(0)}
              </div>
            )}
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTop}>
              <StatusBadge status={game.status} />
              <button className={styles.closeButton} onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            <h1 className={styles.title}>{game.title}</h1>
            {game.rating !== null && (
              <div className={styles.ratingSection}>
                <Rating value={game.rating} size="lg" readOnly />
                <span className={styles.ratingValue}>{game.rating.toFixed(1)}</span>
              </div>
            )}
            <div className={styles.actions}>
              <Button variant="primary">Log Play</Button>
              <Button variant="secondary">Edit</Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Users size={18} />
            <div>
              <span className={styles.statValue}>
                {game.minPlayers === game.maxPlayers
                  ? game.minPlayers
                  : `${game.minPlayers}-${game.maxPlayers}`}
              </span>
              <span className={styles.statLabel}>Players</span>
            </div>
          </div>
          <div className={styles.stat}>
            <Clock size={18} />
            <div>
              <span className={styles.statValue}>
                {game.playtimeMin === game.playtimeMax
                  ? `${game.playtimeMin}`
                  : `${game.playtimeMin}-${game.playtimeMax}`}
              </span>
              <span className={styles.statLabel}>Minutes</span>
            </div>
          </div>
          <div className={styles.stat}>
            <Star size={18} />
            <div>
              <span className={styles.statValue}>{game.timesPlayed}</span>
              <span className={styles.statLabel}>Plays</span>
            </div>
          </div>
          <div className={styles.stat}>
            <Calendar size={18} />
            <div>
              <span className={styles.statValue}>{formatDate(game.lastPlayedAt)}</span>
              <span className={styles.statLabel}>Last Played</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {game.description && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Description</h2>
            <p className={styles.description}>{game.description}</p>
          </div>
        )}

        {/* Location */}
        {game.location && (
          <div className={styles.locationBadge}>
            <MapPin size={16} />
            <span>{game.location}</span>
          </div>
        )}

        {/* Categories & Mechanics */}
        <div className={styles.tagsSection}>
          {game.categories.length > 0 && (
            <div className={styles.tagGroup}>
              <h3 className={styles.tagLabel}>Categories</h3>
              <div className={styles.tags}>
                {game.categories.map((cat) => (
                  <span key={cat} className={styles.tag}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
          {game.mechanics.length > 0 && (
            <div className={styles.tagGroup}>
              <h3 className={styles.tagLabel}>Mechanics</h3>
              <div className={styles.tags}>
                {game.mechanics.map((mech) => (
                  <span key={mech} className={`${styles.tag} ${styles.mechanic}`}>
                    {mech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expansions */}
        {game.expansions.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Package size={18} />
              Expansions ({game.expansions.length})
            </h2>
            <ul className={styles.expansionList}>
              {game.expansions.map((exp) => (
                <li key={exp.id} className={styles.expansion}>
                  <span className={styles.expansionName}>{exp.name}</span>
                  <span
                    className={`${styles.expansionStatus} ${exp.owned ? styles.owned : ''}`}
                  >
                    {exp.owned ? 'Owned' : 'Not owned'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Borrow History */}
        {game.borrowHistory.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Borrow History</h2>
            <ul className={styles.historyList}>
              {game.borrowHistory.slice(0, 5).map((record) => (
                <li key={record.id} className={styles.historyItem}>
                  <span className={styles.historyName}>{record.borrower.name}</span>
                  <span className={styles.historyDate}>
                    {formatDate(record.borrowedAt)}
                    {record.returnedAt && ` – ${formatDate(record.returnedAt)}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default GameDetail;

