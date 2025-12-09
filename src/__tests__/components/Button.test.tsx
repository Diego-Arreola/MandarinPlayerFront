import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../components/Button';

describe('Button Component', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button', { name: /primary button/i });
    
    expect(button).toHaveClass('bg-primary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    
    expect(button).toHaveClass('bg-secondary');
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Styled Button</Button>);
    const button = screen.getByRole('button', { name: /styled button/i });
    
    expect(button).toHaveClass('custom-class');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    
    expect(button).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    let buttonRef: HTMLButtonElement | null = null;
     
    const { container } = render(
      <Button ref={(el) => { buttonRef = el; }}>
        Ref Button
      </Button>
    );
    
    expect(buttonRef).toBeInstanceOf(HTMLButtonElement);
  });
});
