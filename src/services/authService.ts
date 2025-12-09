import { API_ENDPOINTS } from '../config/api';

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

export const registerUser = async (userData: UserRegistrationData) => {
  const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userData.name,
      email: userData.email,
      password: userData.password
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al registrar usuario');
  }

  return await response.text();
};

export const loginUser = async (userData: UserLoginData): Promise<User> => {
  const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userData.email,
      password: userData.password
    }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data = await response.json();
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ name: userData.email }));
  }

  return { 
      id: 0, 
      name: userData.email, 
      email: userData.email 
  };
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};