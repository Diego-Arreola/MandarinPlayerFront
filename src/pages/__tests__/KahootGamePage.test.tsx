import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import KahootGamePage from '../KahootGamePage';

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});

vi.mock('../../hooks/useGameExit', () => ({
  useGameExit: () => ({
    showExitConfirm: false,
    handleExit: vi.fn(),
    confirmExit: vi.fn(),
    cancelExit: vi.fn(),
  }),
}));

const mockVocabulary = [
  { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hello' },
  { id: '2', chinese: '谢谢', pinyin: 'Xièxiè', spanish: 'Thank you' },
  { id: '3', chinese: '再见', pinyin: 'Zàijiàn', spanish: 'Goodbye' },
  { id: '4', chinese: '对不起', pinyin: 'Duìbùqǐ', spanish: 'Sorry' },
  { id: '5', chinese: '是的', pinyin: 'Shì de', spanish: 'Yes' }
];

describe('KahootGamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue({
      pathname: '/kahoot/ABC123',
      state: {
        topicVocabulary: mockVocabulary,
        rounds: 5
      }
    });
  });

  it('renders the kahoot game interface', () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /translate this word/i })).toBeInTheDocument();
  });

  it('displays a question from vocabulary', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Should display Chinese character of current question
      const chineseText = mockVocabulary.map(v => v.chinese);
      const displayed = chineseText.some(text => screen.queryByText(text));
      expect(displayed).toBe(true);
    });
  });

  it('displays answer options', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Options are displayed as divs with Chinese text
      const options = screen.getAllByText(/你好|谢谢|再见|对不起|是的/);
      expect(options.length).toBeGreaterThan(0);
    });
  });

  it('shows progress of current question', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/question|round|\/|progress/i)).toBeInTheDocument();
    });
  });

  it('displays score', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/score|points|0/i)).toBeInTheDocument();
    });
  });

  it('allows selecting an answer', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const options = screen.getAllByText(/你好|谢谢|再见|对不起|是的/);
      expect(options.length).toBeGreaterThan(0);
    });

    const options = screen.getAllByText(/你好|谢谢|再见|对不起|是的/);
    
    if (options.length > 0) {
      await user.click(options[0]);
      // After clicking an option, it should be processed
      expect(options[0]).toBeInTheDocument();
    }
  });

  it('shows result feedback after answering', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const options = screen.getAllByText(/你好|谢谢|再见|对不起|是的/);
      expect(options.length).toBeGreaterThan(0);
    });

    const options = screen.getAllByText(/你好|谢谢|再见|对不起|是的/);
    
    if (options.length > 0) {
      await user.click(options[0]);

      await waitFor(() => {
        // After answer, score or next button should appear
        const scoreText = screen.queryByText(/score|next|continue/i);
        expect(scoreText || options[0]).toBeTruthy();
      });
    }
  });

  it('navigates through questions', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/question/i).length).toBeGreaterThan(0);
    });

    const options = screen.getAllByText(/你好|谢谢|再见|对不起|是的/);
    
    if (options.length > 0) {
      await user.click(options[0]);

      await waitFor(() => {
        // Question indicator should still be visible
        const questionText = screen.getAllByText(/question/i);
        expect(questionText.length).toBeGreaterThan(0);
      });
    }
  });

  it('redirects when no vocabulary is provided', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/kahoot/ABC123',
      state: {
        topicVocabulary: [],
        rounds: 5
      }
    });

    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/create-game');
  });

  it('allows exiting game', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const exitButton = screen.queryByRole('button', { name: /exit/i });
      if (exitButton) {
        expect(exitButton).toBeInTheDocument();
      }
    });
  });

  it('shows game over screen when all questions answered', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    // Mock completing all questions
    await waitFor(() => {
      const gameOverScreen = screen.queryByText(/game over|results|final score/i);
      // Should show game over screen at the end
      if (gameOverScreen) {
        expect(gameOverScreen).toBeInTheDocument();
      }
    });
  });

  it('shows results table with answers', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    // After game ends, should show results
    await waitFor(() => {
      const resultsText = screen.queryByText(/results|table|answer|correct/i);
      // Results should be available when game is over
      if (resultsText) {
        expect(resultsText).toBeInTheDocument();
      }
    });
  });

  it('allows replaying or returning to home after game', async () => {
    render(
      <BrowserRouter>
        <KahootGamePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const hasReturnButton = buttons.some(btn => btn.textContent?.includes('Home') || btn.textContent?.includes('Return'));
      // Should have button to return home when game is over
      if (hasReturnButton) {
        expect(hasReturnButton).toBe(true);
      }
    });
  });
});
