import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerUser, loginUser, logoutUser } from '../authService';

// Mock fetch globally
vi.stubGlobal('fetch', vi.fn());

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('registerUser', () => {
    it('sends correct registration data to API', async () => {
      const mockResponse = new Response('User registered successfully', {
        status: 200,
        statusText: 'OK',
      });
      vi.mocked(fetch).mockResolvedValue(mockResponse);

      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await registerUser(userData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userData.name,
            email: userData.email,
            password: userData.password,
          }),
        })
      );
    });

    it('throws error on failed registration', async () => {
      const mockResponse = new Response('Error: Email already exists', {
        status: 400,
        statusText: 'Bad Request',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      };

      await expect(registerUser(userData)).rejects.toThrow();
    });
  });

  describe('loginUser', () => {
    it('successfully logs in user and stores token', async () => {
      const mockResponse = new Response(
        JSON.stringify({
          token: 'test-token-123',
          user: { id: 1, email: 'test@example.com', name: 'Test User' },
        }),
        { status: 200, statusText: 'OK' } as ResponseInit
      );
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await loginUser(loginData);

      expect(user).toEqual({
        id: 0,
        name: 'test@example.com',
        email: 'test@example.com',
      });

      expect(localStorage.getItem('token')).toBe('test-token-123');
      expect(localStorage.getItem('user')).toBe(
        JSON.stringify({ name: 'test@example.com' })
      );
    });

    it('throws error on invalid credentials', async () => {
      const mockResponse = new Response('Unauthorized', {
        status: 401,
        statusText: 'Unauthorized',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(loginUser(loginData)).rejects.toThrow('Credenciales inválidas');
    });

    it('sends correct login data to API', async () => {
      const mockResponse = new Response(
        JSON.stringify({ token: 'test-token' }),
        { status: 200, statusText: 'OK' } as ResponseInit
      );
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await loginUser(loginData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: loginData.email,
            password: loginData.password,
          }),
        })
      );
    });
  });

  describe('logoutUser', () => {
    it('removes token and user from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));

      logoutUser();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('works even if localStorage is empty', () => {
      expect(() => logoutUser()).not.toThrow();
    });
  });
});
