import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameExitModal from '../../components/GameExitModal';

describe('GameExitModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <GameExitModal
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.queryByText(/exit game/i)).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText(/exit game\?/i)).toBeInTheDocument();
  });

  it('displays the confirmation message in Spanish', () => {
    render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByText(/¿seguro que quieres terminar el juego\?/i)).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('renders Exit Game button', () => {
    render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    expect(screen.getByRole('button', { name: /exit game/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const handleCancel = vi.fn();
    
    render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);
    
    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it('calls onConfirm when Exit Game button is clicked', async () => {
    const handleConfirm = vi.fn();
    
    render(
      <GameExitModal
        isOpen={true}
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />
    );
    
    const exitButton = screen.getByRole('button', { name: /exit game/i });
    await userEvent.click(exitButton);
    
    expect(handleConfirm).toHaveBeenCalledOnce();
  });

  it('has correct styling classes', () => {
    const { container } = render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    const overlay = container.querySelector('.modal-overlay');
    const content = container.querySelector('.modal-content');
    
    expect(overlay).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('displays title with correct styling', () => {
    const { container } = render(
      <GameExitModal
        isOpen={true}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    
    const title = container.querySelector('.modal-title');
    expect(title).toHaveStyle('color: rgb(0, 0, 0)');
  });
});
