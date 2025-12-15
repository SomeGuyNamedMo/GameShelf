import type { GameStatus } from '../../api/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: GameStatus;
  size?: 'sm' | 'md';
}

const statusLabels: Record<GameStatus, string> = {
  AVAILABLE: 'Available',
  BORROWED: 'Borrowed',
  STORAGE: 'In Storage',
};

const statusIcons: Record<GameStatus, string> = {
  AVAILABLE: '●',
  BORROWED: '◐',
  STORAGE: '○',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={`
        ${styles.badge}
        ${styles[status.toLowerCase()]}
        ${styles[size]}
      `.trim()}
      role="status"
      aria-label={`Status: ${statusLabels[status]}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {statusIcons[status]}
      </span>
      <span className={styles.label}>{statusLabels[status]}</span>
    </span>
  );
}

export default StatusBadge;

