export default function News() {
  const newsArticles = [
    {
      id: 1,
      headline: 'Fed Signals Steady Rate Path Amid Economic Growth',
      source: 'MarketWatch',
      date: '2 hours ago',
      category: 'Market News',
      impact: 'Positive',
      image: '📊'
    },
    {
      id: 2,
      headline: 'Tech Giants Report Strong Earnings, Market Rally Continues',
      source: 'Bloomberg',
      date: '4 hours ago',
      category: 'Earnings',
      impact: 'Positive',
      image: '📈'
    },
    {
      id: 3,
      headline: 'Oil Prices Surge on Supply Concerns',
      source: 'Reuters',
      date: '6 hours ago',
      category: 'Commodities',
      impact: 'Mixed',
      image: '⛽'
    },
    {
      id: 4,
      headline: 'Cryptocurrency Market Shows Signs of Stabilization',
      source: 'CoinDesk',
      date: '8 hours ago',
      category: 'Crypto',
      impact: 'Positive',
      image: '₿'
    },
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Positive':
        return 'text-green-400';
      case 'Negative':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-blue-400">Market News</h2>
        <p className="text-slate-400 mb-8">Stay updated with the latest market movements</p>

        <div className="space-y-6">
          {newsArticles.map((article) => (
            <div key={article.id} className="bg-slate-800 rounded-lg border border-blue-600 shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{article.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold text-white">
                      {article.category}
                    </span>
                    <span className={`px-3 py-1 bg-slate-700 rounded-full text-xs font-semibold ${getImpactColor(article.impact)}`}>
                      {article.impact}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 hover:text-blue-400 transition-colors">
                    {article.headline}
                  </h3>
                  <div className="flex items-center justify-between text-slate-400 text-sm">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}