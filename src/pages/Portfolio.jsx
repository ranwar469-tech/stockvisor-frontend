import { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react';

export default function Portfolio() {
  const [holdings, setHoldings] = useState([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 50,
      purchasePrice: 150.00,
      currentPrice: 178.45,
      dailyChange: 2.34,
      dailyChangePercent: 1.33,
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      quantity: 30,
      purchasePrice: 320.00,
      currentPrice: 378.91,
      dailyChange: 5.67,
      dailyChangePercent: 1.52,
    },
    {
      id: '3',
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      quantity: 15,
      purchasePrice: 650.00,
      currentPrice: 722.48,
      dailyChange: 12.30,
      dailyChangePercent: 1.73,
    },
    {
      id: '4',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 20,
      purchasePrice: 280.00,
      currentPrice: 242.84,
      dailyChange: -4.15,
      dailyChangePercent: -1.68,
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', quantity: '', purchasePrice: '' });

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

  const handleRemoveHolding = (id) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };

  const handleAddStock = () => {
    if (!newStock.symbol || !newStock.quantity || !newStock.purchasePrice) return;
    const entry = {
      id: Date.now().toString(),
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.symbol.toUpperCase(),
      quantity: parseFloat(newStock.quantity),
      purchasePrice: parseFloat(newStock.purchasePrice),
      currentPrice: parseFloat(newStock.purchasePrice),
      dailyChange: 0,
      dailyChangePercent: 0,
    };
    setHoldings([...holdings, entry]);
    setNewStock({ symbol: '', quantity: '', purchasePrice: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Portfolio</h2>
        <p className="text-slate-600 dark:text-gray-400">Track your investments and monitor daily performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm font-semibold text-[#2ebd85]">({portfolioProfitPercent.toFixed(2)}%)</p>
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

      {/* Holdings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Holdings</h3>
            <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#2ebd85] hover:bg-[#26a070] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock</span>
          </button>
        </div>

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
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Stock to Portfolio</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Stock Symbol</label>
                <input
                  type="text"
                  placeholder="e.g., GOOGL"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                  maxLength={5}
                />
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
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStock}
                  className="flex-1 px-4 py-2 bg-[#2ebd85] hover:bg-[#26a070] text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}