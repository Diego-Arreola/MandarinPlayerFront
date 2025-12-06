import type { Topic } from './topicService';

const API_URL = 'http://localhost:8080/api/games';

export type GameType = 'kahoot' | 'jeopardy' | 'memorama';

export interface GameConfig {
    type: GameType;
    topicId: string;
    rounds: number;
}

export interface Player {
    id: string;
    name: string;
    isHost: boolean;
}

export interface GameSession {
    code: string;
    config: GameConfig;
    players: Player[];
    status: 'waiting' | 'playing' | 'finished';
    topic?: Topic; 
}

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
    };
};

export const gameService = {
    createGame: async (config: GameConfig, hostName: string): Promise<GameSession> => {
        const response = await fetch(`${API_URL}/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ config, hostName }),
        });

        if (!response.ok) throw new Error('Error al crear la partida');
        return await response.json();
    },

    joinGame: async (code: string, playerName: string): Promise<GameSession> => {
        const response = await fetch(`${API_URL}/join`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ code, playerName }),
        });

        if (!response.ok) throw new Error('No se pudo unir a la partida');
        return await response.json();
    },

    getSession: async (code: string): Promise<GameSession | undefined> => {
        const response = await fetch(`${API_URL}/${code}`, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) return undefined;
        return await response.json();
    }
};