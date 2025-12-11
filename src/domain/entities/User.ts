export interface UserRegistrationData {
    name: string;
    email: string;
    password: string;
}

export interface UserLoginData {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
}
