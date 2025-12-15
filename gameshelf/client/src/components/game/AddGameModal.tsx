import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Loader2, ExternalLink } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import { useDebouncedCallback } from '../../hooks';
import { mockBGGSearchResults } from '../../api/mock';
import type { BGGSearchResult } from '../../api/types';
import styles from './AddGameModal.module.css';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (game: BGGSearchResult) => void;
}

export function AddGameModal({ isOpen, onClose, onAdd }: AddGameModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BGGSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  // Simulated BGG search
  const searchBGG = useDebouncedCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));
    
    // Filter mock results based on query
    const filtered = mockBGGSearchResults.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // If no matches, show all mock results as "suggestions"
    setResults(filtered.length > 0 ? filtered : mockBGGSearchResults);
    setIsSearching(false);
  }, 300);

  const handleSearch = (value: string) => {
    setQuery(value);
    searchBGG(value);
  };

  const handleAdd = useCallback(async (game: BGGSearchResult) => {
    setAddingId(game.bggId);
    
    // Simulate adding game
    await new Promise((r) => setTimeout(r, 800));
    
    if (onAdd) {
      onAdd(game);
    }
    
    setAddingId(null);
    onClose();
  }, [onAdd, onClose]);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Game" size="lg">
      <div className={styles.container}>
        {/* Search Input */}
        <div className={styles.searchSection}>
          <Input
            placeholder="Search BoardGameGeek..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search size={18} />}
            rightIcon={isSearching ? <Loader2 size={18} className={styles.spinner} /> : undefined}
            autoFocus
          />
          <p className={styles.hint}>
            Search for games on BoardGameGeek to add them to your library
          </p>
        </div>

        {/* Results */}
        <div className={styles.results}>
          <AnimatePresence mode="popLayout">
            {results.map((game, index) => (
              <motion.div
                key={game.bggId}
                className={styles.resultCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className={styles.resultImage}>
                  {game.thumbnailUrl ? (
                    <img src={game.thumbnailUrl} alt={game.title} />
                  ) : (
                    <div className={styles.resultPlaceholder}>
                      {game.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.resultInfo}>
                  <h3 className={styles.resultTitle}>{game.title}</h3>
                  {game.yearPublished && (
                    <span className={styles.resultYear}>{game.yearPublished}</span>
                  )}
                </div>
                <div className={styles.resultActions}>
                  <a
                    href={`https://boardgamegeek.com/boardgame/${game.bggId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.bggLink}
                    title="View on BGG"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAdd(game)}
                    isLoading={addingId === game.bggId}
                    leftIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {!isSearching && query && results.length === 0 && (
            <div className={styles.empty}>
              <p>No games found for "{query}"</p>
              <p className={styles.emptyHint}>Try a different search term</p>
            </div>
          )}

          {/* Initial state */}
          {!query && results.length === 0 && (
            <div className={styles.empty}>
              <Search size={48} className={styles.emptyIcon} />
              <p>Search for a game to add</p>
              <p className={styles.emptyHint}>
                Enter a game title to search BoardGameGeek
              </p>
            </div>
          )}
        </div>

        {/* Manual entry option */}
        <div className={styles.manualSection}>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <Button variant="secondary" fullWidth>
            Add game manually
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default AddGameModal;

