import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTopicForm from '../../components/CreateTopicForm';

describe('CreateTopicForm Component', () => {
  it('renders form with title and description inputs', () => {
    render(
      <CreateTopicForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/topic title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('renders Cancel and Create Topic buttons', () => {
    render(
      <CreateTopicForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create topic/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    render(
      <CreateTopicForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Brief description of the topic...') as HTMLTextAreaElement;

    await userEvent.type(titleInput, 'Numbers');
    await userEvent.type(descriptionInput, 'Learn Chinese numbers from 1 to 10');

    expect(titleInput.value).toBe('Numbers');
    expect(descriptionInput.value).toBe('Learn Chinese numbers from 1 to 10');
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const handleCancel = vi.fn();

    render(
      <CreateTopicForm
        onSubmit={vi.fn()}
        onCancel={handleCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await userEvent.click(cancelButton);

    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CreateTopicForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings');
    const descriptionInput = screen.getByPlaceholderText('Brief description of the topic...');
    const submitButton = screen.getByRole('button', { name: /create topic/i });

    await userEvent.type(titleInput, 'Numbers');
    await userEvent.type(descriptionInput, 'Learn Chinese numbers');
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith('Numbers', 'Learn Chinese numbers');
  });

  it('disables submit button when title is empty', () => {
    render(
      <CreateTopicForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create topic/i }) as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when title is filled', async () => {
    render(
      <CreateTopicForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings');
    const submitButton = screen.getByRole('button', { name: /create topic/i }) as HTMLButtonElement;

    await userEvent.type(titleInput, 'Numbers');

    expect(submitButton).not.toBeDisabled();
  });

  it('allows empty description', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CreateTopicForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings');
    const submitButton = screen.getByRole('button', { name: /create topic/i });

    await userEvent.type(titleInput, 'Numbers');
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith('Numbers', '');
  });

  it('clears form after successful submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <CreateTopicForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings') as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText('Brief description of the topic...') as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /create topic/i });

    await userEvent.type(titleInput, 'Numbers');
    await userEvent.type(descriptionInput, 'Learn Chinese numbers');
    await userEvent.click(submitButton);

    // Wait for async submission
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  it('shows "Creating..." text while submitting', async () => {
    const handleSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <CreateTopicForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings');
    const submitButton = screen.getByRole('button', { name: /create topic/i });

    await userEvent.type(titleInput, 'Numbers');
    await userEvent.click(submitButton);

    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
  });

  it('disables all buttons while submitting', async () => {
    const handleSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <CreateTopicForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const titleInput = screen.getByPlaceholderText('e.g., Greetings');
    const submitButton = screen.getByRole('button', { name: /create topic/i }) as HTMLButtonElement;
    const cancelButton = screen.getByRole('button', { name: /cancel/i }) as HTMLButtonElement;

    await userEvent.type(titleInput, 'Numbers');
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
});
