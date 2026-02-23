import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Star } from 'lucide-react';
import TradingViewWidget from '../components/StockWdgets';
import StockHeatmap from '../components/StockHeatmap';

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: 1.33, volume: '52.3M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.20, changePercent: -0.84, volume: '28.7M' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 5.67, changePercent: 1.52, volume: '31.2M' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: 3.21, changePercent: 2.16, volume: '45.8M' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -4.15, changePercent: -1.68, volume: '89.4M' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 722.48, change: 12.30, changePercent: 1.73, volume: '38.9M' },
  ];

  const marketStats = [
    { label: 'Market Cap', value: '$45.2T', icon: DollarSign },
    { label: 'Total Volume', value: '286.3M', icon: Activity },
    { label: 'Active Stocks', value: '6,247', icon: BarChart3 },
  ];

  const toggleFavorite = (symbol) => {
    setFavorites(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const filteredStocks = activeTab === 'favorites'
    ? stocks.filter(s => favorites.includes(s.symbol))
    : stocks;

  return (
    <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Market Dashboard</h2>
          <span className="text-slate-600 dark:text-slate-400 mb-6 inline-block border-[#2ebd85] border-b-2">Real-time stock prices and market insights at your fingertips</span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" style={{ gridAutoRows: '1fr' }}>
            {/* Market Stats – stacked vertically */}
            <div className="flex flex-col gap-4">
              {marketStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-[#2ebd85] dark:border-[#2ebd85] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className="bg-[#edfaf4] dark:bg-gray-700 p-3 rounded-lg">
                      <stat.icon className="w-5 h-5 text-[#2ebd85] dark:text-[#4cc99b]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TradingView Widget – spans 1 cols */}
            <div className="md:col-span-1 p-0.5">
              <div className="bg-slate-50 dark:bg-gray-900 p-1 rounded-lg h-full min-h-80">
                <TradingViewWidget />
              </div>
            </div>

            {/* Heatmap Widget – spans 1 col, same height as siblings */}
            <div className="md:col-span-1 p-0.5">
              <div className="relative overflow-hidden rounded-lg h-full min-h-80 max-h-[28rem]">
                <StockHeatmap />
              </div>
            </div>

          </div>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] dark:border-[#2ebd85] overflow-hidden transition-colors duration-300">
        {/* Tabs */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 flex items-center space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-[#2ebd85] text-[#2ebd85]'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-[#2ebd85]'
            }`}
          >
            All Stocks
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-2 px-4 font-medium transition-colors border-b-2 flex items-center space-x-2 ${
              activeTab === 'favorites'
                ? 'border-[#2ebd85] text-[#2ebd85]'
                : 'border-transparent text-slate-600 dark:text-gray-400 hover:text-[#2ebd85]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
        </div>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-gray-700 border-b border-slate-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider w-12"></th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
              {filteredStocks.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFavorite(stock.symbol)}
                      className={`transition-colors ${
                        favorites.includes(stock.symbol)
                          ? 'text-yellow-500'
                          : 'text-slate-600 dark:text-gray-400'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(stock.symbol) ? 'fill-current' : ''
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 dark:text-white">{stock.symbol}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 dark:text-gray-400">{stock.name}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-slate-900 dark:text-white">${stock.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {stock.change >= 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-[#2ebd85]" />
                          <span className="font-semibold text-[#2ebd85]">
                            +${Math.abs(stock.change).toFixed(2)} ({stock.changePercent}%)
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-rose-600" />
                          <span className="font-semibold text-rose-600">
                            -${Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent)}%)
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-black dark:text-white">{stock.volume}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
