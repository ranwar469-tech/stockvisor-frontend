import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import AIInsightsSidebar from '../../components/AIInsightsSidebar';
import AnalystChart from '../../components/AnalystChart';
import AreaChartPortfolio from '../../components/AreaChartPortfolio';
import Discussion from '../../components/Discussion';
import Layout from '../../components/Layout';
import PortfolioRadarChart from '../../components/PortfolioRadarChart';
import StockHeatmap from '../../components/StockHeatmap';
import StocksTable from '../../components/StocksTable';
import TipsComponent from '../../components/TipsComponent';
import TutorialPopup from '../../components/TutorialPopup';

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

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({ theme: 'dark', toggleTheme: vi.fn() })),
}));

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(async (url) => {
      if (url === '/insights/technology' || url === '/insights/energy' || url === '/insights/healthcare' || url === '/insights/financial') {
        return { data: [{ label: 'positive', score: 0.8 }] };
      }
      if (url === '/insights/alerts/') {
        return {
          data: {
            ai_alert_1: 'Market stable',
            ai_alert_2: 'Bullish momentum',
            ai_alert_3: 'Watch rates',
            ai_alert_4: 'Volatility moderate',
          },
        };
      }
      if (url.startsWith('/stocks/quote/')) {
        const symbol = url.split('/').pop();
        return {
          data: {
            symbol,
            name: `${symbol} Inc`,
            price: 99.5,
            change: 0.7,
            changePercent: 0.7,
            volume: 500000,
          },
        };
      }
      if (url === '/stocks/search') return { data: [{ symbol: 'AAPL', name: 'Apple' }] };
      if (url === '/stocks/recommendations') return { data: [{ period: '2025-03-01', strongBuy: 3, buy: 2, hold: 1, sell: 0, strongSell: 0 }] };
      if (url === '/api/heatmap') return { data: [{ stock: 'AAPL', sector: 'Technology', mcap: 1000000000, change: 1.2 }] };
      if (url === '/watchlist/') return { data: [{ symbol: 'AAPL' }] };
      if (url === '/discussions/threads') {
        return { data: [{ id: 't1', title: 'Thread title', category: 'General', created_by: 'u1', created_by_username: 'Test User', participating_users: [], message_count: 1 }] };
      }
      return { data: [] };
    }),
    post: vi.fn(async () => ({ data: {} })),
    patch: vi.fn(async () => ({ data: {} })),
    delete: vi.fn(async () => ({ data: {} })),
  },
}));

describe('component smoke tests', () => {
  it('renders AIInsightsSidebar', async () => {
    render(<AIInsightsSidebar open={true} onClose={vi.fn()} />);
    await waitFor(() => expect(screen.getByText('AI Insights')).toBeInTheDocument());
  });

  it('renders AnalystChart', async () => {
    render(<AnalystChart recommendationData={[]} />);
    await waitFor(() => expect(screen.getByText('Expert Analysis')).toBeInTheDocument());
  });

  it('renders AreaChartPortfolio', () => {
    render(<AreaChartPortfolio holdings={[{ quantity: 1, purchasePrice: 100, currentPrice: 120, createdAt: new Date().toISOString() }]} />);
    expect(screen.getByText('Portfolio Cost vs Market Value')).toBeInTheDocument();
  });

  it('renders Discussion', async () => {
    render(
      <MemoryRouter>
        <Discussion />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Popular Discussions')).toBeInTheDocument());
  });

  it('renders Layout with routed outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Outlet Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('StockVisor')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });

  it('renders PortfolioRadarChart', () => {
    render(<PortfolioRadarChart holdings={[{ sector: 'Technology', quantity: 2, purchasePrice: 100 }]} />);
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
  });

  it('renders StockHeatmap', async () => {
    render(<StockHeatmap />);
    await waitFor(() => expect(screen.getByText('Market Heatmap')).toBeInTheDocument());
  });

  it('renders StocksTable', async () => {
    render(
      <MemoryRouter>
        <StocksTable />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText('Popular Stocks')).toBeInTheDocument());
  });

  it('renders TipsComponent', () => {
    render(
      <TipsComponent
        tip={{
          title: 'Sample Tip',
          difficulty: 'Beginner',
          icon: '💡',
          description: 'Description',
          keyPoints: ['Point A'],
          steps: [{ title: 'Step 1', detail: 'Do this' }],
        }}
        onClose={vi.fn()}
      />
    );
    expect(screen.getAllByText('Sample Tip').length).toBeGreaterThan(0);
  });

  it('renders TutorialPopup when open', () => {
    render(
      <TutorialPopup
        isOpen={true}
        tutorialKey="analystChart"
        onClose={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Expert Analysis')).toBeInTheDocument();
  });
});
