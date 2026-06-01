import { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Brain, BarChart2, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import api from '../services/api';
import TutorialPopup from './TutorialPopup';

const MARKET_INDEX_CONFIG = [
  { name: 'S&P 500', symbol: 'SPY' },
  { name: 'NASDAQ', symbol: 'QQQ' },
  { name: 'DOW JONES', symbol: 'DIA' },
  { name: 'VIX', symbol: '^VIX' },
];

const SENTIMENT_SECTOR_CONFIG = [
  { sector: 'Technology', endpoint: 'technology' },
  { sector: 'Energy', endpoint: 'energy' },
  { sector: 'Healthcare', endpoint: 'healthcare' },
  { sector: 'Financial', endpoint: 'financial' },
];

const ALERT_KEYS = ['ai_alert_1', 'ai_alert_2', 'ai_alert_3', 'ai_alert_4'];

const DEFAULT_ALERTS = ALERT_KEYS.map(() => ({
  text: 'Fetching latest alerts...',
  type: 'positive',
}));

const AI_INSIGHTS_TUTORIALS = {
  aiMarketOverview: {
    badge: 'AI insights guide',
    title: 'Market Overview',
    summary:
      'This section displays the current price and daily percentage change for major US market indices including the S&P 500, NASDAQ, Dow Jones, and the VIX volatility index so you can see the overall market direction at a glance before researching individual stocks.',
    steps: [
      'Check the green (gain) or red (loss) percentage chip next to each index to see which benchmarks are leading or lagging for the day.',
      'Compare the direction across indices so when all three equity indices move together, it often signals broad market conviction, while divergence can hint at sector rotation or uncertainty.',
      'Watch the VIX: a rising VIX alongside falling equities typically signals increasing fear and market stress, while a low or falling VIX shows calmer conditions.',
    ],
    tip: 'If the S&P 500 and NASDAQ are mixed but the VIX is spiking sharply, near-term volatility risk is usually elevated regardless of what individual stocks are doing.',
  },
  aiSentimentAnalysis: {
    badge: 'AI insights guide',
    title: 'AI Sentiment Analysis',
    summary:
      'This section shows AI-driven sentiment scores for four key sectors including Technology, Energy, Healthcare, and Financial. An NLP model analyzes recent market data for each sector and classifies the outlook as Bullish, Neutral, or Bearish, with a confidence bar indicating how strongly the model leans toward that call.',
    steps: [
      'Start with the sentiment label: Bullish (green) suggests positive model outlook, Bearish (red) signals caution, and Neutral (yellow) indicates no strong directional signal.',
      'Check the confidence bar length, a higher fill percentage means the model is more certain about its classification, while a shorter bar means the signal is weaker.',
      'Press the refresh button to fetch the latest sentiment from the backend when you want up-to-date readings.',
      'Compare sentiment across sectors to identify where the model sees strength versus where it sees headwinds.',
    ],
    tip: 'Treat sentiment as one input among many. A strong Bullish signal works best when it aligns with positive price momentum and supportive news flow.',
  },
  aiAlerts: {
    badge: 'AI insights guide',
    title: 'AI Alerts',
    summary:
      'This section shows AI-generated market alerts which are short, automated bulletins that show notable developments or patterns across the market. Each alert is color-coded: green for positive signals, yellow for cautionary notes, and red for negative warnings, so you can quickly see what might need your attention.',
    steps: [
      'Scan the alert colors first, green alerts highlight potentially favorable developments, yellow flags areas to watch, and red warns of possible headwinds or risks.',
      'Read the alert text to understand the specific signal or event the AI has identified.',
      'Press the refresh button to get the newest set of generated alerts from the backend.',
      'Always cross-reference alerts with the sentiment section and market overview before acting.',
    ],
    tip: 'Alerts are AI-generated signals, not trade recommendations. Use them as information for your own research rather than standalone reasons to buy or sell.',
  },
};

function TutorialInfoButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-[#2ebd85] hover:text-[#2ebd85] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[#2ebd85] dark:hover:text-[#4cc99b]"
      title={`Open tutorial for ${label}`}
      aria-label={`Open tutorial for ${label}`}
    >
      <Info className="h-3.5 w-3.5" />
    </button>
  );
}

