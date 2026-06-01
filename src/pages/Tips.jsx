import { useState } from 'react';
import TipsComponent from '../components/TipsComponent';

export default function Tips() {
  const [selectedTip, setSelectedTip] = useState(null);

  const influencerPlaceholders = [
    {
      id: 1,
      name: 'Chamath Palihapitiya',
      description: 'Canadian-American venture capitalist and Virgin Galactic Chairman Chamath Palihapitiya has 1.4 million Twitter followers and regularly shares his thoughts about what’s happening on the markets.',
      handle: 'https://x.com/chamath',
      thumbnailLink: 'https://pbs.twimg.com/profile_images/1883600182165848064/-9LbG3md_400x400.jpg',
    },
    {
      id: 2,
      name: 'Cathie Wood',
      description: 'Cathie Wood of ARK Invest is quickly developing a following as one of the most influential “stock pickers” out there, earning comparisons to Warren Buffet. Wood praised companies like Musk’s Tesla for buying Bitcoin as a hedge and is a longtime fan of the electric-car company.',
      handle: 'https://x.com/CathieDWood',
      thumbnailLink: 'https://pbs.twimg.com/profile_images/1782845672829423617/xuyhQIY5_400x400.jpg',
    },
    {
      id: 3,
      name: 'Dave Portnoy',
      description: 'Since the start of the pandemic, Barstool Sports founder Dave Portnoy has shifted from talking about sports to his 2.4 million Twitter followers to discussing the stock market. His Twitter feed these days tends to focus on his trading, which he often streams live to his millions of fans. Portnoy has pushed everything from sports gambling businesses to cannabis stocks to his legions of followers.',
      handle: 'https://x.com/stoolpresidente',
      thumbnailLink: 'https://pbs.twimg.com/profile_images/2031028919751573504/m_4Tu1Hv_400x400.jpg',
    },
    {
      id: 4,
      name: 'Brian Feroldi',
      description: 'Focuses heavily on educational content, breaking down financial statements and business models. His career mission statement is “to demystify the stock market.” He loves to help other people do better with their investments. He has written over 3,000 articles on stocks, investing, and personal finance for the Motley Fool.',
      handle: 'https://x.com/BrianFeroldi',
      thumbnailLink: 'https://pbs.twimg.com/profile_images/1758167079843172352/I87PB0PH_400x400.jpg',
    },
    {
      id: 5,
      name: 'Morgan Housel',
      description: 'Author and researcher known for his psychological approach to investing. Morgan Housel is a partner at the Collaborative Fund. He is a two-time winner of the Best in Business Award from the Society of American Business Editors and Writers, winner of the New York Times Sidney Award, and a two-time finalist for the Gerald Loeb Award for Distinguished Business and Financial Journalism.',
      handle: 'https://x.com/morganhousel?lang=en',
      thumbnailLink: 'https://pbs.twimg.com/profile_images/1801821925414735875/O1lzFjAw_400x400.jpg',
    },
  ];

  const tips = [
    {
      id: 1,
      title: 'Dollar-Cost Averaging',
      description: 'Invest a fixed amount regularly regardless of price. This reduces the impact of market volatility and removes emotion from investing.',
      difficulty: 'Beginner',
      icon: '💡',
      overview:
        'Dollar-cost averaging (DCA) is a disciplined investment strategy where you invest a fixed sum of money at regular intervals - weekly, monthly, or quarterly - regardless of the market price. Over time, this approach means you buy more shares when prices are low and fewer when prices are high, lowering your average cost per share.',
      keyPoints: [
        'Eliminates the need to time the market perfectly.',
        'Reduces the emotional impact of market swings on your decisions.',
        'Works well with index funds, ETFs, and blue-chip stocks.',
        'Suitable for long-term investors building wealth gradually.',
      ],
      steps: [
        { title: 'Choose your investment', detail: 'Select a stock, ETF, or index fund you believe in long-term.' },
        { title: 'Set a fixed amount', detail: 'Decide on a fixed dollar amount you can consistently invest each period.' },
        { title: 'Pick a regular interval', detail: 'Monthly is most common; align it with your paycheck for automation.' },
        { title: 'Automate contributions', detail: 'Use your broker\'s recurring investment feature to remove manual effort.' },
        { title: 'Stay the course', detail: 'Avoid withdrawing during dips, the strategy works best over the long run.' },
      ],
      example:
        'You invest $200 every month into an S&P 500 ETF. In January the price is $100 (you buy 2 shares). In February it drops to $80 (you buy 2.5 shares). In March it rises to $110 (you buy 1.8 shares). Your average cost is lower than if you had bought all shares at the January price.',
      pros: [
        'Simple and easy to automate.',
        'Reduces impact of short-term volatility.',
        'Instills consistent saving habits.',
        'No market timing required.',
      ],
      cons: [
        'In a consistently rising market, lump-sum investing may outperform DCA.',
        'Transaction fees can add up with very small frequent investments.',
        'Does not protect against a fundamentally declining asset.',
      ],
      bottomNote:
        'DCA is most powerful when applied to diversified, fundamentally strong assets over a multi-year time period. It is not a substitute for researching what you invest in.',
    },
    {
      id: 2,
      title: 'Diversification is Key',
      description: 'Make investments across different sectors and asset classes to reduce risk.',
      difficulty: 'Beginner',
      icon: '🎯',
      overview:
        'Diversification is the practice of spreading your investments across various assets, sectors, geographies, and asset classes so that the poor performance of one holding does not disproportionately damage your overall portfolio.',
      keyPoints: [
        'Combine stocks, bonds, real estate, and cash equivalents.',
        'Invest across multiple sectors: tech, healthcare, financials, energy, etc.',
        'Consider geographic diversification with international exposure.',
        'Correlation matters - assets that move in opposite directions provide the best hedge.',
      ],
      steps: [
        { title: 'Audit your current holdings', detail: 'List all your investments and group them by sector and asset class.' },
        { title: 'Identify concentration risk', detail: 'If one sector exceeds 30% of your portfolio, consider rebalancing.' },
        { title: 'Add uncorrelated assets', detail: 'Pair growth stocks with defensive assets like bonds or dividend stocks.' },
        { title: 'Use ETFs for instant diversification', detail: 'A single broad-market ETF can give exposure to hundreds of companies.' },
        { title: 'Rebalance periodically', detail: 'Review and rebalance semi-annually to maintain your target allocation.' },
      ],
      example:
        'Rather than investing $10,000 entirely in tech stocks, you allocate $3,000 to tech, $2,500 to healthcare, $2,000 to financials, $1,500 to an international ETF, and $1,000 to bonds. A tech crash hurts only part of your portfolio.',
      pros: [
        'Reduces portfolio volatility significantly.',
        'Limits catastrophic loss from a single bad investment.',
        'Provides exposure to multiple growth opportunities.',
      ],
      cons: [
        'Over-diversification can dilute returns.',
        'More holdings require more research to manage.',
        'Not all diversification protects against systemic market crashes.',
      ],
      bottomNote:
        'True diversification is about holding assets that don\'t move together, simply owning many stocks in the same sector is not diversification.',
    },
    {
      id: 3,
      title: 'Understanding P/E Ratios',
      description: 'The Price-to-Earnings ratio helps evaluate if a stock is overvalued or undervalued compared to its earnings.',
      difficulty: 'Intermediate',
      icon: '📊',
      overview:
        'The Price-to-Earnings (P/E) ratio is one of the most widely used valuation metrics in investing. It compares the current share price to the company\'s earnings per share (EPS), giving you a sense of how much investors are willing to pay for each dollar of earnings.',
      keyPoints: [
        'P/E = Stock Price ÷ Earnings Per Share (EPS).',
        'A high P/E may indicate the stock is overvalued or has high growth expectations.',
        'A low P/E may indicate undervaluation or declining prospects.',
        'Always compare P/E within the same industry because sector norms differ widely.',
        'Forward P/E uses projected earnings, trailing P/E uses past 12 months.',
      ],
      steps: [
        { title: 'Find the EPS', detail: 'Check the company\'s latest earnings report or financial data site for EPS.' },
        { title: 'Divide price by EPS', detail: 'P/E = Current Share Price ÷ EPS. Most financial sites show this automatically.' },
        { title: 'Compare to sector average', detail: 'Tech companies often have P/Es of 25–40+; utilities may be 10–15.' },
        { title: 'Look at historical P/E', detail: 'Is the stock trading above or below its 5-year average P/E?' },
        { title: 'Combine with other metrics', detail: 'Use P/E alongside PEG ratio, P/B, and free cash flow for a fuller picture.' },
      ],
      example:
        'Company A trades at $150 with EPS of $10 → P/E of 15. Company B in the same sector trades at $200 with EPS of $5 → P/E of 40. Company A appears cheaper on a valuation basis, though you should investigate why B commands a premium.',
      pros: [
        'Quick and easy to calculate.',
        'Widely understood benchmark for valuation.',
        'Useful for relative comparisons within a sector.',
      ],
      cons: [
        'Earnings can be manipulated through accounting techniques.',
        'Doesn\'t account for growth rate, a high P/E may be justified for fast growers.',
        'Meaningless for companies with negative earnings.',
      ],
      bottomNote:
        'Never rely solely on P/E. A low P/E can be a "value trap" if the company\'s underlying business is deteriorating.',
    },
    {
      id: 4,
      title: 'Technical Analysis Basics',
      description: 'Learn to read charts and identify support/resistance levels to make better entry and exit decisions.',
      difficulty: 'Intermediate',
      icon: '📈',
      overview:
        'Technical analysis is the study of historical price and volume data to forecast future price movements. Unlike fundamental analysis, it focuses entirely on the chart rather than the company\'s financials, making it useful for timing entries and exits.',
      keyPoints: [
        'Support: a price level where buying interest historically prevents further declines.',
        'Resistance: a price level where selling pressure historically prevents further rises.',
        'Moving averages (50-day, 200-day) smooth out noise and signal trend direction.',
        'Volume confirms price moves, a breakout on high volume is more reliable.',
        'Common patterns: head & shoulders, double top/bottom, flags, and triangles.',
      ],
      steps: [
        { title: 'Choose a charting tool', detail: 'StockVisor, TradingView, Yahoo Finance, or your broker\'s platform all provide charts.' },
        { title: 'Identify the trend', detail: 'Is the stock making higher highs and higher lows (uptrend) or lower lows (downtrend)?' },
        { title: 'Draw support & resistance', detail: 'Mark the horizontal levels where price has repeatedly bounced or reversed.' },
        { title: 'Add a moving average', detail: 'The 50-day and 200-day MAs are popular trend filters.' },
        { title: 'Confirm with volume', detail: 'A breakout above resistance on significantly above-average volume is a stronger signal.' },
      ],
      example:
        'A stock repeatedly bounces at $50 (support). It rallies to $65 but struggles to break through (resistance). When it finally closes above $65 on 3× average volume, many traders see this as a buy signal targeting $80.',
      pros: [
        'Useful for timing entries and exits regardless of company fundamentals.',
        'Can be applied to any liquid market or timeframe.',
        'Widely used, so patterns can become self-fulfilling.',
      ],
      cons: [
        'Different analysts can draw different conclusions from the same chart.',
        'Does not reflect a company\'s intrinsic value.',
        'Major news events can override any technical pattern instantly.',
      ],
      bottomNote:
        'Technical analysis is a tool only so use it with fundamental analysis and always use stop-loss orders to limit downside.',
    },
    {
      id: 5,
      title: 'Risk Management Strategies',
      description: 'Use stop-loss orders and position sizing to protect your capital and manage downside risk effectively.',
      difficulty: 'Advanced',
      icon: '🛡️',
      overview:
        'Successful long-term investors and traders prioritise capital preservation above everything else. Risk management is the systematic process of identifying, measuring, and controlling the potential losses in your portfolio before they happen.',
      keyPoints: [
        'Never risk more than 1–2% of your total portfolio on a single trade.',
        'Stop-loss orders automatically close a position when it falls to a set price.',
        'Risk/Reward ratio: aim for at least 1:2 (risk $1 to potentially gain $2).',
        'Position sizing determines how many shares to buy based on your risk tolerance.',
        'Correlation risk: multiple positions in the same sector compound risk.',
      ],
      steps: [
        { title: 'Define your maximum loss per trade', detail: 'E.g. you will never lose more than 1.5% of your $10,000 portfolio ($150) on a single trade.' },
        { title: 'Find your stop-loss level', detail: 'Place the stop just below a key support level or a fixed percentage (e.g. 5%) below entry.' },
        { title: 'Calculate your position size', detail: 'Position size = Max Loss ÷ (Entry Price − Stop Price). E.g. $150 ÷ $3 = 50 shares.' },
        { title: 'Check your Risk/Reward', detail: 'Only take the trade if your target profit is at least 2× your maximum loss.' },
        { title: 'Trail your stop as gains accumulate', detail: 'Move your stop up to lock in profits once the trade moves in your favour.' },
      ],
      example:
        'You buy 50 shares at $100 with a stop at $97 (risk = $3/share × 50 = $150). Your target is $106 (reward = $6/share × 50 = $300). Risk/Reward = 1:2. You risk $150 to potentially make $300.',
      pros: [
        'Prevents a single bad trade from wiping out weeks of gains.',
        'Removes emotion from exit decisions.',
        'Works for any account size.',
      ],
      cons: [
        'Stop-losses can be triggered by brief intraday spikes ("stop hunts").',
        'Strict position sizing may limit gains on high-conviction trades.',
        'Requires discipline to follow consistently.',
      ],
      bottomNote:
        'The goal of risk management is to stay in the game long enough to let your edge play out. A trader who never blows up their account has a massive advantage over time.',
    },
    {
      id: 6,
      title: 'Fundamental Analysis Deep Dive',
      description: 'Analyze company financials, earnings reports, and industry trends to identify undervalued opportunities.',
      difficulty: 'Advanced',
      icon: '🔍',
      overview:
        'Fundamental analysis is the process of evaluating a company\'s intrinsic value by examining its financial statements, business model, competitive advantages, management quality, and macroeconomic environment. The goal is to determine whether the current market price is above or below what the company is actually worth.',
      keyPoints: [
        'Revenue and earnings growth are the primary drivers of long-term stock price.',
        'Free cash flow (FCF) is usually more reliable than reported earnings.',
        'Debt levels: high debt amplifies risk, compare debt-to-equity across peers.',
        'Return on Equity (ROE) measures how efficiently management uses shareholders\' capital.',
        'Economic moat: sustainable competitive advantages that protect profitability.',
      ],
      steps: [
        { title: 'Read the annual report (10-K)', detail: 'Study revenue trends, margins, debt levels, and management discussion sections.' },
        { title: 'Analyse the income statement', detail: 'Track revenue, gross profit, operating income, and net income over 5 years.' },
        { title: 'Review the balance sheet', detail: 'Check total assets vs. liabilities; look for rising goodwill or cash depletion.' },
        { title: 'Study the cash flow statement', detail: 'Make sure operating cash flow consistently exceeds net income.' },
        { title: 'Estimate intrinsic value', detail: 'Use a DCF (discounted cash flow) model or compare EV/EBITDA multiples to peers.' },
        { title: 'Assess qualitative factors', detail: 'Evaluate the competitive landscape, brand strength, regulatory risk, and management track record.' },
      ],
      example:
        'Company X has grown revenue 20% annually for 5 years, generates $500M in FCF, has minimal debt, and trades at 18× FCF, below the sector average of 25×. A fundamental analyst might conclude it is undervalued relative to its growth rate.',
      pros: [
        'Identifies genuinely undervalued companies for long-term holding.',
        'Reduces risk of owning structurally weak businesses.',
        'Builds deep understanding of business quality.',
      ],
      cons: [
        'Requires hours of research per company.',
        'A stock can remain undervalued for years before the market agrees.',
        'Requires accounting knowledge to detect earnings manipulation.',
      ],
      bottomNote:
        'Even the best fundamental analysis does not guarantee short-term price appreciation. Patience is essential — Benjamin Graham famously said the market is a voting machine in the short run but a weighing machine in the long run.',
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
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Trading Tutorials &amp; Learning</h2>
        <span className="text-slate-600 dark:text-slate-400 mb-6 inline-block border-[#2ebd85] border-b-2">Master the essentials of stock trading and investing with these essential tutorials designed for new traders</span>
      </div>

      {selectedTip ? (
        <TipsComponent tip={selectedTip} onClose={() => setSelectedTip(null)} />
      ) : (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">All Tutorials</h3>
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
                    <span
                      onClick={() => setSelectedTip(tip)}
                      className="text-[#2ebd85] text-sm font-semibold hover:text-[#35cc8e] cursor-pointer"
                    >
                      Learn More →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recommended Stock Market Influencers</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-gray-700/60 border-b border-slate-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider"></th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-black dark:text-yellow-300 uppercase tracking-wider">Handle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                  {influencerPlaceholders.map((influencer) => (
                    <tr key={influencer.id} className="hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-11 w-11 min-h-11 min-w-11 rounded-full overflow-hidden border border-[#2ebd85] bg-[#edfaf4] dark:bg-[#114832]/30">
                          <img
                            src={influencer.thumbnailLink}
                            alt={`${influencer.name} profile`}
                            className="block h-full w-full object-cover object-center"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&background=edfaf4&color=2ebd85&size=128`;
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{influencer.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">{influencer.description}</td>
                      <td className="px-6 py-4 text-sm text-[#2ebd85] font-semibold">
                        <a
                          href={influencer.handle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {influencer.handle}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}