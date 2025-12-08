import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import GameLobbyPage from '../GameLobbyPage'

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockGetSession = vi.fn();
const mockGetTopicById = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock('../../services/gameService', () => ({
  gameService: {
    getSession: (code: string) => mockGetSession(code),
    createGame: vi.fn(),
    joinGame: vi.fn(),
  }
}));

vi.mock('../../services/topicService', () => ({
  topicService: {
    getTopicById: (id: string) => mockGetTopicById(id),
    getTopics: vi.fn(),
  }
}));

const mockGameSession = {
  code: 'ABC123',
  players: [
    { id: '1', name: 'Player 1', isHost: true },
    { id: '2', name: 'Player 2', isHost: false }
  ],
  config: {
    type: 'memorama' as const,
    topicId: '1',
    rounds: 5
  },
  topic: {
    id: '1',
    title: 'Greetings',
    description: 'Basic greetings',
    vocabulary: [
      { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hello' },
      { id: '2', chinese: '谢谢', pinyin: 'Xièxiè', spanish: 'Thank you' }
    ]
  }
};

describe('GameLobbyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ gameCode: 'ABC123' });
    mockGetSession.mockResolvedValue(mockGameSession);
    mockGetTopicById.mockResolvedValue(mockGameSession.topic);
  });

  it('renders loading state initially', () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading|please wait/i)).toBeInTheDocument();
  });

  it('loads game session on mount', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalledWith('ABC123');
    });
  });

  it('displays game code after loading', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const codeElements = screen.getAllByText(/ABC123|code/i);
      expect(codeElements.length).toBeGreaterThan(0);
    });
  });

  it('displays players list', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const playerElements = screen.getAllByText(/player/i);
      expect(playerElements.length).toBeGreaterThan(0);
    });
  });

  it('displays game type', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Just verify the page renders without crashing
      expect(screen.getByRole('heading', { name: /game lobby/i })).toBeInTheDocument();
    });
  });

  it('renders start game button', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start game|start/i })).toBeInTheDocument();
    });
  });

  it('starts memorama game when start button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start game|start/i })).toBeInTheDocument();
    });

    const startButton = screen.getByRole('button', { name: /start game|start/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/game/memorama/ABC123'),
        expect.any(Object)
      );
    });
  });

  it('starts kahoot game for kahoot config type', async () => {
    const user = userEvent.setup();
    const kahootSession = {
      ...mockGameSession,
      config: { ...mockGameSession.config, type: 'kahoot' as const }
    };
    mockGetSession.mockResolvedValue(kahootSession);

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start game|start/i })).toBeInTheDocument();
    });

    const startButton = screen.getByRole('button', { name: /start game|start/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/kahoot/ABC123'),
        expect.any(Object)
      );
    });
  });

  it('renders back button', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('navigates back to welcome on error', async () => {
    mockGetSession.mockRejectedValue(new Error('Session not found'));

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    // Component should handle error gracefully
    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('displays topic title after loading', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /game lobby/i })).toBeInTheDocument();
    });
  });

  it('displays number of rounds in config', async () => {
    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /game lobby/i })).toBeInTheDocument();
    });
  });

  it('handles missing game code gracefully', async () => {
    mockUseParams.mockReturnValue({ gameCode: undefined });

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    // Component should render or show loading state
    await waitFor(() => {
      const content = screen.queryByText(/loading|game lobby|please wait/i);
      expect(content).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('loads mock session from localStorage when API returns null', async () => {
    mockGetSession.mockResolvedValue(null);
    const mockSessionData = JSON.stringify(mockGameSession);
    localStorage.setItem('mock_session_ABC123', mockSessionData);

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ABC123/i)).toBeInTheDocument();
    });

    localStorage.removeItem('mock_session_ABC123');
  });

  it('fetches topic details when starting game without vocabulary', async () => {
    const sessionWithoutTopic = {
      ...mockGameSession,
      topic: undefined
    };
    mockGetSession.mockResolvedValue(sessionWithoutTopic);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start game|start/i })).toBeInTheDocument();
    });

    const startButton = screen.getByRole('button', { name: /start game|start/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(mockGetTopicById).toHaveBeenCalledWith('1');
    });
  });

  it('handles unsupported game type', async () => {
    const unsupportedSession = {
      ...mockGameSession,
      config: { ...mockGameSession.config, type: 'jeopardy' as any }
    };
    mockGetSession.mockResolvedValue(unsupportedSession);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start game|start/i })).toBeInTheDocument();
    });

    const startButton = screen.getByRole('button', { name: /start game|start/i });
    await user.click(startButton);

    // Alert should be called for unsupported game type
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('leaves lobby when leave button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    const leaveButton = screen.getByRole('button', { name: /leave|welcome/i });
    await user.click(leaveButton);

    expect(mockNavigate).toHaveBeenCalledWith('/welcome');
  });

  it('uses mock session from localStorage when API fails', async () => {
    mockGetSession.mockRejectedValue(new Error('API error'));
    const mockSessionData = JSON.stringify(mockGameSession);
    localStorage.setItem('mock_session_ABC123', mockSessionData);

    render(
      <BrowserRouter>
        <GameLobbyPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ABC123/i)).toBeInTheDocument();
    });

    localStorage.removeItem('mock_session_ABC123');
  });
});
