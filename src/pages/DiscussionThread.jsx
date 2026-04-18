import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Users, RefreshCw, MoreVertical, Trash2, Heart, Flag, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DiscussionThread() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = (user?.role || 'user') === 'admin';
  const navigate = useNavigate();
  const { threadId } = useParams();
  const [searchParams] = useSearchParams();

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
  const [likedByPostId, setLikedByPostId] = useState({});
  const [likingPostId, setLikingPostId] = useState(null);
  const [reportingThread, setReportingThread] = useState(false);
  const [reportingPostId, setReportingPostId] = useState(null);
  const [reportFeedback, setReportFeedback] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetType, setReportTargetType] = useState('thread');
  const [reportTargetId, setReportTargetId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');

  const fetchThread = useCallback(async () => {
    if (!threadId) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/discussions/threads/${threadId}`);
      setThread(data);

      const posts = Array.isArray(data?.posts) ? data.posts : [];
      if (posts.length === 0) {
        setLikedByPostId({});
      } else {
        const likesResults = await Promise.all(
          posts.map(async (post) => {
            try {
              const { data: likesData } = await api.get(`/discussions/posts/${post.id}/likes`);
              return {
                postId: post.id,
                liked: Boolean(likesData?.liked),
                likes: Number.isFinite(likesData?.likes) ? likesData.likes : post.likes,
              };
            } catch {
              return {
                postId: post.id,
                liked: false,
                likes: post.likes,
              };
            }
          })
        );

        const nextLikedMap = {};
        const likesByPostId = {};
        likesResults.forEach((result) => {
          nextLikedMap[result.postId] = result.liked;
          likesByPostId[result.postId] = result.likes;
        });
        setLikedByPostId(nextLikedMap);
        setThread((prev) => {
          if (!prev) return prev;
          const prevPosts = Array.isArray(prev.posts) ? prev.posts : [];
          return {
            ...prev,
            posts: prevPosts.map((post) => ({
              ...post,
              likes: likesByPostId[post.id] ?? post.likes,
            })),
          };
        });
      }
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
    if (!thread) return;

    const isThreadOwner = Boolean(user?.id) && String(thread.created_by) === String(user.id);
    if (!isThreadOwner && !isAdmin) return;

    const confirmed = window.confirm('Delete this thread? This cannot be undone.');
    if (!confirmed) return;

    setDeletingThread(true);
    setError('');
    try {
      const endpoint = isAdmin
        ? `/admin/threads/${thread.id}`
        : `/discussions/threads/${thread.id}`;
      await api.delete(endpoint);
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
    if (!postId) return;

    const isPostOwner = Boolean(user?.id) && String(postUserId) === String(user.id);
    if (!isPostOwner && !isAdmin) return;

    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) return;

    setDeletingPostId(postId);
    setPostError('');
    try {
      const endpoint = isAdmin
        ? `/admin/posts/${postId}`
        : `/discussions/posts/${postId}`;
      await api.delete(endpoint);
      setOpenPostMenuId(null);
      await fetchThread();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete post.';
      setPostError(typeof msg === 'string' ? msg : 'Failed to delete post.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleTogglePostLike = async (postId) => {
    if (!postId || likingPostId === postId) return;

    setLikingPostId(postId);
    setPostError('');
    try {
      const { data } = await api.post(`/discussions/posts/${postId}/likes`);
      const liked = Boolean(data?.liked);
      const likes = Number.isFinite(data?.likes) ? data.likes : 0;

      setLikedByPostId((prev) => ({ ...prev, [postId]: liked }));
      setThread((prev) => {
        if (!prev) return prev;
        const prevPosts = Array.isArray(prev.posts) ? prev.posts : [];
        return {
          ...prev,
          posts: prevPosts.map((post) =>
            post.id === postId
              ? {
                ...post,
                likes,
              }
              : post
          ),
        };
      });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update like.';
      setPostError(typeof msg === 'string' ? msg : 'Failed to update like.');
    } finally {
      setLikingPostId(null);
    }
  };

  const resetReportModal = () => {
    setShowReportModal(false);
    setReportTargetType('thread');
    setReportTargetId(null);
    setReportReason('');
    setReportDetails('');
  };

  const openReportModal = (targetType, targetId) => {
    setReportFeedback('');
    setPostError('');
    setReportTargetType(targetType);
    setReportTargetId(targetId);
    setReportReason('');
    setReportDetails('');
    setShowReportModal(true);
  };

  const handleReportThread = () => {
    if (!thread?.id) return;
    const isOwnThread = Boolean(user?.id) && String(thread.created_by) === String(user.id);
    if (isOwnThread) {
      setReportFeedback('You cannot report your own thread.');
      return;
    }
    openReportModal('thread', thread.id);
  };

  const handleReportPost = (postId) => {
    if (!postId) return;
    const targetPost = posts.find((item) => String(item.id) === String(postId));
    const isOwnPost = Boolean(user?.id) && String(targetPost?.user_id) === String(user.id);
    if (isOwnPost) {
      setReportFeedback('You cannot report your own post.');
      return;
    }
    openReportModal('post', postId);
  };

  const handleSubmitReport = async () => {
    const reason = reportReason.trim();
    const details = reportDetails.trim();

    if (!reason) {
      setReportFeedback('Report reason is required.');
      return;
    }

    const isThreadTarget = reportTargetType === 'thread';
    const endpoint = isThreadTarget
      ? `/discussions/threads/${reportTargetId}/reports`
      : `/discussions/posts/${reportTargetId}/reports`;

    if (isThreadTarget) {
      setReportingThread(true);
    } else {
      setReportingPostId(reportTargetId);
    }
    setReportFeedback('');

    try {
      await api.post(endpoint, {
        reason,
        details: details || undefined,
      });

      setReportFeedback(
        isThreadTarget
          ? 'Thread reported successfully. Our admins will review it.'
          : 'Post reported successfully. Our admins will review it.'
      );
      resetReportModal();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit report.';
      setReportFeedback(typeof msg === 'string' ? msg : 'Failed to submit report.');
    } finally {
      if (isThreadTarget) {
        setReportingThread(false);
      } else {
        setReportingPostId(null);
      }
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const posts = Array.isArray(thread?.posts) ? thread.posts : [];
  const participants = Array.isArray(thread?.participating_users) ? thread.participating_users.length : 0;
  const currentUserId = String(user?.id || '');
  const canManageThread = Boolean(thread) && (String(thread.created_by) === currentUserId || isAdmin);
  const isOwnThread = Boolean(thread) && String(thread.created_by) === currentUserId;
  const highlightSource = searchParams.get('source');
  const highlightTarget = searchParams.get('highlightTarget');
  const highlightedPostId = searchParams.get('postId');
  const shouldHighlightFromAdmin = highlightSource === 'adminReport';
  const isThreadHighlighted = shouldHighlightFromAdmin && highlightTarget === 'thread';

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

  useEffect(() => {
    if (!thread || !shouldHighlightFromAdmin || highlightTarget !== 'post' || !highlightedPostId) return;

    const targetNode = document.getElementById(`post-${highlightedPostId}`);
    if (targetNode) {
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [thread, shouldHighlightFromAdmin, highlightTarget, highlightedPostId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={user?.role === 'admin' ? '/community?adminManage=1' : '/community'}
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
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition-colors duration-300 ${
            isThreadHighlighted
              ? 'border-orange-400 ring-2 ring-orange-200 dark:border-red-700 dark:ring-red-900/40'
              : 'border-[#2ebd85]'
          }`}>
            <div className={`px-6 py-5 border-b border-slate-200 dark:border-gray-700 ${
              isThreadHighlighted ? 'bg-orange-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-gray-700'
            }`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="px-2 py-1 bg-[#2ebd85] rounded text-xs font-semibold text-white">
                  {thread.category}
                </span>

                <div className="flex items-center gap-2">
                  {!isOwnThread && (
                    <button
                      type="button"
                      onClick={handleReportThread}
                      disabled={reportingThread}
                      className={`inline-flex items-center justify-center p-1.5 rounded text-amber-700 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-60 ${
                        isThreadHighlighted ? 'ring-2 ring-orange-400 dark:ring-red-700' : ''
                      }`}
                      title="Report thread"
                      aria-label="Report thread"
                    >
                      {reportingThread ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Flag className="w-3 h-3" />
                      )}
                    </button>
                  )}

                  {canManageThread && (
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
                            {isAdmin && String(thread.created_by) !== currentUserId ? 'Delete (Admin)' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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

              {posts.map((post) => {
                const isHighlightedPost = shouldHighlightFromAdmin && highlightTarget === 'post' && String(post.id) === String(highlightedPostId);
                const isOwnPost = String(post.user_id) === currentUserId;

                return (
                <div
                  id={`post-${post.id}`}
                  key={post.id}
                  className={`px-6 py-4 transition-colors ${
                    isHighlightedPost ? 'bg-orange-50/90 dark:bg-red-900/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatAuthorName(post.user_id, post.username)}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {new Date(post.created_at).toLocaleString()}
                      </p>

                      {!isOwnPost && (
                        <button
                          type="button"
                          onClick={() => handleReportPost(post.id)}
                          disabled={reportingPostId === post.id}
                          className={`inline-flex items-center justify-center p-1.5 rounded text-amber-700 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-60 ${
                            isHighlightedPost ? 'ring-2 ring-orange-400 dark:ring-red-700' : ''
                          }`}
                          title="Report post"
                          aria-label="Report post"
                        >
                          {reportingPostId === post.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Flag className="w-3 h-3" />
                          )}
                        </button>
                      )}

                      {(String(post.user_id) === currentUserId || isAdmin) && (
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
                                {isAdmin && String(post.user_id) !== currentUserId ? 'Delete (Admin)' : 'Delete'}
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
                  <div className="mt-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePostLike(post.id)}
                      disabled={likingPostId === post.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border ${
                        likedByPostId[post.id]
                          ? 'text-rose-600 border-rose-300 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-700 dark:text-rose-300'
                          : 'text-slate-600 border-slate-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                      } disabled:opacity-60`}
                      title={likedByPostId[post.id] ? 'Unlike post' : 'Like post'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedByPostId[post.id] ? 'fill-current' : ''}`} />
                      <span>{post.likes ?? 0}</span>
                    </button>
                  </div>
                </div>
              );})}
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

          {reportFeedback && (
            <div className={`text-sm ${reportFeedback.toLowerCase().includes('failed') || reportFeedback.toLowerCase().includes('required') ? 'text-rose-500' : 'text-[#2ebd85]'}`}>
              {reportFeedback}
            </div>
          )}

          {showReportModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Report {reportTargetType === 'thread' ? 'Thread' : 'Post'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetReportModal}
                    className="p-1 rounded transition-colors hover:bg-slate-100 dark:hover:bg-gray-700"
                    aria-label="Close report dialog"
                  >
                    <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Reason</label>
                    <input
                      type="text"
                      placeholder="Why are you reporting this content?"
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">Additional details (optional)</label>
                    <textarea
                      placeholder="Add more context for moderators"
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-slate-300 dark:border-gray-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2ebd85] resize-none"
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={resetReportModal}
                      className="flex-1 px-4 py-2 rounded-lg transition-colors bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitReport}
                      disabled={
                        reportingThread ||
                        (reportTargetType === 'post' && reportingPostId === reportTargetId)
                      }
                      className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      {reportingThread || (reportTargetType === 'post' && reportingPostId === reportTargetId)
                        ? <RefreshCw className="w-4 h-4 animate-spin" />
                        : 'Submit Report'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
