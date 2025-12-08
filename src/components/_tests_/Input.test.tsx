import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input Component', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    
    expect(input).toBeInTheDocument();
  });

  it('accepts text input', async () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    
    await userEvent.type(input, 'hello');
    expect(input.value).toBe('hello');
  });

  it('has correct default type', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    
    expect(input.type).toBe('text');
  });

  it('renders with email type', () => {
    render(<Input type="email" placeholder="Enter email" />);
    const input = screen.getByPlaceholderText('Enter email') as HTMLInputElement;
    
    expect(input.type).toBe('email');
  });

  it('renders with password type', () => {
    render(<Input type="password" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText('Enter password') as HTMLInputElement;
    
    expect(input.type).toBe('password');
  });

  it('can be disabled', () => {
    render(<Input placeholder="Enter text" disabled />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    
    expect(input).toBeDisabled();
  });

  it('renders with custom className', () => {
    render(<Input placeholder="Enter text" className="custom-class" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    let inputRef: HTMLInputElement | null = null;
    
    render(
      <Input 
        placeholder="Enter text"
        ref={(el) => { inputRef = el; }}
      />
    );
    
    expect(inputRef).toBeInstanceOf(HTMLInputElement);
  });

  it('supports aria attributes', () => {
    render(
      <Input 
        placeholder="Enter text"
        aria-label="test input"
        aria-describedby="test-desc"
      />
    );
    const input = screen.getByLabelText('test input');
    
    expect(input).toHaveAttribute('aria-describedby', 'test-desc');
  });
});
