import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Mail, Lock, User } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth, useRedirectAuthenticated } from '../hooks';
import styles from './Auth.module.css';

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  // Redirect if already authenticated
  useRedirectAuthenticated('/');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    
    try {
      await register(email, password, name);
      navigate('/');
    } catch {
      // Error is already set in store
    }
  };

  const displayError = localError || error;

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
          <h2 className={styles.title}>Create your account</h2>
          <p className={styles.subtitle}>Start organizing your board game collection</p>
        </div>

        {/* Error Message */}
        {displayError && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            {displayError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={18} />}
            required
            autoComplete="name"
          />
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
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock size={18} />}
            required
            autoComplete="new-password"
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Create account
          </Button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <span>Already have an account?</span>
          <Link to="/login" className={styles.link}>
            Sign in
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

export default Register;

