import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VocabularyList from '../../components/VocabularyList';
import type { Vocabulary } from '../../services/topicService';

const mockVocabulary: Vocabulary[] = [
  { id: '1', character: '你好', pinyin: 'Nǐ hǎo', translation: 'Hola' },
  { id: '2', character: '谢谢', pinyin: 'Xièxiè', translation: 'Gracias' },
  { id: '3', character: '再见', pinyin: 'Zàijiàn', translation: 'Adiós' },
];

describe('VocabularyList Component', () => {
  it('renders empty state when no vocabulary', () => {
    render(<VocabularyList vocabulary={[]} />);

    expect(screen.getByText(/no vocabulary added yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add words to start building this topic/i)).toBeInTheDocument();
  });

  it('renders a table with vocabulary items', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('displays table headers', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    expect(screen.getByText('Chinese')).toBeInTheDocument();
    expect(screen.getByText('Pinyin')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });

  it('displays all vocabulary items', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    expect(screen.getByText('你好')).toBeInTheDocument();
    expect(screen.getByText('谢谢')).toBeInTheDocument();
    expect(screen.getByText('再见')).toBeInTheDocument();
  });

  it('displays pinyin for each vocabulary item', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    expect(screen.getByText('Nǐ hǎo')).toBeInTheDocument();
    expect(screen.getByText('Xièxiè')).toBeInTheDocument();
    expect(screen.getByText('Zàijiàn')).toBeInTheDocument();
  });

  it('displays spanish translation for each vocabulary item', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    expect(screen.getByText('Hola')).toBeInTheDocument();
    expect(screen.getByText('Gracias')).toBeInTheDocument();
    expect(screen.getByText('Adiós')).toBeInTheDocument();
  });

  it('renders correct number of table rows', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('displays items in correct order', () => {
    render(<VocabularyList vocabulary={mockVocabulary} />);

    const chineseCells = screen.getAllByText(/你好|谢谢|再见/);
    expect(chineseCells[0]).toHaveTextContent('你好');
    expect(chineseCells[1]).toHaveTextContent('谢谢');
    expect(chineseCells[2]).toHaveTextContent('再见');
  });
});
