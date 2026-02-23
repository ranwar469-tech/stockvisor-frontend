export default function About() {

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-[#4cc99b]">About StockVisor</h2>
        <div className="space-y-6">
          <div className="bg-[#edfaf4] dark:bg-slate-800 p-6 rounded-lg border border-[#2ebd85] shadow-lg">
            <h3 className="text-2xl font-bold text-[#35cc8e] dark:text-[#80d6b3] mb-3">Our Mission</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              StockVisor is designed to give you real-time insights into the stock market. Our platform provides traders and investors with the tools they need to make informed decisions quickly and confidently.
            </p>
          </div>

          <div className="bg-[#edfaf4] dark:bg-slate-800 p-6 rounded-lg border border-[#2ebd85] shadow-lg">
            <h3 className="text-2xl font-bold text-[#35cc8e] dark:text-[#80d6b3] mb-3">Key Features</h3>
            <ul className="text-slate-700 dark:text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#4cc99b] font-bold">→</span>
                Real-time market data and stock prices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#4cc99b] font-bold">→</span>
                Customizable watchlists and portfolios
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#4cc99b] font-bold">→</span>
                Advanced charting and technical analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#4cc99b] font-bold">→</span>
                Market alerts and notifications
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-[#2ebd85] to-[#26a070] dark:from-[#26a070] dark:to-[#114832] p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-3">Get Started</h3>
            <p className="text-[#edfaf4] mb-4">
              Start tracking your investment portfolio today and stay ahead of market trends.
            </p>
            <button className="bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 text-[#4cc99b] dark:text-[#4cc99b] font-bold py-2 px-6 rounded transition-colors">
              Launch Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
