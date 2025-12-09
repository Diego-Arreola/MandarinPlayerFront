import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Mandarin Player logo', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const logo = screen.getByAltText('Mandarin Player logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders all navigation buttons', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /join game/i })).toBeInTheDocument();
  });

  it('navigates to login page when Log In button is clicked', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const loginButton = screen.getByRole('button', { name: /log in/i });
    await userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to signup page when Sign Up button is clicked', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await userEvent.click(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('navigates to join game page when Join Game button is clicked', async () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const joinGameButton = screen.getByRole('button', { name: /join game/i });
    await userEvent.click(joinGameButton);

    expect(mockNavigate).toHaveBeenCalledWith('/joingame');
  });

  it('has proper styling', () => {
    const { container } = render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const mainDiv = container.querySelector('div');
    expect(mainDiv).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});
