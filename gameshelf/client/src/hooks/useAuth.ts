import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Hook for accessing auth state and actions
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
}

/**
 * Hook that checks authentication status on mount
 */
export function useAuthCheck() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook that redirects unauthenticated users to login
 */
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook that redirects authenticated users away from auth pages
 */
export function useRedirectAuthenticated(redirectTo = '/') {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to the page they came from, or home
      const from = (location.state as { from?: string })?.from || redirectTo;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);

  return { isAuthenticated, isLoading };
}

export default useAuth;

