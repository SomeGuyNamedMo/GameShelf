import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { useUIStore } from '../../store/uiStore';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <motion.main
        className={styles.main}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 280,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.content}>
          {children}
        </div>
      </motion.main>
      
      <MobileNav />
    </div>
  );
}

export default Layout;

