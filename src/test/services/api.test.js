import { beforeEach, describe, expect, it, vi } from 'vitest';

const axiosMock = vi.hoisted(() => {
  const requestUse = vi.fn();
  const responseUse = vi.fn();
  const instance = {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
  };

  return {
    create: vi.fn(() => instance),
    requestUse,
    responseUse,
  };
});

vi.mock('axios', () => ({
  default: {
    create: axiosMock.create,
  },
}));

import api from '../../services/api';

describe('api service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates an axios instance with expected defaults', () => {
    expect(axiosMock.create).toHaveBeenCalledTimes(1);
    expect(axiosMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      })
    );

    expect(api.defaults.headers.common['ngrok-skip-browser-warning']).toBe('true');
  });

  it('attaches bearer token in request interceptor', () => {
    const interceptor = axiosMock.requestUse.mock.calls[0][0];

    localStorage.setItem('sv_token', 'abc123');
    const config = { headers: {} };
    const nextConfig = interceptor(config);

    expect(nextConfig.headers.Authorization).toBe('Bearer abc123');
  });

  it('clears storage and emits auth:expired on non-auth 401 responses', async () => {
    const onRejected = axiosMock.responseUse.mock.calls[0][1];
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    localStorage.setItem('sv_token', 'token');
    localStorage.setItem('sv_user', JSON.stringify({ id: 1 }));

    const error = {
      config: { url: '/portfolio/' },
      response: { status: 401 },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(localStorage.getItem('sv_token')).toBeNull();
    expect(localStorage.getItem('sv_user')).toBeNull();
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
    expect(dispatchSpy.mock.calls[0][0].type).toBe('auth:expired');
  });

  it('does not clear storage for auth route 401 responses', async () => {
    const onRejected = axiosMock.responseUse.mock.calls[0][1];

    localStorage.setItem('sv_token', 'token');
    localStorage.setItem('sv_user', JSON.stringify({ id: 1 }));

    const error = {
      config: { url: '/auth/login' },
      response: { status: 401 },
    };

    await expect(onRejected(error)).rejects.toBe(error);
    expect(localStorage.getItem('sv_token')).toBe('token');
    expect(localStorage.getItem('sv_user')).toBeTruthy();
  });
});
