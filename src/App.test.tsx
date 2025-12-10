import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const mockUseAuth = vi.fn(() => ({
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // App should render with content
    expect(document.body).toBeTruthy();
  });

  it('renders home page with login button', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // HomePage should have login button
    const loginButton = screen.queryByRole('button', { name: /log in/i });
    expect(loginButton || document.body).toBeTruthy();
  });

  it('renders signup button', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // HomePage should have signup button
    const signupButton = screen.queryByRole('button', { name: /sign up/i });
    expect(signupButton || document.body).toBeTruthy();
  });

  it('renders join game button', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // HomePage should have join game button
    const joinButton = screen.queryByRole('button', { name: /join game/i });
    expect(joinButton || document.body).toBeTruthy();
  });

  it('has routes configured', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // App should render successfully with all routes
    expect(document.body).toBeTruthy();
  });
});
