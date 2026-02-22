import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'Positive':
        return {
          icon: <TrendingUp className="w-3 h-3" />,
          classes: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
        };
      case 'Negative':
        return {
          icon: <TrendingDown className="w-3 h-3" />,
          classes: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30',
        };
      default:
        return {
          icon: <Minus className="w-3 h-3" />,
          classes: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30',
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Market News</h2>
        <p className="text-slate-600 dark:text-gray-400">Stay updated with the latest market movements</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-blue-600 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Latest Articles</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-gray-700">
          {newsArticles.map((article) => {
            const badge = getImpactBadge(article.impact);
            return (
              <div key={article.id} className="px-6 py-5 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{article.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-600 rounded text-xs font-semibold text-white">
                        {article.category}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${badge.classes}`}>
                        {badge.icon}
                        {article.impact}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 transition-colors">
                      {article.headline}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-gray-400 text-sm font-medium">{article.source}</span>
                      <span className="text-slate-600 dark:text-gray-400 text-xs">{article.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}