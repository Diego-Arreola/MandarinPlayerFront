import type { User, UserLoginData, UserRegistrationData } from '../entities/User';

export interface IAuthRepository {
    registerUser(userData: UserRegistrationData): Promise<string>;
    loginUser(userData: UserLoginData): Promise<User>;
    logoutUser(): void;
}
