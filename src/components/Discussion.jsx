import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Plus, X, RefreshCw, MoreVertical, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const INITIAL_DISCUSSION_FORM = { category: '', title: '' };

export default function Discussion() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState(INITIAL_DISCUSSION_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [openThreadMenuId, setOpenThreadMenuId] = useState(null);
  const [deletingThreadId, setDeletingThreadId] = useState(null);

  const fetchThreads = useCallback(async () => {
    if (!isAuthenticated) {
      setThreads([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/discussions/threads');
      setThreads(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load discussions.';
      setError(typeof msg === 'string' ? msg : 'Failed to load discussions.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const resetDiscussionModal = () => {
    setShowDiscussionModal(false);
    setCreateError('');
    setNewDiscussion(INITIAL_DISCUSSION_FORM);
  };

  const handleOpenDiscussionModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowDiscussionModal(true);
  };

  const handleCreateDiscussion = async () => {
    const category = newDiscussion.category.trim();
    const title = newDiscussion.title.trim();
    if (!category || !title) return;

    setCreateLoading(true);
    setCreateError('');

    try {
      const { data } = await api.post('/discussions/threads', {
        category,
        title,
      });
      setThreads((prev) => [data, ...prev.filter((thread) => thread.id !== data.id)]);
      resetDiscussionModal();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to create discussion.';
      setCreateError(typeof msg === 'string' ? msg : 'Failed to create discussion.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteThread = async (threadId, createdById) => {
    if (!threadId || !user?.id || String(createdById) !== String(user.id)) return;
    const confirmed = window.confirm('Delete this thread? This cannot be undone.');
    if (!confirmed) return;

    setDeletingThreadId(threadId);
    setError('');
    try {
      await api.delete(`/discussions/threads/${threadId}`);
      setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
      setOpenThreadMenuId(null);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete thread.';
      setError(typeof msg === 'string' ? msg : 'Failed to delete thread.');
    } finally {
      setDeletingThreadId(null);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Popular Discussions</h3>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={fetchThreads}
                disabled={loading}
                className="p-2 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-600"
                title="Refresh discussions"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={handleOpenDiscussionModal}
              className="bg-[#2ebd85] hover:bg-[#26a070] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>New Discussion</span>
            </button>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="py-16 px-6 text-center">
            <p className="text-slate-600 dark:text-gray-400 mb-4">Log in to view and create discussions.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#2ebd85] hover:bg-[#26a070] text-white px-5 py-2 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {isAuthenticated && loading && threads.length === 0 && (
          <div className="flex items-center justify-center py-16 text-slate-500 dark:text-gray-400">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading discussions…
          </div>
        )}

        {isAuthenticated && error && threads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-rose-500">
            <p>{error}</p>
            <button onClick={fetchThreads} className="mt-3 text-sm text-[#2ebd85] hover:underline">Retry</button>
          </div>
        )}

        {isAuthenticated && !loading && !error && threads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-gray-400">
            <p>No discussions yet. Start the first one.</p>
          </div>
        )}

        {isAuthenticated && threads.length > 0 && (
          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {threads.map((thread) => {
              const participants = Array.isArray(thread.participating_users) ? thread.participating_users.length : 0;
              const isCurrentUser = user?.id && thread.created_by === user.id;
              const authorLabel = isCurrentUser
                ? (user?.username || thread.created_by_username || 'You')
                : (thread.created_by_username || thread.created_by);

              return (
                <div
                  key={thread.id}
                  onClick={() => navigate(`/community/threads/${thread.id}`)}
                  className="px-6 py-5 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#2ebd85] rounded text-xs font-semibold text-white">
                          {thread.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{thread.title}</h4>
                      <p className="text-slate-600 dark:text-gray-400 text-sm">
                        by {authorLabel}
                      </p>
                    </div>
                    <div className="ml-4 flex items-start gap-2">
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1 text-[#2ebd85]">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-semibold text-sm">{thread.message_count}</span>
                        </div>
                        <div className="flex items-center justify-end gap-1 text-slate-600 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{participants}</span>
                        </div>
                      </div>

                      {isCurrentUser && (
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setOpenThreadMenuId((prev) => (prev === thread.id ? null : thread.id))}
                            className="p-1 rounded text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                            title="Thread actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openThreadMenuId === thread.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleDeleteThread(thread.id, thread.created_by)}
                                disabled={deletingThreadId === thread.id}
                                className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2 disabled:opacity-60"
                              >
                                {deletingThreadId === thread.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && threads.length > 0 && (
        <div className="mt-2 text-sm text-rose-500">{error}</div>
      )}

      {showDiscussionModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Discussion</h3>
              <button
                onClick={resetDiscussionModal}
                className="p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
            </div>

            {createError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Discussion Category</label>
                <input
                  type="text"
                  placeholder="e.g. Strategy"
                  value={newDiscussion.category}
                  onChange={(e) => setNewDiscussion((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Discussion Title</label>
                <input
                  type="text"
                  placeholder="Enter your discussion title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={resetDiscussionModal}
                  className="flex-1 px-4 py-2 rounded-lg transition-colors bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDiscussion}
                  disabled={createLoading}
                  className="flex-1 px-4 py-2 bg-[#2ebd85] hover:bg-[#26a070] disabled:opacity-60 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {createLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}