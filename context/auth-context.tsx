'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, SignupCredentials } from '@/types';
import { ApiClient } from '@/lib/api-client';
import { CURRENT_USER } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUserLocal: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      const storedToken = ApiClient.getToken();
      if (storedToken) {
        setToken(storedToken);
        try {
          const profile = await ApiClient.getMe();
          if (profile) {
            setUser(profile);
          } else {
            ApiClient.logout();
            setUser(null);
            setToken(null);
          }
        } catch {
          setUser(null);
        }
      } else {
        // Start as guest/unauthenticated when no stored session
        setUser(null);
        setToken(null);
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.login(credentials);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setIsLoading(true);
    try {
      const res = await ApiClient.signup(credentials);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    ApiClient.logout();
    setToken(null);
    setUser(null);
  }, []);

  const updateUserLocal = useCallback((updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
