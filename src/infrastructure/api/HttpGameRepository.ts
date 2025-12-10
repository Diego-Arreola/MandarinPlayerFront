import type { IGameRepository } from '../../domain/repositories/IGameRepository';
import type { GameConfig, GameSession } from '../../domain/entities/Game';
import { API_ENDPOINTS } from './config';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const gameRepository: IGameRepository = {
    createGame: async (config: GameConfig, hostName: string): Promise<GameSession> => {
        const response = await fetch(`${API_ENDPOINTS.GAMES}/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ config, hostName }),
        });

        if (!response.ok) throw new Error('Error al crear la partida');
        return await response.json();
    },

    joinGame: async (code: string, playerName: string): Promise<GameSession> => {
        const response = await fetch(`${API_ENDPOINTS.GAMES}/join`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ code, playerName }),
        });

        if (!response.ok) throw new Error('No se pudo unir a la partida');
        return await response.json();
    },

    getSession: async (code: string): Promise<GameSession | undefined> => {
        const response = await fetch(`${API_ENDPOINTS.GAMES}/${code}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) return undefined;
        return await response.json();
    }
};
