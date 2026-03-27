import { useEffect, useMemo, useState } from 'react';
import { BookOpen, X, PlayCircle } from 'lucide-react';

export const DEFAULT_TUTORIALS = {
  analystChart: {
    videoUrl: 'https://drive.google.com/file/d/18P1prtAJymIvuhvHZy_LDf-EH_-_TCZF/view?usp=drive_link',
    badge: 'Dashboard guide',
    title: 'Expert Analysis',
    summary:
      'This chart shows analyst recommendation counts for the current month so you can see whether expert sentiment is strengthening, weakening, or staying flat.',
    steps: [
      'Search for a stock symbol in the searchbar.',
      'Read the bars from Strong Buy to Strong Sell to compare recommendations.',
    ],
    tip: 'A high Buy count is a useful recommendation, but it should still be compared with price action, earnings, and market conditions.',
  },
  stockHeatmap: {
    videoUrl: 'https://drive.google.com/file/d/1WRcZbmycH3cjZ4PtyKT8eIdf_Uv-hnn8/view?usp=drive_link',
    badge: 'Dashboard guide',
    title: 'Market Heatmap',
    summary:
      'The heatmap groups stocks by sector and colors them according to changes in the current price vs previous day closing price. Its good to view market conditions with a quick glance.',
    steps: [
      'Look at the color scale first: red shows losses, gray is neutral, and green shows gains. The change percentage indicates how much the sector/stock price changed vs the previous day closing price',
      'Focus on larger tiles when you want to identify the highest market-cap names driving sector movement.',
      'Click on the larger tiles to see the performance of top stocks in each sector. Right click to view the larger tiles again.',
      'Compare clusters of tiles by sector to find concentrated strength, weakness, or rotation.',
    ],
    tip: 'A sector full of green tiles can indicate short-term momentum, but it does not guarantee the move will continue.',
  },
  stocksTable: {
    videoUrl: 'https://drive.google.com/file/d/1Xyi1G-finLinNDcJ4Q9ndaETeOSFKDlH/view?usp=drive_link',
    badge: 'Dashboard guide',
    title: 'Popular Stocks Table',
    summary:
      'This table is your quick watchlist for widely followed stocks and saved favorites, with search and refresh controls for fast monitoring.',
    steps: [
      'Switch between Popular Stocks and Favorites depending on whether you want a broad view or your saved list.',
      'Use the search box to find a stock and add it into your favorites list.',
      'Refresh the table when you want updated quotes, daily change, and volume.',
    ],
    tip: 'Favorites work best when you keep them limited to the stocks you genuinely monitor every day.',
  },
  areaChartPortfolio: {
    videoUrl: 'https://drive.google.com/file/d/1vSeuzO13JQbmejrv-ksdlUseKczTjmE_/view?usp=drive_link',
    badge: 'Portfolio guide',
    title: 'Portfolio Cost vs Market Value',
    summary:
      'This chart compares how much capital you have invested against what your portfolio is currently worth, so you can see whether your positions are compounding into profit or slipping into drawdown over time.',
    steps: [
      'Use the Total Invested line as the baseline showing how much capital you have added into the portfolio.',
      'Compare it with the Current Value line to see whether the overall portfolio is ahead or behind your cost basis.',
      'Look at the filled gap between the two lines: green indicates profit, while red indicates drawdown.',
      'Read the x-axis as your holding timeline when purchase dates are available, or as position order when dates are missing.',
    ],
    tip: 'This chart is best for judging overall portfolio progress, not the performance of a single stock.',
  },
  portfolioRadarChart: {
    videoUrl: 'https://drive.google.com/file/d/1kcWb_M5ikEg3FG_FDkB6JdOglwwYmGuH/view?usp=drive_link',
    badge: 'Portfolio guide',
    title: 'Sector Allocation',
    summary:
      'This radar chart shows how your invested capital is spread across sectors, which makes it easier to spot concentration risk and see whether your portfolio is diversified or heavily tilted toward one theme.',
    steps: [
      'Each axis represents a sector bucket in your portfolio allocation.',
      'The farther the radar shape extends on an axis, the larger the share of invested capital allocated to that sector.',
      'Use the chart to spot overexposure before adding new holdings, especially if one sector dominates the shape.',
      'Any holdings outside the tracked sectors are grouped into Other, so you still see their contribution in the allocation mix.',
    ],
    tip: 'A stretched radar shape usually means your portfolio depends more heavily on a small number of sectors.',
  },
  holdings: {
    videoUrl: 'https://drive.google.com/file/d/1iYxahuuQEG0OhCiPHxJYthyR6pRinrwY/view?usp=drive_link',
    badge: 'Portfolio guide',
    title: 'Holdings Table',
    summary:
      'The Holdings table shows all the stocks in your portfolio with their metrics, profits/losses, and daily performance.',
    steps: [
      'Click Add Stock to buy new shares into your portfolio. You can add to an existing holding or create a new position.',
      'Click Sell Stock to reduce or close a position. The table will automatically update when the sale completes.',
      'Review the columns: Quantity, purchase Avg Price, Current Price, Total Invested, Current Value, Total Return (profit/loss %), and Daily change.',
      'Use the refresh button to reload your holdings from the server if you think prices are stale. Click the X button on the right side of any row to remove a holding from your portfolio.',
    ],
    tip: 'Holdings are ordered by when they were added to your portfolio, so your oldest positions appear first.',
  },
};


