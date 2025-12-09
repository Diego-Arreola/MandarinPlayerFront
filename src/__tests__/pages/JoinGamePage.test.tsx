import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import JoinGamePage from '../../pages/JoinGamePage';

const mockNavigate = vi.fn();
const mockJoinGame = vi.fn();
const mockUseAuth = vi.fn(() => ({
  user: { id: '1', name: 'Test User', email: 'test@example.com' },
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

vi.mock('../../services/gameService', () => ({
  gameService: {
    joinGame: (code: string, playerName: string) => mockJoinGame(code, playerName),
    createGame: vi.fn(),
    getSession: vi.fn(),
  }
}));

describe('JoinGamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockJoinGame.mockResolvedValue({ success: true });
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('renders the page title', () => {
    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /join a game/i })).toBeInTheDocument();
  });

  it('renders game code input field', () => {
    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/enter game code/i)).toBeInTheDocument();
  });

  it('renders join button', () => {
    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /join game/i })).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.some(btn => btn.textContent?.includes('Back') || btn.textContent?.includes('←'))).toBe(true);
  });

  it('allows user to enter game code', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i) as HTMLInputElement;
    await user.type(input, 'abc12');

    expect(input.value).toBe('ABC12');
  });

  it('converts game code to uppercase', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i) as HTMLInputElement;
    await user.type(input, 'xyz');

    expect(input.value).toBe('XYZ');
  });

  it('limits game code to 5 characters', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i) as HTMLInputElement;
    await user.type(input, 'abcdefgh');

    expect(input.value.length).toBeLessThanOrEqual(5);
  });

  it('calls joinGame service when form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i);
    await user.type(input, 'ABC12');

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(mockJoinGame).toHaveBeenCalledWith('ABC12', 'Test User');
    });
  });

  it('navigates to lobby on successful join', async () => {
    const user = userEvent.setup();
    mockJoinGame.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i);
    await user.type(input, 'ABC12');

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/lobby/ABC12');
    });
  });

  it('disables join button while joining', async () => {
    const user = userEvent.setup();
    mockJoinGame.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i);
    await user.type(input, 'ABC12');

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    expect(joinButton).toBeDisabled();
  });

  it('navigates back to welcome page when back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole('button');
    const backButton = buttons.find(btn => btn.textContent?.includes('Back') || btn.textContent?.includes('←'));
    
    if (backButton) {
      await user.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    }
  });

  it('shows loading text while joining', async () => {
    const user = userEvent.setup();
    mockJoinGame.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 50))
    );

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i);
    await user.type(input, 'ABC12');

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText(/joining/i)).toBeInTheDocument();
    });
  });

  it('handles join failure with mock session fallback', async () => {
    const user = userEvent.setup();
    mockJoinGame.mockRejectedValue(new Error('Join failed'));
    
    const mockSession = {
      code: 'ABC12',
      players: [{ id: '1', name: 'Host', isHost: true }],
      config: { type: 'memorama', topicId: '1', rounds: 5 }
    };
    
    (window.localStorage.getItem as any).mockReturnValue(JSON.stringify(mockSession));

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i);
    await user.type(input, 'ABC12');

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/lobby/ABC12');
    });
  });

  it('shows alert when join fails without mock session', async () => {
    const user = userEvent.setup();
    mockJoinGame.mockRejectedValue(new Error('Join failed'));
    (window.localStorage.getItem as any).mockReturnValue(null);
    
    // Mock alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/enter game code/i);
    await user.type(input, 'ABC12');

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to join'));
    });

    alertSpy.mockRestore();
  });

  it('prevents submission when code is empty', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <JoinGamePage />
      </BrowserRouter>
    );

    const joinButton = screen.getByRole('button', { name: /join game/i });
    await user.click(joinButton);

    await waitFor(() => {
      expect(mockJoinGame).not.toHaveBeenCalled();
    }, { timeout: 500 });
  });
});
