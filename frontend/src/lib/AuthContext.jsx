import React, { createContext, useState, useContext, useEffect } from 'react';
import { client } from '@/api/client';
import { logger } from '@/lib/logger';

const AuthContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          logger.info('Auth Check', 'Token found, verifying...');
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
            logger.success('Auth Check', `User logged in: ${userData.email}`);
          } else {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            logger.warn('Auth Check', 'Token invalid, cleared');
          }
        } else {
          logger.info('Auth Check', 'No token found');
        }
      } catch (error) {
        logger.error('Auth Check Error', error.message);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
        setIsLoadingPublicSettings(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setAuthError(null);
      logger.info('Login', `Attempting login with ${email}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('Login Failed', error.error);
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setUser({ id: data.id, email: data.email, name: data.name });
      setIsAuthenticated(true);
      logger.success('Login Success', { user: data.email, id: data.id });
      return true;
    } catch (error) {
      logger.error('Login Error', error.message);
      setAuthError({ message: error.message, type: 'login_error' });
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      setAuthError(null);
      logger.info('Register', `Attempting registration for ${email}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error('Register Failed', error.error);
        throw new Error(error.error || 'Registration failed');
      }

      const data = await response.json();
      logger.success('Register Success', { user: data.email, id: data.id });
      // Auto-login after registration
      return await login(email, password);
    } catch (error) {
      logger.error('Register Error', error.message);
      setAuthError({ message: error.message, type: 'register_error' });
      return false;
    }
  };

  const logout = (shouldRedirect = false) => {
    logger.info('Logout', user?.email);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    logger.success('Logout', 'Session cleared');
    
    if (shouldRedirect) {
      window.location.href = '/login';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      login,
      register,
      checkAppState: () => Promise.resolve()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
