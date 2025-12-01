const API_BASE_URL = 'http://localhost:8080/api/users';

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
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    // The server responded with an error status (4xx or 5xx)
    // Try to parse error message, but provide a fallback
    let errorMessage = 'Failed to register user.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // The response was not valid JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const loginUser = async (userData: UserLoginData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Invalid email or password.');
  }
  return response.json();
};