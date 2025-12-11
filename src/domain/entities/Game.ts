import type { Topic } from './Topic';

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
