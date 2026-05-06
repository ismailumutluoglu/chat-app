import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUserId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function decodeJWT(token: string): { sub?: string } | null {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setIsLoading(false);
      return;
    }

    api.post('/auth/refresh', { refreshToken })
      .then(({ data }) => {
        window.__accessToken = data.accessToken;
        const payload = decodeJWT(data.accessToken);
        setCurrentUserId(payload?.sub ?? null);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('refreshToken');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    window.__accessToken = data.accessToken;
    localStorage.setItem('refreshToken', data.refreshToken);
    const payload = decodeJWT(data.accessToken);
    setCurrentUserId(payload?.sub ?? null);
    setIsAuthenticated(true);
  };

  const register = async (username: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    window.__accessToken = data.accessToken;
    localStorage.setItem('refreshToken', data.refreshToken);
    const payload = decodeJWT(data.accessToken);
    setCurrentUserId(payload?.sub ?? null);
    setIsAuthenticated(true);
  };

  const logout = () => {
    window.__accessToken = null;
    localStorage.removeItem('refreshToken');
    setCurrentUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, currentUserId, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};