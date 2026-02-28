import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Users, RefreshCw, MoreVertical, Trash2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DiscussionThread() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { threadId } = useParams();

  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [openPostMenuId, setOpenPostMenuId] = useState(null);
  const [openThreadMenu, setOpenThreadMenu] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deletingThread, setDeletingThread] = useState(false);

  const fetchThread = useCallback(async () => {
    if (!threadId) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/discussions/threads/${threadId}`);
      setThread(data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load discussion thread.';
      setError(typeof msg === 'string' ? msg : 'Failed to load discussion thread.');
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchThread();
  }, [isAuthenticated, fetchThread]);

  const handlePostMessage = async () => {
    const message = newMessage.trim();
    if (!message || !threadId) return;

    setPosting(true);
    setPostError('');
    try {
      await api.post(`/discussions/threads/${threadId}/posts`, { message });
      setNewMessage('');
      await fetchThread();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to post message.';
      setPostError(typeof msg === 'string' ? msg : 'Failed to post message.');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!thread || !user?.id || String(thread.created_by) !== String(user.id)) return;
    const confirmed = window.confirm('Delete this thread? This cannot be undone.');
    if (!confirmed) return;

    setDeletingThread(true);
    setError('');
    try {
      await api.delete(`/discussions/threads/${thread.id}`);
      navigate('/community');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete thread.';
      setError(typeof msg === 'string' ? msg : 'Failed to delete thread.');
    } finally {
      setDeletingThread(false);
      setOpenThreadMenu(false);
    }
  };

  const handleDeletePost = async (postId, postUserId) => {
    if (!postId || !user?.id || String(postUserId) !== String(user.id)) return;
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;

    setDeletingPostId(postId);
    setPostError('');
    try {
      await api.delete(`/discussions/posts/${postId}`);
      setOpenPostMenuId(null);
      await fetchThread();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete post.';
      setPostError(typeof msg === 'string' ? msg : 'Failed to delete post.');
    } finally {
      setDeletingPostId(null);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const posts = Array.isArray(thread?.posts) ? thread.posts : [];
  const participants = Array.isArray(thread?.participating_users) ? thread.participating_users.length : 0;
  const currentUserId = String(user?.id || '');

  const formatAuthorName = (authorId, username) => {
    const idValue = String(authorId || '').trim();
    const usernameValue = String(username || '').trim();

    if (currentUserId && idValue && idValue === currentUserId) {
      return user?.username || usernameValue || 'You';
    }
    if (usernameValue) return usernameValue;
    if (!idValue) return 'Member';
    return idValue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2ebd85] hover:text-[#26a070] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community
        </Link>
        <button
          onClick={fetchThread}
          disabled={loading}
          className="p-2 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-100 dark:hover:bg-gray-800"
          title="Refresh thread"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !thread && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-[#2ebd85] text-center text-slate-500 dark:text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin inline-block mr-2" /> Loading discussion…
        </div>
      )}

      {error && !thread && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-rose-300 text-center text-rose-500">
          <p>{error}</p>
          <button onClick={fetchThread} className="mt-3 text-sm text-[#2ebd85] hover:underline">Retry</button>
        </div>
      )}

      {thread && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
            <div className="px-6 py-5 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="px-2 py-1 bg-[#2ebd85] rounded text-xs font-semibold text-white">
                  {thread.category}
                </span>

                {String(thread.created_by) === String(user?.id) && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenThreadMenu((prev) => !prev)}
                      className="p-1 rounded text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                      title="Thread actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openThreadMenu && (
                      <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
                        <button
                          type="button"
                          onClick={handleDeleteThread}
                          disabled={deletingThread}
                          className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2 disabled:opacity-60"
                        >
                          {deletingThread ? (
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{thread.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-gray-400">
                <span>Created by {formatAuthorName(thread.created_by, thread.created_by_username)}</span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-[#2ebd85]" />
                  {thread.message_count} messages
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-4 h-4 text-[#2ebd85]" />
                  {participants} participants
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-gray-700">
              {posts.length === 0 && (
                <div className="px-6 py-10 text-center text-slate-500 dark:text-gray-400">
                  No posts yet in this thread.
                </div>
              )}

              {posts.map((post) => (
                <div key={post.id} className="px-6 py-4">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatAuthorName(post.user_id, post.username)}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleString()}
                      </p>

                      {String(post.user_id) === String(user?.id) && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenPostMenuId((prev) => (prev === post.id ? null : post.id))}
                            className="p-1 rounded text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                            title="Post actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openPostMenuId === post.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id, post.user_id)}
                                disabled={deletingPostId === post.id}
                                className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2 disabled:opacity-60"
                              >
                                {deletingPostId === post.id ? (
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
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {post.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-gray-700 bg-slate-50/70 dark:bg-gray-700/50">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Post a message</h3>

              {postError && (
                <div className="mb-2 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                  {postError}
                </div>
              )}

              <div className="space-y-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handlePostMessage}
                    disabled={posting || !newMessage.trim()}
                    className="px-4 py-1.5 text-sm bg-[#2ebd85] hover:bg-[#26a070] disabled:opacity-60 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    {posting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-rose-500">{error}</div>
          )}
        </>
      )}
    </div>
  );
}
