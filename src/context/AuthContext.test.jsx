import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

function Harness() {
  const auth = useAuth();

  return (
    <div>
      <div data-testid="user">{auth.user?.username || 'none'}</div>
      <div data-testid="is-auth">{String(auth.isAuthenticated)}</div>
      <button onClick={() => auth.login('user@example.com', 'password')}>login</button>
      <button onClick={() => auth.register('new-user', 'new@example.com', 'password')}>register</button>
      <button onClick={() => auth.updateUser({ username: 'updated-name' })}>update-user</button>
      <button onClick={() => auth.logout()}>logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('restores user from local storage', async () => {
    localStorage.setItem('sv_token', 'token');
    localStorage.setItem('sv_user', JSON.stringify({ id: 1, username: 'restored' }));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('restored');
      expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    });
  });

  it('logs in and persists auth data', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        access_token: 'jwt-token',
        user: { id: 2, username: 'alice' },
      },
    });

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await user.click(screen.getByRole('button', { name: 'login' }));

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('alice');
      expect(localStorage.getItem('sv_token')).toBe('jwt-token');
    });
  });

  it('handles auth:expired event by logging out', async () => {
    localStorage.setItem('sv_token', 'token');
    localStorage.setItem('sv_user', JSON.stringify({ id: 1, username: 'alive' }));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    });

    window.dispatchEvent(new Event('auth:expired'));

    await waitFor(() => {
      expect(screen.getByTestId('is-auth')).toHaveTextContent('false');
      expect(localStorage.getItem('sv_token')).toBeNull();
    });
  });
});
