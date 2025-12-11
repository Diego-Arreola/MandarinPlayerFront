import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { gameRepository as gameService } from '../HttpGameRepository';
import type { GameSession, GameConfig } from '../../../domain/entities/Game';

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

describe('gameService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createGame', () => {
    it('creates a new game session', async () => {
      const gameConfig: GameConfig = {
        type: 'kahoot',
        topicId: '1',
        rounds: 5,
      };

      const mockSession: GameSession = {
        code: 'ABC123',
        config: gameConfig,
        players: [{ id: '1', name: 'Host', isHost: true }],
        status: 'waiting',
      };

      const mockResponse = new Response(JSON.stringify(mockSession), {
        status: 201,
        statusText: 'Created',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const session = await gameService.createGame(gameConfig, 'Host');

      expect(session).toEqual(mockSession);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/matches/create'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ config: gameConfig, hostName: 'Host' }),
        })
      );
    });

    it('throws error on failed game creation', async () => {
      const gameConfig: GameConfig = {
        type: 'kahoot',
        topicId: '1',
        rounds: 5,
      };

      const mockResponse = new Response('Error', {
        status: 400,
        statusText: 'Bad Request',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      await expect(gameService.createGame(gameConfig, 'Host')).rejects.toThrow(
        'Error al crear la partida'
      );
    });
  });

  describe('joinGame', () => {
    it('joins an existing game session', async () => {
      const mockSession: GameSession = {
        code: 'ABC123',
        config: { type: 'kahoot', topicId: '1', rounds: 5 },
        players: [
          { id: '1', name: 'Host', isHost: true },
          { id: '2', name: 'Player2', isHost: false },
        ],
        status: 'waiting',
      };

      const mockResponse = new Response(JSON.stringify(mockSession), {
        status: 200,
        statusText: 'OK',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const session = await gameService.joinGame('ABC123', 'Player2');

      expect(session).toEqual(mockSession);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/matches/join'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ code: 'ABC123', playerName: 'Player2' }),
        })
      );
    });

    it('throws error when game code is invalid', async () => {
      const mockResponse = new Response('Game not found', {
        status: 404,
        statusText: 'Not Found',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      await expect(gameService.joinGame('INVALID', 'Player')).rejects.toThrow(
        'No se pudo unir a la partida'
      );
    });
  });

  describe('getSession', () => {
    it('retrieves game session by code', async () => {
      const mockSession: GameSession = {
        code: 'ABC123',
        config: { type: 'kahoot', topicId: '1', rounds: 5 },
        players: [{ id: '1', name: 'Host', isHost: true }],
        status: 'playing',
      };

      const mockResponse = new Response(JSON.stringify(mockSession), {
        status: 200,
        statusText: 'OK',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const session = await gameService.getSession('ABC123');

      expect(session).toEqual(mockSession);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/matches/ABC123'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('returns undefined when session not found', async () => {
      const mockResponse = new Response('Not found', {
        status: 404,
        statusText: 'Not Found',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: false });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      const session = await gameService.getSession('INVALID');

      expect(session).toBeUndefined();
    });

    it('includes authorization token in request', async () => {
      const mockResponse = new Response(JSON.stringify({}), {
        status: 200,
        statusText: 'OK',
      } as ResponseInit);
      Object.defineProperty(mockResponse, 'ok', { value: true });
      vi.mocked(fetch).mockResolvedValue(mockResponse as any);

      await gameService.getSession('ABC123');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });
  });
});
