import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Mail, Lock } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth, useRedirectAuthenticated } from '../hooks';
import styles from './Auth.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Redirect if already authenticated
  useRedirectAuthenticated('/');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // Error is already set in store
    }
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Gamepad2 size={32} />
          </div>
          <h1 className={styles.logoText}>GameShelf</h1>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to manage your board game collection</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail size={18} />}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            required
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>

        {/* Demo hint */}
        <div className={styles.hint}>
          <p>Demo account: <code>demo@gameshelf.app</code></p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>Don't have an account?</span>
          <Link to="/register" className={styles.link}>
            Create account
          </Link>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className={styles.bgDecoration} aria-hidden="true">
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
      </div>
    </div>
  );
}

export default Login;

