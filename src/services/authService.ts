const USERS_KEY = 'mandarin_player_users';

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

const getUsers = (): any[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (userData: UserRegistrationData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();

      // Check if email already exists
      if (users.some((u: any) => u.email === userData.email)) {
        reject(new Error('Email already registered.'));
        return;
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In a real app, never store plain text passwords!
      };

      users.push(newUser);
      saveUsers(users);

      resolve({ message: 'User registered successfully' });
    }, 500);
  });
};

export const loginUser = async (userData: UserLoginData): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find((u: any) => u.email === userData.email && u.password === userData.password);

      if (!user) {
        reject(new Error('Invalid email or password.'));
        return;
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;
      resolve(userWithoutPassword);
    }, 500);
  });
};