export default function TutorialPopup({
  isOpen = false,
  tutorialKey,
  tutorials = {},
  onClose,
}) {
  const [showVideo, setShowVideo] = useState(false);

  const tutorialCatalog = {
    ...DEFAULT_TUTORIALS,
    ...(tutorials && typeof tutorials === 'object' && !Array.isArray(tutorials) ? tutorials : {}),
  };

  const activeTutorial = tutorialCatalog[tutorialKey];

  const previewVideoUrl = useMemo(() => {
    const rawUrl = String(activeTutorial?.videoUrl || '').trim();
    if (!rawUrl) return '';
    if (rawUrl.includes('/preview')) return rawUrl;

    const match = rawUrl.match(/\/file\/d\/([^/]+)/);
    if (match?.[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    return rawUrl;
  }, [activeTutorial?.videoUrl]);

  const handleClose = () => {
    onClose?.();
  };

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !activeTutorial) {
      setShowVideo(false);
      return;
    }
    setShowVideo(false);
  }, [isOpen, tutorialKey, activeTutorial]);

  if (!isOpen) {
    return null;
  }

  if (!activeTutorial) {
    return null;
  }

  const dialogTitleId = `tutorial-popup-${String(tutorialKey || 'default')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')}-title`;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#2ebd85] bg-[#edfaf4] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1f8f66] dark:bg-[#114832]/30 dark:text-[#7de0b8]">
              <BookOpen className="h-3.5 w-3.5" />
              {activeTutorial.badge}
            </div>
            <h3 id={dialogTitleId} className="text-xl font-bold text-slate-900 dark:text-white">
              {activeTutorial.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-gray-300">
              {activeTutorial.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Close tutorial"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {Array.isArray(activeTutorial.steps) && activeTutorial.steps.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">How to use it</h4>
            <ol className="space-y-3">
              {activeTutorial.steps.map((step, index) => (
                <li key={`${tutorialKey || 'tutorial'}-${index}`} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edfaf4] text-xs font-bold text-[#1f8f66] dark:bg-[#114832]/30 dark:text-[#7de0b8]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-600 dark:text-gray-300">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {showVideo && previewVideoUrl && (
          <div className="mt-5">
            <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 dark:border-gray-700" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={previewVideoUrl}
                title={`${activeTutorial.title} tutorial video`}
                allow="autoplay"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}

        {activeTutorial.tip && (
          <div className="mt-5 rounded-xl border border-[#bfead8] bg-[#f6fcf9] p-4 dark:border-[#1b6a4a] dark:bg-[#0f2d21]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#1f8f66] dark:text-[#7de0b8]">
              Tip
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-gray-200">
              {activeTutorial.tip}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowVideo((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2ebd85] transition-colors hover:text-[#26a070] dark:text-[#4cc99b] dark:hover:text-[#7de0b8]"
          >
            <PlayCircle className="h-4 w-4" />
            {showVideo ? 'Hide tutorial' : 'Watch tutorial'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-[#2ebd85] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#26a070]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}