import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import WelcomePage from '../../pages/WelcomePage';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
const mockUseAuth = vi.fn(() => ({
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
  logout: () => mockLogout(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('WelcomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders welcome greeting with user name', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/¡Hola, Test User!/i)).toBeInTheDocument();
  });

  it('renders ver temas button', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /ver temas/i })).toBeInTheDocument();
  });

  it('renders crear partida button', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /crear partida/i })).toBeInTheDocument();
  });

  it('renders join game button', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /join game/i })).toBeInTheDocument();
  });

  it('navigates to topics when ver temas is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    const verTemasButton = screen.getByRole('button', { name: /ver temas/i });
    await user.click(verTemasButton);

    expect(mockNavigate).toHaveBeenCalledWith('/topics');
  });

  it('navigates to create game when crear partida is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    const crearPartidaButton = screen.getByRole('button', { name: /crear partida/i });
    await user.click(crearPartidaButton);

    expect(mockNavigate).toHaveBeenCalledWith('/create-game');
  });

  it('navigates to join game when join game is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    const joinGameButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinGameButton);

    expect(mockNavigate).toHaveBeenCalledWith('/joingame');
  });

  it('logs out and navigates to login when log out is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    const logOutButton = screen.getByRole('button', { name: /log out/i });
    await user.click(logOutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders past game results section', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /past game results/i })).toBeInTheDocument();
    expect(screen.getByText(/no recent games/i)).toBeInTheDocument();
  });

  it('renders all action buttons in a flex container', () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

    const verTemasButton = screen.getByRole('button', { name: /ver temas/i });
    const crearPartidaButton = screen.getByRole('button', { name: /crear partida/i });
    const joinGameButton = screen.getByRole('button', { name: /join game/i });

    expect(verTemasButton).toBeInTheDocument();
    expect(crearPartidaButton).toBeInTheDocument();
    expect(joinGameButton).toBeInTheDocument();
  });
});
