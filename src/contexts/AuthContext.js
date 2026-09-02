import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import api, { API_BASE_URL } from '../services/api';
import { secureStorage } from '../services/secureStorage';
import axios from 'axios';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Checagem silenciosa de autenticação
   * Lê o refresh_token do SecureStore e tenta revalidar a sessão com o servidor
   */
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const refreshToken = await secureStorage.getRefreshToken();
      const storedUser = await secureStorage.getUser();

      if (!refreshToken) {
        setUser(null);
        return false;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;
        await secureStorage.saveTokens(accessToken, newRefreshToken);
        await secureStorage.saveUser(userData);
        setUser(userData);
        return true;
      } catch (refreshErr) {
        if (refreshErr.response && refreshErr.response.status === 401) {
          await secureStorage.clearAuth();
          setUser(null);
          return false;
        } else if (storedUser) {
          setUser(storedUser);
          return true;
        }
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Erro na checagem de autenticação:', error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verifica sessão ao inicializar o app
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Realiza login no sistema
   */
  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = response.data.data;

      await secureStorage.saveTokens(accessToken, refreshToken);
      await secureStorage.saveUser(userData);

      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Não foi possível realizar o login. Verifique sua conexão.';
      return { success: false, error: message };
    }
  }, []);

  /**
   * Registra um novo usuário com conformidade LGPD
   */
  const register = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { accessToken, refreshToken, user: newUser } = response.data.data;

      await secureStorage.saveTokens(accessToken, refreshToken);
      await secureStorage.saveUser(newUser);

      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      const details = error.response?.data?.details;
      const message =
        details && details.length > 0
          ? details.map((d) => d.message).join('\n')
          : error.response?.data?.error ||
            error.message ||
            'Não foi possível criar sua conta.';
      return { success: false, error: message };
    }
  }, []);

  /**
   * Realiza logout do sistema e limpa as credenciais salvas
   */
  const logout = useCallback(async () => {
    try {
      const refreshToken = await secureStorage.getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken }).catch(() => {});
      }
    } finally {
      await secureStorage.clearAuth();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      checkAuth,
    }),
    [user, isLoading, login, register, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
