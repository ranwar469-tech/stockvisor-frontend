import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, Plus, X, RefreshCw, Search } from 'lucide-react';
import api from '../services/api';
import AreaChartPortfolio from '../components/AreaChartPortfolio';

export default function Portfolio() {
  const SELL_STOCK_ENDPOINT = '/portfolio/sell';

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', quantity: '', purchasePrice: '' });
  const [addLoading, setAddLoading] = useState(false);

  const [showSellModal, setShowSellModal] = useState(false);
  const [sellStock, setSellStock] = useState({ symbol: '', quantity: '' });
  const [sellLoading, setSellLoading] = useState(false);
  const [sellError, setSellError] = useState('');

  // Symbol search / autocomplete state
  const [symbolQuery, setSymbolQuery] = useState('');
  const [symbolResults, setSymbolResults] = useState([]);
  const [symbolSearchLoading, setSymbolSearchLoading] = useState(false);
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const symbolRef = useRef(null);

  const [sellSymbolQuery, setSellSymbolQuery] = useState('');
  const [sellSymbolResults, setSellSymbolResults] = useState([]);
  const [sellSymbolSearchLoading, setSellSymbolSearchLoading] = useState(false);
  const [showSellSymbolDropdown, setShowSellSymbolDropdown] = useState(false);
  const sellSymbolRef = useRef(null);

  // Debounced search for symbol autocomplete
  useEffect(() => {
    if (!symbolQuery.trim()) {
      setSymbolResults([]);
      setShowSymbolDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSymbolSearchLoading(true);
      try {
        const { data } = await api.get('/stocks/search', { params: { q: symbolQuery.trim() } });
        setSymbolResults(data);
      } catch {
        setSymbolResults([]);
      } finally {
        setSymbolSearchLoading(false);
        setShowSymbolDropdown(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [symbolQuery]);

  useEffect(() => {
    if (!sellSymbolQuery.trim()) {
      setSellSymbolResults([]);
      setShowSellSymbolDropdown(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSellSymbolSearchLoading(true);
      try {
        const { data } = await api.get('/stocks/search', { params: { q: sellSymbolQuery.trim() } });
        setSellSymbolResults(data);
      } catch {
        setSellSymbolResults([]);
      } finally {
        setSellSymbolSearchLoading(false);
        setShowSellSymbolDropdown(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sellSymbolQuery]);

  // Close symbol dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (symbolRef.current && !symbolRef.current.contains(e.target)) {
        setShowSymbolDropdown(false);
      }
      if (sellSymbolRef.current && !sellSymbolRef.current.contains(e.target)) {
        setShowSellSymbolDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectSymbol = (symbol, name) => {
    setNewStock((prev) => ({ ...prev, symbol }));
    setSymbolQuery(name ? `${symbol} — ${name}` : symbol);
    setShowSymbolDropdown(false);
  };

  const selectSellSymbol = (symbol, name) => {
    setSellStock((prev) => ({ ...prev, symbol }));
    setSellSymbolQuery(name ? `${symbol} — ${name}` : symbol);
    setShowSellSymbolDropdown(false);
  };

  const resetModal = () => {
    setShowAddModal(false);
    setAddError('');
    setSymbolQuery('');
    setSymbolResults([]);
    setShowSymbolDropdown(false);
    setNewStock({ symbol: '', quantity: '', purchasePrice: '' });
  };

  const resetSellModal = () => {
    setShowSellModal(false);
    setSellError('');
    setSellSymbolQuery('');
    setSellSymbolResults([]);
    setShowSellSymbolDropdown(false);
    setSellStock({ symbol: '', quantity: '' });
  };

  const fetchHoldings = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/portfolio/');
      setHoldings(data);
    } catch (err) {
      console.error('Failed to fetch holdings:', err);
      setError('Failed to load portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  useEffect(() => {
    if (!addSuccess) return;
    const timer = setTimeout(() => setAddSuccess(''), 2200);
    return () => clearTimeout(timer);
  }, [addSuccess]);

  const calculateMetrics = (holding) => {
    const totalInvested = holding.quantity * holding.purchasePrice;
    const currentValue = holding.quantity * holding.currentPrice;
    const totalProfit = currentValue - totalInvested;
    const totalProfitPercent = (totalProfit / totalInvested) * 100;
    const dailyProfit = holding.quantity * holding.dailyChange;

    return {
      totalInvested: totalInvested.toFixed(2),
      currentValue: currentValue.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      totalProfitPercent: totalProfitPercent.toFixed(2),
      dailyProfit: dailyProfit.toFixed(2),
    };
  };

  const totalMetrics = holdings.reduce((acc, holding) => {
    const metrics = calculateMetrics(holding);
    return {
      totalInvested: acc.totalInvested + parseFloat(metrics.totalInvested),
      currentValue: acc.currentValue + parseFloat(metrics.currentValue),
    };
  }, { totalInvested: 0, currentValue: 0 });

  const portfolioProfit = totalMetrics.currentValue - totalMetrics.totalInvested;
  const portfolioProfitPercent = (portfolioProfit / totalMetrics.totalInvested) * 100;

  const handleRemoveHolding = async (id) => {
    try {
      await api.delete(`/portfolio/${id}`);
      setHoldings(holdings.filter(h => h.id !== id));
    } catch (err) {
      console.error('Failed to remove holding:', err);
    }
  };

  const handleAddStock = async () => {
    if (!newStock.symbol || !newStock.quantity || !newStock.purchasePrice) return;
    setAddLoading(true);
    setAddError('');
    try {
      const { data } = await api.post('/portfolio/', {
        symbol: newStock.symbol.toUpperCase(),
        quantity: parseFloat(newStock.quantity),
        purchase_price: parseFloat(newStock.purchasePrice),
      });
      let actionLabel = 'added';
      setHoldings((prevHoldings) => {
        const existingIndex = prevHoldings.findIndex(
          (holding) =>
            holding.id === data.id ||
            holding.symbol?.toUpperCase() === data.symbol?.toUpperCase()
        );

        if (existingIndex === -1) {
          return [...prevHoldings, data];
        }

        actionLabel = 'updated';
        const nextHoldings = [...prevHoldings];
        nextHoldings[existingIndex] = data;
        return nextHoldings;
      });
      resetModal();
      setAddSuccess(`Holding ${actionLabel} successfully`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to add stock.';
      setAddError(typeof msg === 'string' ? msg : 'Failed to add stock.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleSellStock = async () => {
    if (!sellStock.symbol || !sellStock.quantity) return;
    setSellLoading(true);
    setSellError('');
    try {
      const { data } = await api.post(SELL_STOCK_ENDPOINT, {
        symbol: sellStock.symbol.toUpperCase(),
        quantity: parseFloat(sellStock.quantity),
      });

      let actionLabel = 'sold';
      setHoldings((prevHoldings) => {
        const existingIndex = prevHoldings.findIndex(
          (holding) =>
            holding.id === data.id ||
            holding.symbol?.toUpperCase() === data.symbol?.toUpperCase()
        );

        if (Number(data.quantity) <= 0) {
          if (existingIndex === -1) return prevHoldings;
          return prevHoldings.filter((holding) => holding.id !== prevHoldings[existingIndex].id);
        }

        if (existingIndex === -1) {
          return [...prevHoldings, data];
        }

        actionLabel = 'updated';
        const nextHoldings = [...prevHoldings];
        nextHoldings[existingIndex] = data;
        return nextHoldings;
      });

      resetSellModal();
      setAddSuccess(`Holding ${actionLabel} successfully`);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to sell stock.';
      setSellError(typeof msg === 'string' ? msg : 'Failed to sell stock.');
    } finally {
      setSellLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Portfolio</h2>
        <p className="text-slate-600 dark:text-gray-400">Track your investments and monitor daily performance</p>
      </div>

      {/* Not logged in prompt */}
      {!isAuthenticated && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-[#2ebd85] text-center">
          <p className="text-slate-600 dark:text-gray-400 mb-4">Log in to track your portfolio</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#2ebd85] hover:bg-[#26a070] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {addSuccess && (
        <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-3 rounded-xl bg-[#2ebd85] text-white font-semibold shadow-lg">
            {addSuccess}
          </div>
        </div>
      )}

      {isAuthenticated && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" style={{ gridAutoRows: '1fr' }}>
            {/* Summary Cards - stacked in col 1 */}
            <div className="flex flex-col gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-[#2ebd85] hover:shadow-md transition-shadow">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalMetrics.totalInvested.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-[#2ebd85] hover:shadow-md transition-shadow">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Current Value</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalMetrics.currentValue.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-[#2ebd85] hover:shadow-md transition-shadow">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Total Profit/Loss</p>
                <div className="flex items-center space-x-2">
                  {portfolioProfit >= 0 ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-[#2ebd85]" />
                      <p className="text-2xl font-bold text-[#2ebd85]">+${portfolioProfit.toFixed(2)}</p>
                      <p className="text-sm font-semibold text-[#2ebd85]">({isNaN(portfolioProfitPercent) ? '0.00' : portfolioProfitPercent.toFixed(2)}%)</p>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-5 h-5 text-rose-600" />
                      <p className="text-2xl font-bold text-rose-600">-${Math.abs(portfolioProfit).toFixed(2)}</p>
                      <p className="text-sm font-semibold text-rose-600">({portfolioProfitPercent.toFixed(2)}%)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-1 p-0.5">
              <AreaChartPortfolio holdings={holdings} />
            </div>
          </div>

      {/* Holdings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Holdings</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchHoldings}
              disabled={loading}
              className="p-2 text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] transition-colors"
              title="Refresh portfolio"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowSellModal(true)}
              className="bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <TrendingDown className="w-4 h-4" />
              <span>Sell Stock</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#2ebd85] hover:bg-[#26a070] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && holdings.length === 0 && (
          <div className="flex items-center justify-center py-16 text-slate-500 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading portfolio…
          </div>
        )}

        {/* Error state */}
        {error && holdings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-rose-500">
            <p>{error}</p>
            <button onClick={fetchHoldings} className="mt-3 text-sm text-[#2ebd85] hover:underline">Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && holdings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-gray-400">
            <p>No holdings yet. Add your first stock!</p>
          </div>
        )}

        {holdings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-gray-700 border-b border-slate-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300  uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Avg Price</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Total Invested</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Total Return</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Daily</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
              {holdings.map((holding) => {
                const metrics = calculateMetrics(holding);
                const totalProfitNum = parseFloat(metrics.totalProfit);
                const dailyProfitNum = parseFloat(metrics.dailyProfit);

                return (
                  <tr key={holding.id} className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{holding.symbol}</p>
                      <p className="text-xs text-slate-600 dark:text-gray-400">{holding.name}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-900 dark:text-white">{holding.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-900 dark:text-white">${holding.purchasePrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-slate-900 dark:text-white">${holding.currentPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-900 dark:text-white">${metrics.totalInvested}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-slate-900 dark:text-white">${metrics.currentValue}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {totalProfitNum >= 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-[#2ebd85]" />
                            <span className="font-semibold text-[#2ebd85]">
                              +${metrics.totalProfit} ({metrics.totalProfitPercent}%)
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-rose-600" />
                            <span className="font-semibold text-rose-600">
                              -${Math.abs(totalProfitNum).toFixed(2)} ({metrics.totalProfitPercent}%)
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {dailyProfitNum >= 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-[#2ebd85]" />
                            <span className="text-sm font-semibold text-[#2ebd85]">+${metrics.dailyProfit}</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-rose-600" />
                            <span className="text-sm font-semibold text-rose-600">-${Math.abs(dailyProfitNum).toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemoveHolding(holding.id)}
                        className="p-1 rounded transition-colors text-slate-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Stock to Portfolio</h3>
              <button
                onClick={resetModal}
                className="p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
            </div>

            {addError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
                {addError}
              </div>
            )}

            <div className="space-y-4">
              <div ref={symbolRef} className="relative">
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Stock Symbol</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search for a stock…"
                    value={symbolQuery}
                    onChange={(e) => {
                      setSymbolQuery(e.target.value);
                      setNewStock((prev) => ({ ...prev, symbol: '' }));
                    }}
                    onFocus={() => { if (symbolResults.length) setShowSymbolDropdown(true); }}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85] text-sm"
                    autoComplete="off"
                  />
                </div>

                {/* Autocomplete dropdown */}
                {showSymbolDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#2ebd85] bg-white dark:bg-gray-800 shadow-lg z-50">
                    {symbolSearchLoading ? (
                      <div className="flex items-center justify-center py-3 text-sm text-slate-500 dark:text-gray-400">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Searching…
                      </div>
                    ) : symbolResults.length === 0 ? (
                      <div className="py-3 px-4 text-center text-sm text-rose-500">No results found</div>
                    ) : (
                      symbolResults.map((item) => (
                        <button
                          key={item.symbol}
                          type="button"
                          onClick={() => selectSymbol(item.symbol, item.name)}
                          className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#edfaf4] dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{item.symbol}</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400 truncate">{item.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Selected symbol badge */}
                {newStock.symbol && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edfaf4] dark:bg-[#114832]/30 border border-[#2ebd85] text-sm font-semibold text-[#2ebd85]">
                    {newStock.symbol}
                    <button type="button" onClick={() => { setNewStock((prev) => ({ ...prev, symbol: '' })); setSymbolQuery(''); }} className="hover:text-rose-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="Number of shares"
                  value={newStock.quantity}
                  onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Purchase Price</label>
                <input
                  type="number"
                  placeholder="Price per share"
                  value={newStock.purchasePrice}
                  onChange={(e) => setNewStock({ ...newStock, purchasePrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetModal}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStock}
                  disabled={addLoading}
                  className="flex-1 px-4 py-2 bg-[#2ebd85] hover:bg-[#26a070] disabled:opacity-60 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {addLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sell Stock Modal */}
      {showSellModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sell Stock from Portfolio</h3>
              <button
                onClick={resetSellModal}
                className="p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
            </div>

            {sellError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
                {sellError}
              </div>
            )}

            <div className="space-y-4">
              <div ref={sellSymbolRef} className="relative">
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Stock Symbol</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search for a stock…"
                    value={sellSymbolQuery}
                    onChange={(e) => {
                      setSellSymbolQuery(e.target.value);
                      setSellStock((prev) => ({ ...prev, symbol: '' }));
                    }}
                    onFocus={() => { if (sellSymbolResults.length) setShowSellSymbolDropdown(true); }}
                    className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85] text-sm"
                    autoComplete="off"
                  />
                </div>

                {showSellSymbolDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[#2ebd85] bg-white dark:bg-gray-800 shadow-lg z-50">
                    {sellSymbolSearchLoading ? (
                      <div className="flex items-center justify-center py-3 text-sm text-slate-500 dark:text-gray-400">
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Searching…
                      </div>
                    ) : sellSymbolResults.length === 0 ? (
                      <div className="py-3 px-4 text-center text-sm text-rose-500">No results found</div>
                    ) : (
                      sellSymbolResults.map((item) => (
                        <button
                          key={item.symbol}
                          type="button"
                          onClick={() => selectSellSymbol(item.symbol, item.name)}
                          className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[#edfaf4] dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{item.symbol}</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400 truncate">{item.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {sellStock.symbol && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edfaf4] dark:bg-[#114832]/30 border border-[#2ebd85] text-sm font-semibold text-[#2ebd85]">
                    {sellStock.symbol}
                    <button type="button" onClick={() => { setSellStock((prev) => ({ ...prev, symbol: '' })); setSellSymbolQuery(''); }} className="hover:text-rose-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Quantity</label>
                <input
                  type="number"
                  placeholder="Number of shares"
                  value={sellStock.quantity}
                  onChange={(e) => setSellStock({ ...sellStock, quantity: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                  min="1"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetSellModal}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSellStock}
                  disabled={sellLoading}
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {sellLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Sell'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}