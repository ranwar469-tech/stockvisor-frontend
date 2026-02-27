import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function News() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('latest');
  const [newsArticles, setNewsArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [savedByExternalId, setSavedByExternalId] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const buildSavedMap = (items) => {
    const map = {};
    items.forEach((item) => {
      map[item.external_id] = item;
    });
    return map;
  };

  const fetchSavedArticles = async () => {
    if (!isAuthenticated) {
      setSavedArticles([]);
      setSavedByExternalId({});
      return;
    }

    setLoadingSaved(true);
    try {
      const { data } = await api.get('/stocks/news/saved');
      const items = Array.isArray(data) ? data : [];
      setSavedArticles(items);
      setSavedByExternalId(buildSavedMap(items));
    } catch {
      setSavedArticles([]);
      setSavedByExternalId({});
    } finally {
      setLoadingSaved(false);
    }
  };

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

  useEffect(() => {
    fetchSavedArticles();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && activeTab === 'saved') {
      setActiveTab('latest');
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (!saveMessage) return;
    const timer = setTimeout(() => setSaveMessage(''), 2200);
    return () => clearTimeout(timer);
  }, [saveMessage]);

  const getExternalId = (article) => article.external_id ?? article.id;

  const handleToggleSave = async (article) => {
    if (!isAuthenticated) return;

    const externalId = getExternalId(article);
    const existingSaved = savedByExternalId[externalId];

    setTogglingId(externalId);
    try {
      if (existingSaved) {
        await api.delete(`/stocks/news/saved/${existingSaved.id}`);
        const nextSaved = savedArticles.filter((item) => item.id !== existingSaved.id);
        setSavedArticles(nextSaved);
        setSavedByExternalId(buildSavedMap(nextSaved));
        setSaveMessage('Article unsaved');
        return;
      }

      const payload = {
        external_id: externalId,
        category: article.category || 'general',
        datetime: article.datetime,
        headline: article.headline,
        image: article.image || null,
        related: article.related || null,
        source: article.source,
        summary: article.summary || null,
        url: article.url,
      };

      const { data } = await api.post('/stocks/news/saved', payload);
      const nextSaved = [data, ...savedArticles];
      setSavedArticles(nextSaved);
      setSavedByExternalId(buildSavedMap(nextSaved));
      setSaveMessage('Article saved');
    } catch (err) {
      if (err.response?.status === 409) {
        await fetchSavedArticles();
        setSaveMessage('Article saved');
      }
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (unixSeconds) => {
    if (!unixSeconds) return '';
    return new Date(unixSeconds * 1000).toLocaleString();
  };

  const handleSavedTabClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setActiveTab('saved');
  };

  const articlesToRender = activeTab === 'saved' ? savedArticles : newsArticles;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Market News</h2>
        <p className="text-slate-600 dark:text-gray-400">Stay updated with the latest market movements</p>
      </div>

      {saveMessage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-3 rounded-xl bg-[#2ebd85] text-white font-semibold shadow-lg">
            {saveMessage}
          </div>
        </div>
      )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'latest'
                  ? 'bg-[#2ebd85] text-white'
                  : 'bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-gray-200'
              }`}
            >
              Latest News
            </button>
            <button
              onClick={handleSavedTabClick}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'saved'
                  ? 'bg-[#2ebd85] text-white'
                  : 'bg-slate-200 dark:bg-gray-600 text-slate-700 dark:text-gray-200'
              }`}
            >
              Saved Articles
            </button>
          </div>
        </div>
        {activeTab === 'latest' && loading ? (
          <div className="px-6 py-6 text-slate-600 dark:text-gray-400">Loading news...</div>
        ) : activeTab === 'saved' && !isAuthenticated ? (
          <div className="px-6 py-6 text-slate-600 dark:text-gray-400">Log in to view saved articles.</div>
        ) : activeTab === 'saved' && loadingSaved ? (
          <div className="px-6 py-6 text-slate-600 dark:text-gray-400">Loading saved articles...</div>
        ) : error ? (
          <div className="px-6 py-6 text-rose-600 dark:text-rose-400">{error}</div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {articlesToRender.map((article) => {
              const externalId = getExternalId(article);
              const isSaved = !!savedByExternalId[externalId];

              return (
              <a
                key={activeTab === 'saved' ? `saved-${article.id}` : `latest-${externalId}`}
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
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-1 bg-[#2ebd85] rounded text-xs font-semibold text-white capitalize">
                        {article.category || 'general'}
                      </span>
                      {isAuthenticated && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleToggleSave(article);
                          }}
                          disabled={togglingId === externalId}
                          className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                          title={isSaved ? 'Unsave article' : 'Save article'}
                        >
                          <Bookmark
                            className={`w-5 h-5 transition-colors ${
                              isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500 dark:text-gray-400'
                            }`}
                          />
                        </button>
                      )}
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
              );
            })}

            {!articlesToRender.length && (
              <div className="px-6 py-6 text-slate-600 dark:text-gray-400">
                {activeTab === 'saved' ? 'No saved articles yet.' : 'No news available.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}