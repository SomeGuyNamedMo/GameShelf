import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
  Table,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { Layout } from '../components/layout';
import { Input, Button, StatusBadge } from '../components/ui';
import { GameCard } from '../components/game/GameCard';
import { GameDetail } from '../components/game/GameDetail';
import { useUIStore } from '../store/uiStore';
import { useDebounce } from '../hooks';
import { mockGames, mockGameDetail } from '../api/mock';
import { parseSearchQuery } from '../utils/search';
import type { Game, GameDetail as GameDetailType, GameFilters } from '../api/types';
import styles from './Library.module.css';

const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'rating', label: 'Rating' },
  { value: 'lastPlayed', label: 'Last Played' },
  { value: 'playtime', label: 'Playtime' },
] as const;

export function Library() {
  const { viewMode, setViewMode, sortBy, setSortBy, sortOrder, toggleSortOrder } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetailType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Handle game click
  const handleGameClick = (game: Game) => {
    // In real app, fetch full details. For now, use mock with game data
    const gameDetail: GameDetailType = {
      ...game,
      createdAt: '2024-01-01T10:00:00Z',
      expansions: mockGameDetail.expansions,
      borrowHistory: mockGameDetail.borrowHistory,
    };
    setSelectedGame(gameDetail);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedGame(null), 200); // Clear after animation
  };

  // Fetch games
  useEffect(() => {
    setGames(mockGames);
  }, []);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Apply natural language search
    if (debouncedSearch) {
      const parsedFilters = parseSearchQuery(debouncedSearch);
      
      result = result.filter((game) => {
        // Text search
        const textMatch =
          !parsedFilters.textQuery ||
          game.title.toLowerCase().includes(parsedFilters.textQuery.toLowerCase()) ||
          game.categories.some((c) =>
            c.toLowerCase().includes(parsedFilters.textQuery!.toLowerCase())
          );

        // Player count filter
        const playerMatch =
          !parsedFilters.playerCount ||
          (game.minPlayers <= parsedFilters.playerCount &&
            game.maxPlayers >= parsedFilters.playerCount);

        // Playtime filter
        const playtimeMatch =
          !parsedFilters.maxPlaytime || game.playtimeMax <= parsedFilters.maxPlaytime;

        return textMatch && playerMatch && playtimeMatch;
      });
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((game) => game.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'lastPlayed':
          comparison =
            new Date(b.lastPlayedAt || 0).getTime() -
            new Date(a.lastPlayedAt || 0).getTime();
          break;
        case 'playtime':
          comparison = a.playtimeMin - b.playtimeMin;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [games, debouncedSearch, statusFilter, sortBy, sortOrder]);

  return (
    <Layout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h1 className={styles.title}>Library</h1>
            <span className={styles.count}>{filteredGames.length} games</span>
          </div>

          {/* Search & Controls */}
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Search games... try '2 players under 30 min'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} />}
                clearable
                onClear={() => setSearchQuery('')}
              />
            </div>

            <div className={styles.controlButtons}>
              {/* Filter Toggle */}
              <Button
                variant={showFilters ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<SlidersHorizontal size={18} />}
              >
                Filters
              </Button>

              {/* Sort */}
              <div className={styles.sortGroup}>
                <select
                  className={styles.sortSelect}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as NonNullable<GameFilters['sort']>)}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.sortOrder}
                  onClick={toggleSortOrder}
                  aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  <ArrowUpDown size={16} />
                </button>
              </div>

              {/* View Mode */}
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
                <button
                  className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                >
                  <Table size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className={styles.filtersPanel}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Status</label>
                  <div className={styles.filterChips}>
                    {['', 'AVAILABLE', 'BORROWED', 'STORAGE'].map((status) => (
                      <button
                        key={status || 'all'}
                        className={`${styles.filterChip} ${statusFilter === status ? styles.active : ''}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status ? <StatusBadge status={status as Game['status']} size="sm" /> : 'All'}
                      </button>
                    ))}
                  </div>
                </div>
                {(statusFilter || debouncedSearch) && (
                  <button
                    className={styles.clearFilters}
                    onClick={() => {
                      setStatusFilter('');
                      setSearchQuery('');
                    }}
                  >
                    <X size={14} />
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Game Grid/List */}
        <div className={`${styles.gamesContainer} ${styles[viewMode]}`}>
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <GameCard 
                  game={game} 
                  viewMode={viewMode} 
                  onClick={() => handleGameClick(game)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className={styles.empty}>
            <h3>No games found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Game Detail Modal */}
        <GameDetail
          game={selectedGame}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </div>
    </Layout>
  );
}

export default Library;

