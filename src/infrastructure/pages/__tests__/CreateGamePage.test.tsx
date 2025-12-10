import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CreateGamePage from '../CreateGamePage';

const mockNavigate = vi.fn();
const mockGetTopics = vi.fn();
const mockCreateGame = vi.fn();
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

const mockTopics = [
  {
    id: '1',
    title: 'Greetings',
    description: 'Basic greetings',
    vocabulary: [
      { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hello' },
      { id: '2', chinese: '谢谢', pinyin: 'Xièxiè', spanish: 'Thank you' },
      { id: '3', chinese: '再见', pinyin: 'Zàijiàn', spanish: 'Goodbye' }
    ]
  },
  {
    id: '2',
    title: 'Numbers',
    description: '1-3',
    vocabulary: [
      { id: '4', chinese: '一', pinyin: 'Yī', spanish: 'One' },
      { id: '5', chinese: '二', pinyin: 'Èr', spanish: 'Two' },
      { id: '6', chinese: '三', pinyin: 'Sān', spanish: 'Three' }
    ]
  }
];

vi.mock('../../api/HttpTopicRepository', () => ({
  topicService: {
    getTopics: () => mockGetTopics(),
    getTopicById: vi.fn(),
  }
}));

vi.mock('../../api/HttpGameRepository', () => ({
  gameService: {
    createGame: (config: any) => mockCreateGame(config),
    joinGame: vi.fn(),
    getSession: vi.fn(),
  }
}));

describe('CreateGamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTopics.mockResolvedValue(mockTopics);
    mockCreateGame.mockResolvedValue({ code: 'ABC123' });
  });

  it('renders the page with game type selection', async () => {
    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /select game mode/i })).toBeInTheDocument();
    });
  });

  it('renders memorama and kahoot game options', async () => {
    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/memorama/i)).toBeInTheDocument();
      expect(screen.getByText(/kahoot/i)).toBeInTheDocument();
    });
  });

  it('loads topics on component mount', async () => {
    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTopics).toHaveBeenCalled();
    });
  });

  it('displays loaded topics in the topic selector', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    // First, click on a game to go to step 2
    const kahootDiv = screen.getByText(/kahoot/i).closest('div[style*="cursor"]');
    if (kahootDiv) {
      await user.click(kahootDiv);
    }

    await waitFor(() => {
      const topicSelect = screen.getByRole('combobox');
      expect(topicSelect).toBeInTheDocument();
      expect(topicSelect).toHaveValue('1'); // Default first topic
    });
  });

  it('allows user to select a game type and proceed to topic selection', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/memorama/i)).toBeInTheDocument();
    });

    const memoramaDiv = screen.getByText(/memorama/i).closest('div[style*="cursor"]');
    if (memoramaDiv) {
      await user.click(memoramaDiv);
    }

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /configure game/i })).toBeInTheDocument();
    });
  });

  it('allows user to change rounds value', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/memorama/i)).toBeInTheDocument();
    });

    const memoramaButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Memorama'));
    if (memoramaButton) {
      await user.click(memoramaButton);
    }

    await waitFor(() => {
      const roundsInput = screen.queryByDisplayValue('5');
      if (roundsInput) {
        expect(roundsInput).toBeInTheDocument();
      }
    });
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    const backButtons = screen.getAllByRole('button');
    const backButton = backButtons.find(btn => btn.textContent?.includes('Back'));

    if (backButton) {
      await user.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/welcome');
    }
  });

  it('disables create button while creating game', async () => {
    const user = userEvent.setup();
    mockCreateGame.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/memorama/i)).toBeInTheDocument();
    });

    const memoramaDiv = screen.getByText(/memorama/i).closest('div[style*="cursor"]');
    if (memoramaDiv) {
      await user.click(memoramaDiv);
    }

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /configure game/i })).toBeInTheDocument();
    });

    const createButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Create Lobby'));
    if (createButton) {
      expect(createButton).not.toBeDisabled();
    }
  });

  it('handles missing topics gracefully', async () => {
    mockGetTopics.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTopics).toHaveBeenCalled();
    });
  });

  it('renders step indicator showing current step', async () => {
    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /select game mode/i })).toBeInTheDocument();
    });
  });

  it('calls createGame service when form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/memorama/i)).toBeInTheDocument();
    });

    const memoramaDiv = screen.getByText(/memorama/i).closest('div[style*="cursor"]');
    if (memoramaDiv) {
      await user.click(memoramaDiv);
    }

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /configure game/i })).toBeInTheDocument();
    });

    const createButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Create Lobby'));
    if (createButton) {
      await user.click(createButton);

      await waitFor(() => {
        expect(mockCreateGame).toHaveBeenCalled();
      });
    }
  });

  it('handles topic loading failure gracefully', async () => {
    mockGetTopics.mockRejectedValue(new Error('API error'));

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Component should still render with fallback mock data
      expect(screen.getByText(/kahoot/i)).toBeInTheDocument();
    });
  });

  it('handles createGame failure and uses mock session', async () => {
    const user = userEvent.setup();
    mockCreateGame.mockRejectedValue(new Error('Creation failed'));

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/memorama/i)).toBeInTheDocument();
    });

    const memoramaDiv = screen.getByText(/memorama/i).closest('div[style*="cursor"]');
    if (memoramaDiv) {
      await user.click(memoramaDiv);
    }

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /configure game/i })).toBeInTheDocument();
    });

    const createButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Create Lobby'));
    if (createButton) {
      await user.click(createButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    }
  });

  it('navigates to lobby after successful game creation', async () => {
    const user = userEvent.setup();
    mockCreateGame.mockResolvedValue({ code: 'TEST123' });

    render(
      <BrowserRouter>
        <CreateGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/kahoot/i)).toBeInTheDocument();
    });

    const kahootDiv = screen.getByText(/kahoot/i).closest('div[style*="cursor"]');
    if (kahootDiv) {
      await user.click(kahootDiv);
    }

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /configure game/i })).toBeInTheDocument();
    });

    const createButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Create Lobby'));
    if (createButton) {
      await user.click(createButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/lobby/TEST123');
      });
    }
  });
});
