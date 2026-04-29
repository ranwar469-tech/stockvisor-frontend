import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import About from '../../pages/About';
import AccountSettings from '../../pages/AccountSettings';
import AdminDashboard from '../../pages/AdminDashboard';
import Community from '../../pages/Community';
import DiscussionThread from '../../pages/DiscussionThread';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import News from '../../pages/News';
import Portfolio from '../../pages/Portfolio';
import Register from '../../pages/Register';
import Tips from '../../pages/Tips';

const authState = {
  isAuthenticated: true,
  loading: false,
  user: { id: 'u1', username: 'Test User', email: 'user@example.com', role: 'admin' },
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
};

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => authState),
}));

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(async (url) => {
      if (url === '/stocks/status') return { data: { status: 'open' } };
      if (url === '/insights/technology' || url === '/insights/energy' || url === '/insights/healthcare' || url === '/insights/financial') {
        return { data: [{ label: 'positive', score: 0.9 }] };
      }
      if (url === '/insights/alerts/') {
        return {
          data: {
            ai_alert_1: 'Market is stable',
            ai_alert_2: 'Volume is rising',
            ai_alert_3: 'Tech sentiment improved',
            ai_alert_4: 'Watch volatility',
          },
        };
      }
      if (url.startsWith('/stocks/quote/')) {
        const symbol = url.split('/').pop();
        return {
          data: {
            symbol,
            name: `${symbol} Inc`,
            price: 120.5,
            change: 1.2,
            changePercent: 1.2,
            volume: 1000000,
            current_price: 120.5,
          },
        };
      }
      if (url === '/stocks/news') {
        return {
          data: [{
            id: 'n1',
            external_id: 'news-1',
            category: 'general',
            datetime: 1730000000,
            headline: 'Market update',
            image: '',
            source: 'Reuters',
            summary: 'Summary',
            url: 'https://example.com/news/1',
          }],
        };
      }
      if (url === '/stocks/news/saved') return { data: [] };
      if (url === '/portfolio/') return { data: [] };
      if (url === '/portfolio/history') return { data: [] };
      if (url === '/admin/users') return { data: [] };
      if (url === '/admin/reports') return { data: [] };
      if (url === '/discussions/threads') {
        return { data: [{ id: 't1', title: 'Thread title', category: 'General', created_by: 'u1', created_by_username: 'Test User', participating_users: [], message_count: 1 }] };
      }
      if (url === '/discussions/threads/t1') {
        return {
          data: {
            id: 't1',
            title: 'Thread title',
            category: 'General',
            created_by: 'u1',
            created_by_username: 'Test User',
            posts: [{ id: 'p1', user_id: 'u1', username: 'Test User', message: 'Hello', likes: 1, created_at: new Date().toISOString() }],
            participating_users: [{ id: 'u1' }],
          },
        };
      }
      if (url === '/discussions/posts/p1/likes') return { data: { liked: false, likes: 1 } };
      if (url === '/stocks/search') return { data: [{ symbol: 'AAPL', name: 'Apple' }] };
      return { data: [] };
    }),
    post: vi.fn(async () => ({ data: {} })),
    patch: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
  },
}));

vi.mock('../../components/AnalystChart', () => ({ default: () => <div>Analyst Chart</div> }));
vi.mock('../../components/StockHeatmap', () => ({ default: () => <div>Stock Heatmap</div> }));
vi.mock('../../components/StocksTable', () => ({ default: () => <div>Stocks Table</div> }));
vi.mock('../../components/AreaChartPortfolio', () => ({ default: () => <div>Area Chart Portfolio</div> }));
vi.mock('../../components/PortfolioRadarChart', () => ({ default: () => <div>Portfolio Radar Chart</div> }));
vi.mock('../../components/Discussion', () => ({ default: () => <div>Discussion Component</div> }));

function renderWithRouter(ui, initialEntries = ['/']) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
}

describe('page smoke tests', () => {
  it('renders Home', async () => {
    renderWithRouter(<Home />);
    await waitFor(() => expect(screen.getByText('Market Dashboard')).toBeInTheDocument());
  });

  it('renders About', () => {
    renderWithRouter(<About />);
    expect(screen.getByText('About StockVisor')).toBeInTheDocument();
  });

  it('renders Portfolio', async () => {
    renderWithRouter(<Portfolio />);
    await waitFor(() => expect(screen.getByText('Your Portfolio')).toBeInTheDocument());
  });

  it('renders Community', async () => {
    renderWithRouter(<Community />);
    await waitFor(() => expect(screen.getByText('Community')).toBeInTheDocument());
  });

  it('renders DiscussionThread route', async () => {
    render(
      <MemoryRouter initialEntries={['/community/threads/t1']}>
        <Routes>
          <Route path="/community/threads/:threadId" element={<DiscussionThread />} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Thread title')).toBeInTheDocument());
  });

  it('renders News', async () => {
    renderWithRouter(<News />);
    await waitFor(() => expect(screen.getByText('Market News')).toBeInTheDocument());
  });

  it('renders Tips', () => {
    renderWithRouter(<Tips />);
    expect(screen.getByText(/Trading Tutorials/i)).toBeInTheDocument();
  });

  it('renders AccountSettings', () => {
    renderWithRouter(<AccountSettings />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('renders Login', () => {
    renderWithRouter(<Login />);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('renders Register', () => {
    renderWithRouter(<Register />);
    expect(screen.getByText('Create your free account')).toBeInTheDocument();
  });

  it('renders AdminDashboard', async () => {
    renderWithRouter(<AdminDashboard />);
    await waitFor(() => expect(screen.getByText('Admin Dashboard')).toBeInTheDocument());
  });
});
