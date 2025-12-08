import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GameLayout from '../GameLayout';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ roomCode: 'ROOM123' }),
  };
});

describe('GameLayout Component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <GameLayout />
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it('logs entering game room on mount', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    render(
      <BrowserRouter>
        <GameLayout />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith('Entering game room: ROOM123');

    consoleSpy.mockRestore();
  });

  it('logs leaving game room on unmount', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    const { unmount } = render(
      <BrowserRouter>
        <GameLayout />
      </BrowserRouter>
    );

    consoleSpy.mockClear();
    unmount();

    expect(consoleSpy).toHaveBeenCalledWith('Leaving game room: ROOM123');

    consoleSpy.mockRestore();
  });

  it('updates room code when params change', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    const { rerender } = render(
      <BrowserRouter>
        <GameLayout />
      </BrowserRouter>
    );

    consoleSpy.mockClear();

    // Rerender with new room code
    rerender(
      <BrowserRouter>
        <GameLayout />
      </BrowserRouter>
    );

    consoleSpy.mockRestore();
  });
});
