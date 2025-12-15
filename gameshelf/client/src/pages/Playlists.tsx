import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Zap, ChevronRight } from 'lucide-react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui';
import { mockPlaylists, mockGames } from '../api/mock';
import type { Playlist } from '../api/types';
import styles from './Playlists.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    setPlaylists(mockPlaylists);
  }, []);

  // Get preview images for playlists
  const getPlaylistPreview = () => {
    // Just grab some random games for preview
    return mockGames.slice(0, 4).map((g) => g.coverUrl);
  };

  return (
    <Layout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Playlists</h1>
            <p className={styles.subtitle}>Organize your games into collections</p>
          </div>
          <Button variant="primary" leftIcon={<Plus size={18} />}>
            Create Playlist
          </Button>
        </div>

        {/* Playlists Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {playlists.map((playlist) => {
            const previews = getPlaylistPreview();
            
            return (
              <motion.div
                key={playlist.id}
                className={styles.card}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                {/* Preview Grid */}
                <div className={styles.preview}>
                  {previews.map((url, i) => (
                    <div key={i} className={styles.previewCell}>
                      {url ? (
                        <img src={url} alt="" />
                      ) : (
                        <div className={styles.previewPlaceholder} />
                      )}
                    </div>
                  ))}
                  {/* Overlay */}
                  <div className={styles.previewOverlay}>
                    <span className={styles.previewIcon}>{playlist.icon}</span>
                  </div>
                </div>

                {/* Info */}
                <div className={styles.info}>
                  <div className={styles.infoHeader}>
                    <h3 className={styles.playlistName}>{playlist.name}</h3>
                    {playlist.isSmartList && (
                      <span className={styles.smartBadge} title="Smart Playlist">
                        <Zap size={12} />
                      </span>
                    )}
                  </div>
                  <p className={styles.gameCount}>
                    {playlist.gameCount} {playlist.gameCount === 1 ? 'game' : 'games'}
                  </p>
                </div>

                {/* Arrow */}
                <div className={styles.arrow}>
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            );
          })}

          {/* Create New Card */}
          <motion.button
            className={styles.createCard}
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className={styles.createIcon}>
              <Plus size={32} />
            </div>
            <span className={styles.createLabel}>New Playlist</span>
          </motion.button>
        </motion.div>

        {/* Smart Playlists Info */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>
              <Zap size={24} />
            </div>
            <div className={styles.infoContent}>
              <h3>Smart Playlists</h3>
              <p>
                Smart playlists automatically include games based on criteria like player count,
                playtime, or availability. They update as your collection changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Playlists;

