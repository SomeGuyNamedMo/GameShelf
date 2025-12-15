import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Library,
  ListMusic,
  Monitor,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Gamepad2,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { AddGameModal } from '../game/AddGameModal';
import styles from './Sidebar.module.css';

const mainNavItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/library', icon: Library, label: 'Library' },
  { path: '/playlists', icon: ListMusic, label: 'Playlists' },
  { path: '/wall', icon: Monitor, label: 'Wall Mode' },
];

const bottomNavItems = [
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const { user, logout } = useAuthStore();
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddGame = () => {
    setIsAddGameOpen(false);
    // Optionally refresh game list or show success toast
  };

  return (
    <motion.aside
      className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}
      animate={{ width: sidebarCollapsed ? 72 : 280 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Gamepad2 size={28} />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              className={styles.logoText}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
            >
              GameShelf
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {mainNavItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || 
              (path !== '/' && location.pathname.startsWith(path));

            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  title={sidebarCollapsed ? label : undefined}
                >
                  <span className={styles.navIcon}>
                    <Icon size={20} />
                  </span>
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        className={styles.navLabel}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={styles.activeIndicator}
                      layoutId="sidebar-indicator"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Add Game Button */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              className={styles.addSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button 
                className={styles.addButton}
                onClick={() => setIsAddGameOpen(true)}
              >
                <Plus size={18} />
                <span>Add Game</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Game Modal */}
        <AddGameModal
          isOpen={isAddGameOpen}
          onClose={() => setIsAddGameOpen(false)}
          onAdd={handleAddGame}
        />
      </nav>

      {/* Bottom Section */}
      <div className={styles.bottom}>
        {/* Bottom Nav Items */}
        <ul className={styles.navList}>
          {bottomNavItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  title={sidebarCollapsed ? label : undefined}
                >
                  <span className={styles.navIcon}>
                    <Icon size={20} />
                  </span>
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        className={styles.navLabel}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
          {/* Logout */}
          <li>
            <button
              className={styles.navItem}
              onClick={handleLogout}
              title={sidebarCollapsed ? 'Logout' : undefined}
            >
              <span className={styles.navIcon}>
                <LogOut size={20} />
              </span>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    className={styles.navLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </li>
        </ul>

        {/* User Info */}
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                className={styles.userInfo}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <span className={styles.userName}>{user?.name || 'User'}</span>
                <span className={styles.userEmail}>{user?.email || ''}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        <button
          className={styles.collapseButton}
          onClick={toggleSidebarCollapse}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}

export default Sidebar;