function SentimentBar({ score, sentiment }) {
  const color =
    sentiment === 'Bullish' ? 'bg-[#35cc8e]' :
    sentiment === 'Bearish' ? 'bg-rose-500' :
    'bg-yellow-400';
  return (
    <div className="w-full bg-slate-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${score}%` }} />
    </div>
  );
}

function ChangeChip({ change }) {
  const positive = change >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  const colorClass = positive ? 'text-[#2ebd85]' : 'text-rose-500';
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${colorClass}`}>
      <Icon className="w-3 h-3" />
      {positive ? '+' : ''}{change.toFixed(2)}%
    </span>
  );
}

export default function AIInsightsSidebar({ open, onClose }) {
  const [activeTutorialKey, setActiveTutorialKey] = useState(null);
  const [marketIndices, setMarketIndices] = useState(
    MARKET_INDEX_CONFIG.map((item) => ({ ...item, value: '--', change: 0 }))
  );
  const [sentiments, setSentiments] = useState(
    SENTIMENT_SECTOR_CONFIG.map((item) => ({ ...item, sentiment: 'Neutral', score: 0 }))
  );
  const [sentimentRefreshing, setSentimentRefreshing] = useState(false);
  const [aiAlerts, setAiAlerts] = useState(DEFAULT_ALERTS);
  const [alertsRefreshing, setAlertsRefreshing] = useState(false);

  const inferAlertType = (text) => {
    const normalized = String(text || '').toLowerCase();
    const positiveHints = ['up', 'growth', 'bull', 'rally', 'surge', 'gain', 'strong'];
    const negativeHints = ['down', 'drop', 'decline', 'bear', 'risk', 'weak', 'selloff'];

    if (positiveHints.some((hint) => normalized.includes(hint))) return 'positive';
    if (negativeHints.some((hint) => normalized.includes(hint))) return 'negative';
    return 'warning';
  };

  const extractAlertText = (value) => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && value[0] && typeof value[0] === 'object') {
      return value[0].summary_text || value[0].generated_text || '';
    }
    if (value && typeof value === 'object') {
      return value.summary_text || value.generated_text || '';
    }
    return '';
  };

  const fetchAiAlerts = async () => {
    setAlertsRefreshing(true);
    try {
      const { data } = await api.get('/insights/alerts/');
      const nextAlerts = ALERT_KEYS.map((key) => {
        const text = extractAlertText(data?.[key]).trim();
        return {
          text: text || 'No alert available right now.',
          type: inferAlertType(text),
        };
      });
      setAiAlerts(nextAlerts);
    } catch {
      setAiAlerts(DEFAULT_ALERTS);
    } finally {
      setAlertsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAiAlerts();
  }, []);

  useEffect(() => {
    fetchSectorSentiments();
  },[]);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;

    const fetchMarketOverview = async () => {
      const settled = await Promise.allSettled(
        MARKET_INDEX_CONFIG.map(async (item) => {
          const { data } = await api.get(`/stocks/quote/${encodeURIComponent(item.symbol)}`);
          return {
            ...item,
            value: Number(data.price || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
            change: Number(data.changePercent || 0),
          };
        })
      );

      if (!isMounted) return;

      const next = settled.map((result, index) => {
        if (result.status === 'fulfilled') return result.value;
        return {
          ...MARKET_INDEX_CONFIG[index],
          value: '--',
          change: 0,
        };
      });

      setMarketIndices(next);
    };

    fetchMarketOverview();

    return () => {
      isMounted = false;
    };
  }, [open]);

  const normalizeSentiment = (payload) => {
    const safeRows = Array.isArray(payload)
      ? (Array.isArray(payload[0]) ? payload[0] : payload)
      : [];
    const sorted = [...safeRows].sort((first, second) => Number(second.score || 0) - Number(first.score || 0));
    const top = sorted[0];

    if (!top) {
      return { sentiment: 'Neutral', score: 0 };
    }

    const normalizedLabel = String(top.label || '').toLowerCase();
    const sentimentMap = {
      positive: 'Bullish',
      neutral: 'Neutral',
      negative: 'Bearish',
    };

    return {
      sentiment: sentimentMap[normalizedLabel] || 'Neutral',
      score: Math.round(Number(top.score || 0) * 100),
    };
  };

  const fetchSectorSentiments = async () => {
    setSentimentRefreshing(true);

    const settled = await Promise.allSettled(
      SENTIMENT_SECTOR_CONFIG.map(async (item) => {
        const { data } = await api.get(`/insights/${item.endpoint}`);
        const normalized = normalizeSentiment(data);
        return {
          sector: item.sector,
          endpoint: item.endpoint,
          sentiment: normalized.sentiment,
          score: normalized.score,
        };
      })
    );

    const nextSentiments = settled.map((result, index) => {
      if (result.status === 'fulfilled') return result.value;
      return {
        ...SENTIMENT_SECTOR_CONFIG[index],
        sentiment: 'Neutral',
        score: 0,
      };
    });

    setSentiments(nextSentiments);
    setSentimentRefreshing(false);
  };

  const handleSentimentRefresh = async () => {
    await fetchSectorSentiments();
  };

  const handleAlertsRefresh = async () => {
    await fetchAiAlerts();
  };

  const openTutorial = (tutorialKey) => {
    setActiveTutorialKey(tutorialKey);
  };

  const closeTutorial = () => {
    setActiveTutorialKey(null);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#2ebd85]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Insights</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

          <section>
            <div className="mb-2 flex items-center gap-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" /> Market Overview
              </h3>
              <TutorialInfoButton
                label="market overview"
                onClick={() => openTutorial('aiMarketOverview')}
              />
            </div>
            <div className="space-y-2">
              {marketIndices.map((idx) => (
                <div
                  key={idx.name}
                  className="flex items-center justify-between bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{idx.name}</p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">{idx.value}</p>
                  </div>
                  <ChangeChip change={idx.change} />
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-start gap-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" /> AI Sentiment Analysis
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">May take a few seconds to load</p>
                </div>
                <TutorialInfoButton
                  label="AI sentiment analysis"
                  onClick={() => openTutorial('aiSentimentAnalysis')}
                />
              </div>
              <button
                type="button"
                onClick={handleSentimentRefresh}
                className="p-1 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-700"
                title="Refresh sentiment"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${sentimentRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="space-y-2">
              {sentiments.map((s) => {
                const labelColor =
                  s.sentiment === 'Bullish' ? 'text-[#2ebd85]' :
                  s.sentiment === 'Bearish' ? 'text-rose-500' :
                  'text-yellow-500';
                return (
                  <div key={s.sector} className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.sector}</p>
                      <span className={`text-xs font-bold ${labelColor}`}>{s.sentiment}</span>
                    </div>
                    <SentimentBar score={s.score} sentiment={s.sentiment} />
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> AI Alerts
                </h3>
                <TutorialInfoButton
                  label="AI alerts"
                  onClick={() => openTutorial('aiAlerts')}
                />
              </div>
              <button
                type="button"
                onClick={handleAlertsRefresh}
                className="p-1 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-700"
                title="Refresh alerts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${alertsRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="space-y-2">
              {aiAlerts.map((alert, i) => {
                const styles = {
                  positive: 'border-[#aae4cc] dark:border-[#1b7350] bg-[#edfaf4] dark:bg-[#114832]/20 text-[#26a070] dark:text-[#80d6b3]',
                  warning:  'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
                  negative: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
                };
                return (
                  <div key={i} className={`rounded-lg border px-3 py-2 text-xs leading-snug ${styles[alert.type]}`}>
                    {alert.text}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 shrink-0">
          <p className="text-xs text-slate-500 dark:text-gray-400 text-center">
            AI insights are for informational purposes only and do not constitute financial advice.
          </p>
        </div>
      </aside>

      <TutorialPopup
        isOpen={Boolean(activeTutorialKey)}
        tutorialKey={activeTutorialKey}
        tutorials={AI_INSIGHTS_TUTORIALS}
        allowVideo={false}
        onClose={closeTutorial}
      />
    </>
  );
}
