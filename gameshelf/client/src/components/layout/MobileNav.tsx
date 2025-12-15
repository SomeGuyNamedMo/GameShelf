import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Library, ListMusic, Monitor, Plus } from 'lucide-react';
import styles from './MobileNav.module.css';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/library', icon: Library, label: 'Library' },
  { path: '/add', icon: Plus, label: 'Add', isAction: true },
  { path: '/playlists', icon: ListMusic, label: 'Playlists' },
  { path: '/wall', icon: Monitor, label: 'Wall' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {navItems.map(({ path, icon: Icon, label, isAction }) => {
          const isActive = location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path));

          return (
            <li key={path}>
              <Link
                to={path}
                className={`
                  ${styles.item}
                  ${isActive ? styles.active : ''}
                  ${isAction ? styles.action : ''}
                `.trim()}
              >
                {isAction ? (
                  <span className={styles.actionIcon}>
                    <Icon size={24} />
                  </span>
                ) : (
                  <>
                    <span className={styles.icon}>
                      <Icon size={22} />
                    </span>
                    <span className={styles.label}>{label}</span>
                    {isActive && (
                      <motion.div
                        className={styles.indicator}
                        layoutId="mobile-nav-indicator"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileNav;

