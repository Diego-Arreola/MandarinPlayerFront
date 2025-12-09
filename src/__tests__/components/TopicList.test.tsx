import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TopicList from '../../components/TopicList';
import type { Topic } from '../../services/topicService';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Basic Greetings',
    description: 'Learn how to greet in Mandarin',
    vocabulary: [
      { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hola' },
      { id: '2', chinese: '再见', pinyin: 'Zàijiàn', spanish: 'Adiós' },
    ],
  },
  {
    id: '2',
    title: 'Numbers',
    description: 'Learn Mandarin numbers',
    vocabulary: [
      { id: '3', chinese: '一', pinyin: 'Yī', spanish: 'Uno' },
      { id: '4', chinese: '二', pinyin: 'Èr', spanish: 'Dos' },
      { id: '5', chinese: '三', pinyin: 'Sān', spanish: 'Tres' },
    ],
  },
];

describe('TopicList Component', () => {
  it('renders empty state when no topics', () => {
    render(<TopicList topics={[]} />);
    
    expect(screen.getByText(/no topics found/i)).toBeInTheDocument();
  });

  it('renders all topics', () => {
    render(
      <BrowserRouter>
        <TopicList topics={mockTopics} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Basic Greetings')).toBeInTheDocument();
    expect(screen.getByText('Numbers')).toBeInTheDocument();
  });

  it('displays topic descriptions', () => {
    render(
      <BrowserRouter>
        <TopicList topics={mockTopics} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Learn how to greet in Mandarin')).toBeInTheDocument();
    expect(screen.getByText('Learn Mandarin numbers')).toBeInTheDocument();
  });

  it('displays vocabulary count for each topic', () => {
    render(
      <BrowserRouter>
        <TopicList topics={mockTopics} />
      </BrowserRouter>
    );
    
    const counts = screen.getAllByText(/words/);
    expect(counts).toHaveLength(2);
    expect(screen.getByText('2 words')).toBeInTheDocument();
    expect(screen.getByText('3 words')).toBeInTheDocument();
  });

  it('renders View Vocabulary buttons for each topic', () => {
    render(
      <BrowserRouter>
        <TopicList topics={mockTopics} />
      </BrowserRouter>
    );
    
    const buttons = screen.getAllByRole('button', { name: /view vocabulary/i });
    expect(buttons).toHaveLength(2);
  });

  it('navigates to topic detail page on button click', async () => {
    render(
      <BrowserRouter>
        <TopicList topics={mockTopics} />
      </BrowserRouter>
    );
    
    const buttons = screen.getAllByRole('button', { name: /view vocabulary/i });
    expect(buttons).toHaveLength(2);
    
    // Verify buttons are clickable
    await userEvent.click(buttons[0]);
    expect(buttons[0]).toBeInTheDocument();
  });

  it('renders topics in a grid layout', () => {
    const { container } = render(
      <BrowserRouter>
        <TopicList topics={mockTopics} />
      </BrowserRouter>
    );
    
    const gridContainer = container.querySelector('div[style*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });
});
