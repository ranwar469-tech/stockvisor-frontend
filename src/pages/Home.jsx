export default function Home() {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.45 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.25, change: -1.20 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: 3.15 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, change: 5.60 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-blue-400">Market Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Track your favorite stocks in real-time</p>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border border-blue-600 shadow-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">Portfolio Value</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">$45,230.50</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border border-blue-600 shadow-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">Today's Gain/Loss</p>
            <p className="text-3xl font-bold text-green-400 mt-2">+$1,245.32</p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-lg border border-blue-600 shadow-lg">
            <p className="text-slate-700 dark:text-slate-300 text-sm">Total Return</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">+12.5%</p>
          </div>
        </div>

        {/* Stock List */}
        <div className="bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-b border-blue-600">
            <h3 className="text-2xl font-bold text-blue-400">Watchlist</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue-600 bg-gray-200 dark:bg-slate-700">
                  <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-semibold">Symbol</th>
                  <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-semibold">Company</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">Price</th>
                  <th className="text-right p-4 text-slate-700 dark:text-slate-300 font-semibold">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol} className="border-b border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4 font-bold text-blue-400">{stock.symbol}</td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">{stock.name}</td>
                    <td className="text-right p-4 font-semibold text-slate-900 dark:text-white">${stock.price.toFixed(2)}</td>
                    <td className={`text-right p-4 font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </td>
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
