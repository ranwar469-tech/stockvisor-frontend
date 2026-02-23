export default function Tips() {
  const tips = [
    {
      id: 1,
      title: 'Dollar-Cost Averaging',
      description: 'Invest a fixed amount regularly regardless of price. This reduces the impact of market volatility and removes emotion from investing.',
      difficulty: 'Beginner',
      icon: '💡'
    },
    {
      id: 2,
      title: 'Diversification is Key',
      description: 'Spread investments across different sectors and asset classes to reduce risk. Avoid putting all eggs in one basket.',
      difficulty: 'Beginner',
      icon: '🎯'
    },
    {
      id: 3,
      title: 'Understanding P/E Ratios',
      description: 'The Price-to-Earnings ratio helps evaluate if a stock is overvalued or undervalued compared to its earnings.',
      difficulty: 'Intermediate',
      icon: '📊'
    },
    {
      id: 4,
      title: 'Technical Analysis Basics',
      description: 'Learn to read charts and identify support/resistance levels to make better entry and exit decisions.',
      difficulty: 'Intermediate',
      icon: '📈'
    },
    {
      id: 5,
      title: 'Risk Management Strategies',
      description: 'Use stop-loss orders and position sizing to protect your capital and manage downside risk effectively.',
      difficulty: 'Advanced',
      icon: '🛡️'
    },
    {
      id: 6,
      title: 'Fundamental Analysis Deep Dive',
      description: 'Analyze company financials, earnings reports, and industry trends to identify undervalued opportunities.',
      difficulty: 'Advanced',
      icon: '🔍'
    },
  ];

  const getDifficultyClasses = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-[#edfaf4] dark:bg-[#114832]/20 text-[#2ebd85] border border-[#aae4cc] dark:border-[#1b7350]';
      case 'Intermediate':
        return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 border border-yellow-200 dark:border-yellow-800';
      case 'Advanced':
        return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-50 dark:bg-gray-700 text-slate-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trading Tips & Learning</h2>
        <p className="text-slate-600 dark:text-gray-400">Master the essentials of stock trading and investing</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-slate-200 dark:divide-gray-700 md:divide-y-0">
          {tips.map((tip, index) => (
            <div
              key={tip.id}
              className={`p-6 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                index % 3 !== 2 ? 'md:border-r border-slate-200 dark:border-gray-700' : ''
              } ${
                index < 3 ? 'lg:border-b border-slate-200 dark:border-gray-700' : ''
              }`}
            >
              <div className="text-3xl mb-4">{tip.icon}</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{tip.title}</h3>
              <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {tip.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-gray-700">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyClasses(tip.difficulty)}`}>
                  {tip.difficulty}
                </span>
                <span className="text-[#2ebd85] text-sm font-semibold hover:text-[#35cc8e]">
                  Learn More →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}