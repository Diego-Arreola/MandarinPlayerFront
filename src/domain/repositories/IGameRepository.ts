import type { GameConfig, GameSession } from '../entities/Game';

export interface IGameRepository {
    createGame(config: GameConfig, hostName: string): Promise<GameSession>;
    joinGame(code: string, playerName: string): Promise<GameSession>;
    getSession(code: string): Promise<GameSession | undefined>;
}
