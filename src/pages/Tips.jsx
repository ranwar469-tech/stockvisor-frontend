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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-600';
      case 'Intermediate':
        return 'bg-yellow-600';
      case 'Advanced':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-blue-400">Trading Tips & Learning</h2>
        <p className="text-slate-400 mb-8">Master the essentials of stock trading and investing</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div key={tip.id} className="bg-slate-800 rounded-lg border border-blue-600 shadow-lg p-6 hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer">
              <div className="text-4xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tip.title}</h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {tip.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(tip.difficulty)}`}>
                  {tip.difficulty}
                </span>
                <span className="text-blue-400 text-sm font-semibold hover:text-blue-300">
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