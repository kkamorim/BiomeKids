import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { secureStorage } from './secureStorage';

// URL base da API
// Detecta automaticamente o IP do computador quando executado pelo Expo Go no celular físico!
const getBaseUrl = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:3001/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  }
  return 'http://192.168.1.20:3001/api';
};

export const API_BASE_URL = getBaseUrl();


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================================================
// 1. INTERCEPTOR DE REQUISIÇÃO: Anexa o Access Token automaticamente
// ==============================================================================
api.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================================================================
// 2. INTERCEPTOR DE RESPOSTA: Renovação silenciosa de token expirado (Refresh)
// ==============================================================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for a própria rota de refresh ou login
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Enfileira as requisições enquanto o novo token está sendo obtido
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('Sem refresh token disponível.');
        }

        // Tenta obter novo Access Token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken, user } = response.data.data;

        // Salva novos tokens no SecureStore
        await secureStorage.saveTokens(accessToken, newRefreshToken);
        if (user) await secureStorage.saveUser(user);

        // Atualiza cabeçalho da requisição original e a reenvia
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Se a renovação falhar, limpa o armazenamento local
        await secureStorage.clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
