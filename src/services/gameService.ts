import type { Topic } from './topicService';

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
    topic?: Topic; // Populated topic data
}

const SESSIONS_KEY = 'mandarin_player_sessions';

const getSessions = (): GameSession[] => {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveSessions = (sessions: GameSession[]) => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const gameService = {
    createGame: async (config: GameConfig, hostName: string): Promise<GameSession> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const code = Math.floor(10000 + Math.random() * 90000).toString();
                const session: GameSession = {
                    code,
                    config,
                    players: [{ id: 'host', name: hostName, isHost: true }],
                    status: 'waiting',
                };

                const sessions = getSessions();
                sessions.push(session);
                saveSessions(sessions);

                resolve(session);
            }, 500);
        });
    },

    joinGame: async (code: string, playerName: string): Promise<GameSession> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const sessions = getSessions();
                const sessionIndex = sessions.findIndex(s => s.code === code);

                if (sessionIndex === -1) {
                    reject(new Error('Game not found'));
                    return;
                }

                const session = sessions[sessionIndex];
                const newPlayer: Player = {
                    id: Date.now().toString(),
                    name: playerName,
                    isHost: false
                };

                session.players.push(newPlayer);
                sessions[sessionIndex] = session;
                saveSessions(sessions);

                resolve(session);
            }, 500);
        });
    },

    getSession: async (code: string): Promise<GameSession | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sessions = getSessions();
                resolve(sessions.find(s => s.code === code));
            }, 300);
        });
    }
};
