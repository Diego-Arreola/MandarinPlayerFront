import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';

describe('ProtectedRoute Component', () => {
  it('exports a valid component', () => {
    expect(ProtectedRoute).toBeDefined();
    expect(typeof ProtectedRoute).toBe('function');
  });

  it('is a React component', () => {
    expect(typeof ProtectedRoute).toBe('function');
  });

  it('renders without crashing when wrapped with AuthProvider', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('has correct component name', () => {
    expect(ProtectedRoute.name).toBe('ProtectedRoute');
  });

  it('requires AuthProvider to work', () => {
    // This test verifies that rendering without AuthProvider throws an error
    expect(() => {
      render(
        <BrowserRouter>
          <ProtectedRoute />
        </BrowserRouter>
      );
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
