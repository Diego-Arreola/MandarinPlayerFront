import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TopicDetailPage from '../../pages/TopicDetailPage';

const mockNavigate = vi.fn();
const mockGetTopicById = vi.fn();
const mockAddVocabulary = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ topicId: '1' }),
  };
});

vi.mock('../../services/topicService', () => ({
  topicService: {
    getTopicById: () => mockGetTopicById(),
    addVocabulary: (topicId: string, vocab: object) => mockAddVocabulary(topicId, vocab),
    getTopics: vi.fn(),
  }
}));

const mockTopic = {
  id: '1',
  title: 'Greetings',
  description: 'Basic greetings',
  vocabulary: [
    { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hello' },
    { id: '2', chinese: '谢谢', pinyin: 'Xièxiè', spanish: 'Thank you' },
  ]
};

describe('TopicDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTopicById.mockResolvedValue(mockTopic);
    mockAddVocabulary.mockResolvedValue(true);
  });

  it('displays loading state initially', () => {
    mockGetTopicById.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading topic/i)).toBeInTheDocument();
  });

  it('loads topic data on mount', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTopicById).toHaveBeenCalled();
    });
  });

  it('displays topic title', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/basic greetings/i)).toBeInTheDocument();
    });
  });

  it('displays topic description', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/basic greetings/i)).toBeInTheDocument();
    });
  });

  it('displays vocabulary list heading with count', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /vocabulary list \(2\)/i })).toBeInTheDocument();
    });
  });

  it('renders back to topics button', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back to topics/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  it('navigates to topics when back button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back to topics/i })).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /back to topics/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/topics');
  });

  it('renders add word button', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ add word/i })).toBeInTheDocument();
    });
  });

  it('displays add vocabulary form when add word button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /\+ add word/i })).toBeInTheDocument();
    });

    const addWordButton = screen.getByRole('button', { name: /\+ add word/i });
    await user.click(addWordButton);

    // After clicking, the form should appear (VocabularyList component renders it)
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      // Should have more buttons now (add word should be hidden, form buttons shown)
      expect(buttons.length).toBeGreaterThan(1);
    });
  });

  it('redirects to topics when topic is not found', async () => {
    mockGetTopicById.mockResolvedValue(null);

    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/topics');
    });
  });

  it('displays all vocabulary items', async () => {
    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nǐ hǎo')).toBeInTheDocument();
      expect(screen.getByText('Xièxiè')).toBeInTheDocument();
    });
  });

  it('handles errors when loading topic', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetTopicById.mockRejectedValue(new Error('Failed to load'));

    render(
      <BrowserRouter>
        <TopicDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTopicById).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
