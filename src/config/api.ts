/**
 * API Configuration
 * Uses environment variables to determine the API base URL
 */

const getApiBaseUrl = (): string => {
  // En producción (Docker), usa la variable de entorno VITE_API_URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // En desarrollo local, usa localhost
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  TOPICS: `${API_BASE_URL}/api/themes`,
  GAMES: `${API_BASE_URL}/api/games`,
} as const;
