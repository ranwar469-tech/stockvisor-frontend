import { Activity, BarChart3, Brain, RefreshCw } from 'lucide-react';
import AnalystChart from '../components/AnalystChart';
import StockHeatmap from '../components/StockHeatmap';
import StocksTable from '../components/StocksTable';
import { useEffect, useState } from 'react';
import api from '../services/api';


export default function Home() {
  const [marketStatus, setMarketStatus] = useState('Loading...');
  const [marketSentiment, setMarketSentiment] = useState('Bullish 🔥');
  const [sentimentRefreshing, setSentimentRefreshing] = useState(false);

  const recommendationData = [
    {
      buy: 24,
      hold: 7,
      period: '2025-03-01',
      sell: 0,
      strongBuy: 13,
      strongSell: 0,
      symbol: 'AAPL',
    },
  ];

  const fetchMarketStatus = async () => {
    try {
      const response = await api.get('/stocks/status');
      const statusText = response.data.status[0].toUpperCase() + response.data.status.slice(1);
      setMarketStatus(statusText);
    } catch (error) {
      console.error('Failed to fetch market status:', error);
    }
  };

  const normalizeSentiment = (payload) => {
    const rows = Array.isArray(payload)
      ? (Array.isArray(payload[0]) ? payload[0] : payload)
      : [];

    const sorted = [...rows].sort((first, second) => Number(second.score || 0) - Number(first.score || 0));
    const top = sorted[0];

    if (!top) return 'neutral';

    const label = String(top.label || '').toLowerCase();
    if (label === 'positive') return 'bullish';
    if (label === 'negative') return 'bearish';
    return 'neutral';
  };

  const fetchMarketSentiment = async () => {
    setSentimentRefreshing(true);
    try {
      const [techResponse, energyResponse] = await Promise.all([
        api.get('/insights/technology'),
        api.get('/insights/energy'),
      ]);

      const techSentiment = normalizeSentiment(techResponse.data);
      const energySentiment = normalizeSentiment(energyResponse.data);

      if (techSentiment === 'bullish' && energySentiment === 'bullish') {
        setMarketSentiment('Bullish 🔥');
      } else if (techSentiment === 'bearish' && energySentiment === 'bearish') {
        setMarketSentiment('Bearish ❄️');
      } else {
        setMarketSentiment('Neutral ⚠️');
      }
    } catch (error) {
      console.error('Failed to fetch market sentiment:', error);
    } finally {
      setSentimentRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketStatus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const marketStats = [
    { label: 'AI Market Sentiment', value: marketSentiment, icon: Brain },
    { label: 'US Market Status', value: marketStatus, icon: Activity },
    { label: 'Active Stocks', value: '6,247', icon: BarChart3 },
  ];

  return (
    <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Market Dashboard</h2>
          <span className="text-slate-600 dark:text-slate-400 mb-6 inline-block border-[#2ebd85] border-b-2">Real-time stock prices and market insights at your fingertips</span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" style={{ gridAutoRows: '1fr' }}>
            {/* Market Stats – stacked vertically */}
            <div className="flex flex-col gap-4 mt-2">
              {marketStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-[#2ebd85] dark:border-[#2ebd85] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-slate-600 dark:text-gray-400">{stat.label}</p>
                        {stat.label === 'AI Market Sentiment' && (
                          <button
                            type="button"
                            onClick={fetchMarketSentiment}
                            className="p-0.5 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-700"
                            title="Refresh market sentiment"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${sentimentRefreshing ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                      </div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className="bg-[#edfaf4] dark:bg-gray-700 p-3 rounded-lg">
                      <stat.icon className="w-5 h-5 text-[#2ebd85] dark:text-[#4cc99b]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analyst Recommendation Trends */}
            <div className="md:col-span-1 p-0.5">
              <div className="w-full h-full min-h-80">
                <AnalystChart recommendationData={recommendationData} />
              </div>
            </div>

            {/* Heatmap Widget – spans 1 col, same height as siblings */}
            <div className="md:col-span-1 p-0.5">
              <div className="relative overflow-hidden rounded-lg h-full min-h-80 max-h-112">
                <StockHeatmap />
              </div>
            </div>

          </div>
        </div>
      <StocksTable />
    </div>
  );
}
