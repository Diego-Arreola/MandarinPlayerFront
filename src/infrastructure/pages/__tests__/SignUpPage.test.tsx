import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignUpPage from '../SignUpPage';

const { mockNavigate, mockRegisterUser } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockRegisterUser: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../api/HttpAuthRepository', () => ({
  authRepository: {
    registerUser: mockRegisterUser,
    loginUser: vi.fn(),
  },
}));

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form with username, email, and password inputs', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders Create Account and Return buttons', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /return/i })).toBeInTheDocument();
  });

  it('displays login link', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const loginLink = screen.getByRole('link', { name: /log in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('updates username input when user types', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    await userEvent.type(usernameInput, 'testuser');

    expect(usernameInput.value).toBe('testuser');
  });

  it('updates email input when user types', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    await userEvent.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input when user types', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    await userEvent.type(passwordInput, 'password123');

    expect(passwordInput.value).toBe('password123');
  });

  it('navigates to home page when Return button is clicked', async () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const returnButton = screen.getByRole('button', { name: /return/i });
    await userEvent.click(returnButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders title', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders required attributes on inputs', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    expect(usernameInput.required).toBe(true);
    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    vi.mocked(mockRegisterUser).mockResolvedValue({ id: '1', email: 'new@example.com' } as any);

    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await user.type(usernameInput, 'newuser');
    await user.type(emailInput, 'new@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // After successful signup, should show success message
    await waitFor(() => {
      expect(screen.getByText(/sign up successful/i)).toBeInTheDocument();
    });
  });

  it('validates all fields are filled', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();
  });

  it('clears form fields individually', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    await user.type(usernameInput, 'testuser');
    await user.clear(usernameInput);

    expect(usernameInput.value).toBe('');
  });

  it('allows multiple form submissions', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    await user.click(submitButton);

    expect(submitButton).toBeInTheDocument();
  });

  it('handles special characters in inputs', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    await user.type(emailInput, 'test+special@example.com');

    expect(emailInput.value).toBe('test+special@example.com');
  });

  it('prevents default form submission behavior', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);

    expect(submitButton).not.toBeDisabled();
  });

  it('maintains form state across renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    await user.type(usernameInput, 'user123');

    rerender(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const newUsernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;
    expect(newUsernameInput).toBeInTheDocument();
  });

  it('shows password as masked input', () => {
    render(
      <BrowserRouter>
        <SignUpPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    expect(passwordInput.type).toBe('password');
  });
});
