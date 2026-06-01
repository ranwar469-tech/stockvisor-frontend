import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import { useTheme } from '../hooks/useTheme';

vi.mock('../hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../components/Layout', async () => {
  const { Outlet } = await import('react-router-dom');
  return {
    default: function MockLayout() {
      return (
        <div>
          <div>Layout Shell</div>
          <Outlet />
        </div>
      );
    },
  };
});

vi.mock('../components/AdminRoute', () => ({
  default: ({ children }) => <>{children}</>,
}));

vi.mock('../pages/Home', () => ({ default: () => <div>Home Page</div> }));
vi.mock('../pages/About', () => ({ default: () => <div>About Page</div> }));
vi.mock('../pages/Portfolio', () => ({ default: () => <div>Portfolio Page</div> }));
vi.mock('../pages/Community', () => ({ default: () => <div>Community Page</div> }));
vi.mock('../pages/DiscussionThread', () => ({ default: () => <div>Thread Page</div> }));
vi.mock('../pages/News', () => ({ default: () => <div>News Page</div> }));
vi.mock('../pages/Tips', () => ({ default: () => <div>Tips Page</div> }));
vi.mock('../pages/AccountSettings', () => ({ default: () => <div>Settings Page</div> }));
vi.mock('../pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('../pages/Register', () => ({ default: () => <div>Register Page</div> }));
vi.mock('../pages/AdminDashboard', () => ({ default: () => <div>Admin Page</div> }));

describe('App routing', () => {
  it('calls useTheme on render', () => {
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(useTheme).toHaveBeenCalled();
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders auth route directly', () => {
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Layout Shell')).not.toBeInTheDocument();
  });

  it('renders admin page through admin route wrapper', () => {
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Layout Shell')).toBeInTheDocument();
    expect(screen.getByText('Admin Page')).toBeInTheDocument();
  });

  it('redirects unknown route to home', () => {
    useTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
