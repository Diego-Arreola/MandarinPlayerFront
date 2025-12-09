import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TopicsPage from '../../pages/TopicsPage';
import type { Topic } from '../../services/topicService';

// Mock dependencies
const mockNavigate = vi.fn();
const mockGetTopics = vi.fn();
const mockCreateTopic = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/topicService', () => ({
  topicService: {
    getTopics: () => mockGetTopics(),
    createTopic: (title: string, description: string) =>
      mockCreateTopic(title, description),
  },
}));

describe('TopicsPage', () => {
  const mockTopics: Topic[] = [
    {
      id: '1',
      title: 'Greetings',
      description: 'Basic greetings',
      vocabulary: [],
    },
    {
      id: '2',
      title: 'Numbers',
      description: 'Learn numbers',
      vocabulary: [],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTopics.mockResolvedValue(mockTopics);
  });

  it('renders Topics Menu title', async () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Topics Menu')).toBeInTheDocument();
    });
  });

  it('renders Back to Home button', () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('renders Create New Topic button', () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /create new topic/i })).toBeInTheDocument();
  });

  it('navigates to home when Back to Home button is clicked', async () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', { name: /back to home/i });
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/welcome');
  });

  it('displays loading state initially', () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading topics...')).toBeInTheDocument();
  });

  it('loads and displays topics', async () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTopics).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('Greetings')).toBeInTheDocument();
      expect(screen.getByText('Numbers')).toBeInTheDocument();
    });
  });

  it('shows create form when Create New Topic button is clicked', async () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    const createButton = screen.getByRole('button', { name: /create new topic/i });
    await userEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Topic')).toBeInTheDocument();
    });
  });

  it('calls getTopics on mount', async () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockGetTopics).toHaveBeenCalled();
    });
  });

  it('displays topics in a list', async () => {
    render(
      <BrowserRouter>
        <TopicsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Basic greetings')).toBeInTheDocument();
      expect(screen.getByText('Learn numbers')).toBeInTheDocument();
    });
  });
});
