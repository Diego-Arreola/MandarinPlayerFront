import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddVocabularyForm from '../AddVocabularyForm';

describe('AddVocabularyForm Component', () => {
  it('renders form with all input fields', () => {
    render(
      <AddVocabularyForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/chinese/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pinyin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/spanish meaning/i)).toBeInTheDocument();
  });

  it('renders Cancel and Add Word buttons', () => {
    render(
      <AddVocabularyForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add word/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    render(
      <AddVocabularyForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const chineseInput = screen.getByPlaceholderText('e.g., 你好') as HTMLInputElement;
    const pinyinInput = screen.getByPlaceholderText('e.g., Nǐ hǎo') as HTMLInputElement;
    const spanishInput = screen.getByPlaceholderText('e.g., Hola') as HTMLInputElement;

    await userEvent.type(chineseInput, '你好');
    await userEvent.type(pinyinInput, 'Nǐ hǎo');
    await userEvent.type(spanishInput, 'Hola');

    expect(chineseInput.value).toBe('你好');
    expect(pinyinInput.value).toBe('Nǐ hǎo');
    expect(spanishInput.value).toBe('Hola');
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const handleCancel = vi.fn();

    render(
      <AddVocabularyForm
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
      <AddVocabularyForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const chineseInput = screen.getByPlaceholderText('e.g., 你好');
    const pinyinInput = screen.getByPlaceholderText('e.g., Nǐ hǎo');
    const spanishInput = screen.getByPlaceholderText('e.g., Hola');
    const submitButton = screen.getByRole('button', { name: /add word/i });

    await userEvent.type(chineseInput, '你好');
    await userEvent.type(pinyinInput, 'Nǐ hǎo');
    await userEvent.type(spanishInput, 'Hola');
    await userEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      chinese: '你好',
      pinyin: 'Nǐ hǎo',
      spanish: 'Hola',
    });
  });

  it('disables submit button when required fields are empty', () => {
    render(
      <AddVocabularyForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /add word/i }) as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when required fields are filled', async () => {
    render(
      <AddVocabularyForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    const chineseInput = screen.getByPlaceholderText('e.g., 你好');
    const spanishInput = screen.getByPlaceholderText('e.g., Hola');
    const submitButton = screen.getByRole('button', { name: /add word/i }) as HTMLButtonElement;

    await userEvent.type(chineseInput, '你好');
    await userEvent.type(spanishInput, 'Hola');

    expect(submitButton).not.toBeDisabled();
  });

  it('clears form after successful submission', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <AddVocabularyForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const chineseInput = screen.getByPlaceholderText('e.g., 你好') as HTMLInputElement;
    const pinyinInput = screen.getByPlaceholderText('e.g., Nǐ hǎo') as HTMLInputElement;
    const spanishInput = screen.getByPlaceholderText('e.g., Hola') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /add word/i });

    await userEvent.type(chineseInput, '你好');
    await userEvent.type(pinyinInput, 'Nǐ hǎo');
    await userEvent.type(spanishInput, 'Hola');
    await userEvent.click(submitButton);

    // Wait for async submission
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(chineseInput.value).toBe('');
    expect(pinyinInput.value).toBe('');
    expect(spanishInput.value).toBe('');
  });

  it('shows "Adding..." text while submitting', async () => {
    const handleSubmit = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(
      <AddVocabularyForm
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />
    );

    const chineseInput = screen.getByPlaceholderText('e.g., 你好');
    const spanishInput = screen.getByPlaceholderText('e.g., Hola');
    const submitButton = screen.getByRole('button', { name: /add word/i });

    await userEvent.type(chineseInput, '你好');
    await userEvent.type(spanishInput, 'Hola');
    await userEvent.click(submitButton);

    expect(screen.getByRole('button', { name: /adding/i })).toBeInTheDocument();
  });
});
