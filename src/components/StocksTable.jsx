import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, Star, RefreshCw, Search, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const WATCHLIST_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

function formatVolume(vol) {
  if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(1) + 'B';
  if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(1) + 'M';
  if (vol >= 1_000) return (vol / 1_000).toFixed(1) + 'K';
  return String(vol);
}

export default function StocksTable() {
  const { isAuthenticated } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const toastTimerRef = useRef(null);
  const searchRef = useRef(null);

  const triggerAddedToast = useCallback(() => {
    setShowAddedToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowAddedToast(false);
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  // Debounced search against /stocks/search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setShowDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setHasSearched(true);
      try {
        const { data } = await api.get('/stocks/search', { params: { q: searchQuery.trim() } });
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
        setShowDropdown(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Load user's watchlist from backend when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    (async () => {
      try {
        const { data } = await api.get('/watchlist/');
        setFavorites(data.map(item => item.symbol));
      } catch (err) {
        console.error('Failed to load watchlist:', err);
      }
    })();
  }, [isAuthenticated]);

  // Add a searched stock to favorites (syncs with backend watchlist)
  const addFromSearch = async (symbol) => {
    setShowDropdown(false);
    setSearchQuery('');
    // Already in the stocks list?
    const existing = stocks.find(s => s.symbol === symbol);
    if (existing) {
      if (!favorites.includes(symbol)) {
        setFavorites(prev => [...prev, symbol]);
        if (isAuthenticated) {
          try { await api.post('/watchlist/', { symbol }); } catch { /* ignore dupes */ }
        }
        triggerAddedToast();
      }
      return;
    }
    // Fetch quote and append
    try {
      const { data } = await api.get(`/stocks/quote/${symbol}`);
      setStocks(prev => [...prev, data]);
      setFavorites(prev => [...prev, symbol]);
      if (isAuthenticated) {
        try { await api.post('/watchlist/', { symbol }); } catch { /* ignore dupes */ }
      }
      triggerAddedToast();
    } catch (err) {
      console.error('Failed to fetch quote for', symbol, err);
    }
  };

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        WATCHLIST_SYMBOLS.map((sym) =>
          api.get(`/stocks/quote/${sym}`).then((res) => res.data)
        )
      );
      setStocks(results);
    } catch (err) {
      console.error('Failed to fetch stock quotes:', err);
      setError('Failed to load stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchStocks]);

  const toggleFavorite = async (symbol) => {
    const isFav = favorites.includes(symbol);
    // Optimistic update
    setFavorites(prev =>
      isFav ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
    if (isAuthenticated) {
      try {
        if (isFav) {
          await api.delete(`/watchlist/${symbol}`);
        } else {
          await api.post('/watchlist/', { symbol });
        }
      } catch (err) {
        // Revert on failure
        console.error('Watchlist sync failed:', err);
        setFavorites(prev =>
          isFav ? [...prev, symbol] : prev.filter(s => s !== symbol)
        );
      }
    }
  };

  const filteredStocks = activeTab === 'favorites'
    ? stocks.filter(s => favorites.includes(s.symbol))
    : stocks;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-[448.788px] border border-[#2ebd85] dark:border-[#2ebd85] overflow-hidden transition-colors duration-300 flex flex-col">
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
          Popular Stocks
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

        <div ref={searchRef} className="relative mx-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (hasSearched) setShowDropdown(true); }}
              placeholder="Looking for a specific stock?"
              className="w-72 max-w-full rounded-lg border border-[#2ebd85] bg-[#edfaf4] dark:bg-gray-700 pl-8 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
            />
          </div>

          {/* Search results dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-72 max-h-60 overflow-y-auto rounded-lg border border-[#2ebd85] bg-white dark:bg-gray-800 shadow-lg z-50">
              {searchLoading ? (
                <div className="flex items-center justify-center py-4 text-sm text-slate-500 dark:text-gray-400">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Searching…
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-4 px-4 text-center text-sm text-rose-500">Stock not found</div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => addFromSearch(item.symbol)}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#edfaf4] dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{item.symbol}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 truncate">{item.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <button
          onClick={fetchStocks}
          disabled={loading}
          className="ml-auto p-2 text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] transition-colors"
          title="Refresh quotes"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading / Error / Table */}
      {loading && stocks.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center text-slate-500 dark:text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
          Loading stock data…
        </div>
      ) : error && stocks.length === 0 ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-rose-500">
          <p>{error}</p>
          <button onClick={fetchStocks} className="mt-3 text-sm text-[#2ebd85] hover:underline">
            Retry
          </button>
        </div>
      ) : (
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-gray-700 border-b border-slate-200 dark:border-gray-700">
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
                  <span className="text-black dark:text-white">{formatVolume(stock.volume)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {showAddedToast && (
        <div className="fixed bottom-6 right-6 z-60 flex items-center gap-3 rounded-lg border border-[#2ebd85] bg-[#edfaf4] dark:bg-gray-800 dark:border-[#2ebd85] px-4 py-3 shadow-lg">
          <span className="text-sm font-medium text-[#2ebd85]">Added to favorites</span>
          <button
            onClick={() => {
              setShowAddedToast(false);
              if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
                toastTimerRef.current = null;
              }
            }}
            className="text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
