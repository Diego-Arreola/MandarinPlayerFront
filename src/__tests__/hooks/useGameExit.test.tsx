import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useGameExit } from '../../hooks/useGameExit';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test component that uses the hook
const TestComponent = ({ redirectPath }: { redirectPath?: string }) => {
  const { showExitConfirm, handleExit, confirmExit, cancelExit } = useGameExit(redirectPath);

  return (
    <div>
      <button onClick={handleExit}>Exit Game</button>
      {showExitConfirm && (
        <div data-testid="exit-modal">
          <p>Are you sure you want to exit?</p>
          <button onClick={confirmExit}>Confirm</button>
          <button onClick={cancelExit}>Cancel</button>
        </div>
      )}
    </div>
  );
};

describe('useGameExit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with exit confirmation hidden', () => {
    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    expect(screen.queryByTestId('exit-modal')).not.toBeInTheDocument();
  });

  it('shows exit confirmation modal when handleExit is called', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });
  });

  it('displays confirmation message when modal is shown', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
  });

  it('navigates to default path when confirmExit is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(mockNavigate).toHaveBeenCalledWith('/welcome');
  });

  it('navigates to custom path when provided', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent redirectPath="/home" />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  it('hides exit confirmation modal when cancelExit is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('exit-modal')).not.toBeInTheDocument();
    });
  });

  it('does not navigate when cancelExit is clicked', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('allows showing and hiding modal multiple times', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    const exitButton = screen.getByRole('button', { name: /exit game/i });

    // First open/close cycle
    await user.click(exitButton);
    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    let cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('exit-modal')).not.toBeInTheDocument();
    });

    // Second open/close cycle
    await user.click(exitButton);
    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('exit-modal')).not.toBeInTheDocument();
    });
  });

  it('provides correct return object structure', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    // The hook should return the proper structure
    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await user.click(exitButton);

    // showExitConfirm should be true (modal visible)
    await waitFor(() => {
      expect(screen.getByTestId('exit-modal')).toBeInTheDocument();
    });

    // Modal should have proper controls
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});
