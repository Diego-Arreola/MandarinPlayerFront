import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '../SignUpPage';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/authService', () => ({
  registerUser: vi.fn(),
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form with username, email, and password inputs', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders Create Account and Return buttons', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return/i })).toBeInTheDocument();
  });

  it('displays login link', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const loginLink = screen.getByRole('link', { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('updates username input when user types', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    await userEvent.type(usernameInput, 'testuser');

    expect(usernameInput.value).toBe('testuser');
  });

  it('updates email input when user types', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    await userEvent.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input when user types', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    await userEvent.type(passwordInput, 'password123');

    expect(passwordInput.value).toBe('password123');
  });

  it('navigates to home page when Return button is clicked', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const returnButton = screen.getByRole('button', { name: /return/i });
    await userEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders title', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders required attributes on inputs', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    expect(usernameInput.required).toBe(true);
    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });
});
