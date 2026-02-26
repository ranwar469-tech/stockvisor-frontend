import { useEffect, useState } from 'react';
import api from '../services/api';

export default function News() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setError('');
        const { data } = await api.get('/stocks/news');
        setNewsArticles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load news. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (unixSeconds) => {
    if (!unixSeconds) return '';
    return new Date(unixSeconds * 1000).toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Market News</h2>
        <p className="text-slate-600 dark:text-gray-400">Stay updated with the latest market movements</p>
      </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Latest Articles</h3>
        </div>
        {loading ? (
          <div className="px-6 py-6 text-slate-600 dark:text-gray-400">Loading news...</div>
        ) : error ? (
          <div className="px-6 py-6 text-rose-600 dark:text-rose-400">{error}</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {newsArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="block px-6 py-5 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-gray-700 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#2ebd85] rounded text-xs font-semibold text-white capitalize">
                        {article.category || 'general'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 hover:text-[#2ebd85] transition-colors">
                      {article.headline}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {article.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-gray-400 text-sm font-medium">{article.source}</span>
                      <span className="text-slate-600 dark:text-gray-400 text-xs">{formatDate(article.datetime)}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}

            {!newsArticles.length && (
              <div className="px-6 py-6 text-slate-600 dark:text-gray-400">No news available.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}