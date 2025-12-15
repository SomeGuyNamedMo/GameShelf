import { useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Rating.module.css';

interface RatingProps {
  value: number | null;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  showValue?: boolean;
}

export function Rating({
  value,
  onChange,
  max = 5,
  size = 'md',
  readOnly = false,
  showValue = false,
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const displayValue = hoverValue ?? value ?? 0;
  const isInteractive = !readOnly && !!onChange;

  const handleClick = useCallback(
    (rating: number) => {
      if (isInteractive) {
        onChange(rating);
      }
    },
    [isInteractive, onChange]
  );

  const handleMouseEnter = useCallback(
    (rating: number) => {
      if (isInteractive) {
        setHoverValue(rating);
      }
    },
    [isInteractive]
  );

  const handleMouseLeave = useCallback(() => {
    if (isInteractive) {
      setHoverValue(null);
    }
  }, [isInteractive]);

  return (
    <div
      className={`${styles.rating} ${styles[size]} ${isInteractive ? styles.interactive : ''}`}
      onMouseLeave={handleMouseLeave}
      role={isInteractive ? 'radiogroup' : undefined}
      aria-label={isInteractive ? 'Rating' : `Rating: ${value ?? 0} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const rating = i + 1;
        const isFilled = rating <= displayValue;
        const isHalfFilled = !isFilled && rating - 0.5 <= displayValue;

        return (
          <motion.button
            key={rating}
            type="button"
            className={`
              ${styles.star}
              ${isFilled ? styles.filled : ''}
              ${isHalfFilled ? styles.halfFilled : ''}
            `.trim()}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            disabled={readOnly}
            whileHover={isInteractive ? { scale: 1.15 } : undefined}
            whileTap={isInteractive ? { scale: 0.95 } : undefined}
            role={isInteractive ? 'radio' : 'presentation'}
            aria-checked={isInteractive ? rating === value : undefined}
            aria-label={isInteractive ? `${rating} star${rating !== 1 ? 's' : ''}` : undefined}
            tabIndex={isInteractive ? 0 : -1}
          >
            <Star
              className={styles.icon}
              fill={isFilled ? 'currentColor' : 'none'}
            />
          </motion.button>
        );
      })}
      {showValue && (
        <span className={styles.value}>
          {value !== null ? value.toFixed(1) : '–'}
        </span>
      )}
    </div>
  );
}

export default Rating;

