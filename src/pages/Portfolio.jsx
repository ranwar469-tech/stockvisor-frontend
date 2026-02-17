export default function Portfolio() {
  const holdings = [
    { symbol: 'AAPL', shares: 50, avgCost: 150.25, current: 178.50, gain: 28.25 },
    { symbol: 'MSFT', shares: 30, avgCost: 330.00, current: 380.25, gain: 50.25 },
    { symbol: 'GOOGL', shares: 20, avgCost: 120.00, current: 142.80, gain: 22.80 },
    { symbol: 'TSLA', shares: 15, avgCost: 200.00, current: 245.30, gain: 45.30 },
    { symbol: 'AMZN', shares: 10, avgCost: 140.00, current: 165.50, gain: 25.50 },
  ];

  const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.current), 0);
  const totalGain = holdings.reduce((sum, h) => sum + (h.shares * h.gain), 0);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-blue-400">My Portfolio</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Track and manage your investments</p>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border border-blue-600 shadow-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border border-blue-600 shadow-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">Total Gain/Loss</p>
            <p className={`text-3xl font-bold mt-2 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGain >= 0 ? '+' : ''} ${totalGain.toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border border-blue-600 shadow-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">Return on Investment</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">+18.5%</p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-b border-blue-600">
            <h3 className="text-2xl font-bold text-blue-400">Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-600 bg-gray-200 dark:bg-slate-700">
                  <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-semibold">Symbol</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">Shares</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">Avg Cost</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">Current Price</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">Gain/Loss</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4 font-bold text-blue-400">{holding.symbol}</td>
                    <td className="text-right p-4 text-slate-700 dark:text-slate-300">{holding.shares}</td>
                    <td className="text-right p-4 text-slate-700 dark:text-slate-300">${holding.avgCost.toFixed(2)}</td>
                    <td className="text-right p-4 font-semibold text-slate-900 dark:text-white">${holding.current.toFixed(2)}</td>
                    <td className={`text-right p-4 font-semibold ${holding.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.gain >= 0 ? '+' : ''} ${holding.gain.toFixed(2)}
                    </td>
                    <td className="text-right p-4 font-semibold text-slate-900 dark:text-white">${(holding.shares * holding.current).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}