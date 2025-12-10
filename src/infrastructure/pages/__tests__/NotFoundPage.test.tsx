import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage';

describe('NotFoundPage', () => {
  it('renders 404 heading', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /404/i })).toBeInTheDocument();
  });

  it('renders page not found message', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: /page not found/i })).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/the page you are looking for does not exist/i)).toBeInTheDocument();
  });

  it('renders link to homepage', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', { name: /go to homepage/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('has correct styling for 404 heading', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    const heading = screen.getByRole('heading', { level: 1, name: /404/i });
    expect(heading).toHaveStyle({ fontSize: '5rem' });
  });
});
