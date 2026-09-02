import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'zookids_access_token';
const REFRESH_TOKEN_KEY = 'zookids_refresh_token';
const USER_DATA_KEY = 'zookids_user_data';

/**
 * Utilitário de armazenamento seguro para chaves criptografadas (iOS Keychain / Android Keystore)
 * Com fallback gracioso para Web.
 */
export const secureStorage = {
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn(`Erro ao salvar ${key} no SecureStore:`, error);
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`Erro ao recuperar ${key} do SecureStore:`, error);
      return null;
    }
  },

  async deleteItem(key) {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.warn(`Erro ao remover ${key} do SecureStore:`, error);
    }
  },

  // Helpers específicos de autenticação
  async saveTokens(accessToken, refreshToken) {
    if (accessToken) await this.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) await this.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  async getAccessToken() {
    return this.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return this.getItem(REFRESH_TOKEN_KEY);
  },

  async saveUser(user) {
    if (user) await this.setItem(USER_DATA_KEY, JSON.stringify(user));
  },

  async getUser() {
    const data = await this.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  async clearAuth() {
    await this.deleteItem(ACCESS_TOKEN_KEY);
    await this.deleteItem(REFRESH_TOKEN_KEY);
    await this.deleteItem(USER_DATA_KEY);
  },
};
