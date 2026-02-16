export default function About() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-blue-400">About StockVisor</h2>
        
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-blue-600 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-300 mb-3">Our Mission</h3>
            <p className="text-slate-300 leading-relaxed">
              StockVisor is designed to give you real-time insights into the stock market. Our platform provides traders and investors with the tools they need to make informed decisions quickly and confidently.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-blue-600 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-300 mb-3">Key Features</h3>
            <ul className="text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">→</span>
                Real-time market data and stock prices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">→</span>
                Customizable watchlists and portfolios
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">→</span>
                Advanced charting and technical analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">→</span>
                Market alerts and notifications
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-3">Get Started</h3>
            <p className="text-blue-50 mb-4">
              Start tracking your investment portfolio today and stay ahead of market trends.
            </p>
            <button className="bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold py-2 px-6 rounded transition-colors">
              Launch Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
