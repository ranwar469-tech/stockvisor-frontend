import { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Brain, BarChart2, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../services/api';

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

const aiAlerts = [
  { text: 'NVDA breakout above 20-day MA — momentum building.', type: 'positive' },
  { text: 'Elevated volatility expected around Fed meeting on Mar 5.', type: 'warning' },
  { text: 'META showing strong accumulation in after-hours trading.', type: 'positive' },
  { text: 'TSLA detected downward trend; support at $238 key level.', type: 'negative' },
];

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
  const [marketIndices, setMarketIndices] = useState(
    MARKET_INDEX_CONFIG.map((item) => ({ ...item, value: '--', change: 0 }))
  );
  const [sentiments, setSentiments] = useState(
    SENTIMENT_SECTOR_CONFIG.map((item) => ({ ...item, sentiment: 'Neutral', score: 0 }))
  );
  const [sentimentRefreshing, setSentimentRefreshing] = useState(false);

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

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-gray-700 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

          {/* ── Market Overview ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" /> Market Overview
            </h3>
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

          {/* ── AI Sentiment Analysis ── */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> AI Sentiment Analysis
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">May take a few seconds to load</p>
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

          {/* ── AI Alerts ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> AI Alerts
            </h3>
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

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 shrink-0">
          <p className="text-xs text-slate-500 dark:text-gray-400 text-center">
            AI insights are for informational purposes only and do not constitute financial advice.
          </p>
        </div>
      </aside>
    </>
  );
}
