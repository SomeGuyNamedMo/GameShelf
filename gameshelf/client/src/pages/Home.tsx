import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Star,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Layout } from '../components/layout';
import { GameDetail } from '../components/game/GameDetail';
import { useAuthStore } from '../store/authStore';
import { mockGames, mockLibraries, mockPlaylists, mockGameDetail } from '../api/mock';
import type { Game, GameDetail as GameDetailType } from '../api/types';
import styles from './Home.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Home() {
  const { user } = useAuthStore();
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [topRated, setTopRated] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetailType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleGameClick = (game: Game) => {
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
    setTimeout(() => setSelectedGame(null), 200);
  };

  useEffect(() => {
    // Simulate fetching data
    setRecentGames(
      [...mockGames]
        .sort((a, b) => 
          new Date(b.lastPlayedAt || 0).getTime() - new Date(a.lastPlayedAt || 0).getTime()
        )
        .slice(0, 6)
    );
    setTopRated(
      [...mockGames]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6)
    );
  }, []);

  const stats = [
    { label: 'Total Games', value: mockGames.length, icon: Sparkles },
    { label: 'Libraries', value: mockLibraries.length, icon: Users },
    { label: 'Playlists', value: mockPlaylists.length, icon: Star },
    { label: 'Play Sessions', value: mockGames.reduce((sum, g) => sum + g.timesPlayed, 0), icon: TrendingUp },
  ];

  return (
    <Layout>
      <motion.div
        className={styles.page}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section className={styles.hero} variants={itemVariants}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Welcome back, <span className={styles.accent}>{user?.name?.split(' ')[0] || 'Gamer'}</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Your board game collection awaits. Discover what to play next.
            </p>
          </div>
          <div className={styles.heroActions}>
            <Link to="/library" className={styles.heroCta}>
              Browse Library
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section className={styles.stats} variants={itemVariants}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className={styles.statCard}>
              <div className={styles.statIcon}>
                <Icon size={20} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            </div>
          ))}
        </motion.section>

        {/* Recently Played */}
        <motion.section className={styles.section} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Clock size={20} />
              <h2>Recently Played</h2>
            </div>
            <Link to="/library?sort=lastPlayed" className={styles.sectionLink}>
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.gameGrid}>
            {recentGames.map((game, index) => (
              <motion.div
                key={game.id}
                className={styles.gameCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleGameClick(game)}
              >
                <div className={styles.gameCover}>
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt={game.title} />
                  ) : (
                    <div className={styles.gamePlaceholder}>
                      {game.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.gameMeta}>
                    <span>{game.minPlayers}-{game.maxPlayers} players</span>
                    <span>•</span>
                    <span>{game.playtimeMin}-{game.playtimeMax} min</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Top Rated */}
        <motion.section className={styles.section} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Star size={20} />
              <h2>Top Rated</h2>
            </div>
            <Link to="/library?sort=rating" className={styles.sectionLink}>
              View all
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.gameGrid}>
            {topRated.map((game, index) => (
              <motion.div
                key={game.id}
                className={styles.gameCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleGameClick(game)}
              >
                <div className={styles.gameCover}>
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt={game.title} />
                  ) : (
                    <div className={styles.gamePlaceholder}>
                      {game.title.charAt(0)}
                    </div>
                  )}
                  {game.rating && (
                    <div className={styles.gameRating}>
                      <Star size={12} fill="currentColor" />
                      {game.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className={styles.gameInfo}>
                  <h3 className={styles.gameTitle}>{game.title}</h3>
                  <div className={styles.gameMeta}>
                    <span>{game.timesPlayed} plays</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section className={styles.quickActions} variants={itemVariants}>
          <Link to="/wall" className={styles.actionCard}>
            <div className={styles.actionIcon} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <Sparkles size={24} />
            </div>
            <div className={styles.actionContent}>
              <h3>Wall Mode</h3>
              <p>Beautiful fullscreen display</p>
            </div>
            <ArrowRight size={18} className={styles.actionArrow} />
          </Link>
          <Link to="/playlists" className={styles.actionCard}>
            <div className={styles.actionIcon} style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
              <Star size={24} />
            </div>
            <div className={styles.actionContent}>
              <h3>Playlists</h3>
              <p>Curated game collections</p>
            </div>
            <ArrowRight size={18} className={styles.actionArrow} />
          </Link>
        </motion.section>

        {/* Game Detail Modal */}
        <GameDetail
          game={selectedGame}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      </motion.div>
    </Layout>
  );
}

export default Home;

