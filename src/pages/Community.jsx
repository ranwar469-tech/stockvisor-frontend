import { useCallback, useEffect, useState } from 'react';
import { Users, Trophy, RefreshCw } from 'lucide-react';
import Discussion from '../components/Discussion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Community() {
  const { isAuthenticated } = useAuth();
  const [topUsers, setTopUsers] = useState([]);
  const [contributorsLoading, setContributorsLoading] = useState(false);
  const [contributorsError, setContributorsError] = useState('');

  const fetchTopContributors = useCallback(async () => {
    if (!isAuthenticated) {
      setTopUsers([]);
      setContributorsError('');
      return;
    }

    setContributorsLoading(true);
    setContributorsError('');
    try {
      const { data } = await api.get('/discussions/threads');
      const rows = Array.isArray(data) ? data : [];

      const threadDetailResults = await Promise.allSettled(
        rows.map((thread) => api.get(`/discussions/threads/${thread.id}`))
      );

      const ensureContributor = (acc, idValue, nameValue) => {
        const id = String(idValue || '').trim();
        if (!id) return null;

        if (!acc[id]) {
          acc[id] = {
            id,
            name: String(nameValue || id),
            posts: 0,
            threads: 0,
            points: 0,
          };
        } else if (!acc[id].name && nameValue) {
          acc[id].name = String(nameValue);
        }

        return acc[id];
      };

      const leaderboard = {};

      rows.forEach((thread) => {
        const contributor = ensureContributor(
          leaderboard,
          thread.created_by,
          thread.created_by_username || thread.created_by
        );
        if (!contributor) return;
        contributor.threads += 1;
      });

      threadDetailResults.forEach((result) => {
        if (result.status !== 'fulfilled') return;
        const detail = result.value.data;
        const posts = Array.isArray(detail?.posts) ? detail.posts : [];

        posts.forEach((post) => {
          const contributor = ensureContributor(
            leaderboard,
            post.user_id,
            post.username || post.user_id
          );
          if (!contributor) return;
          contributor.posts += 1;
        });
      });

      Object.values(leaderboard).forEach((contributor) => {
        contributor.points = (contributor.threads * 25) + (contributor.posts * 10);
      });

      const top = Object.values(leaderboard)
        .sort((a, b) => b.points - a.points)
        .slice(0, 3);

      setTopUsers(top);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load contributors.';
      setContributorsError(typeof msg === 'string' ? msg : 'Failed to load contributors.');
      setTopUsers([]);
    } finally {
      setContributorsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchTopContributors();
  }, [fetchTopContributors]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Community</h2>
        <p className="text-slate-600 dark:text-gray-400">Connect with traders and share investment insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Discussions */}
        <div className="lg:col-span-2">
          <Discussion />
        </div>

        {/* Top Contributors */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Contributors</h3>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">Scoring: 25 per thread, 10 per post</p>
              </div>
              {isAuthenticated && (
                <button
                  onClick={fetchTopContributors}
                  disabled={contributorsLoading}
                  className="p-1.5 rounded transition-colors text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] hover:bg-slate-200 dark:hover:bg-gray-600"
                  title="Refresh contributors"
                >
                  <RefreshCw className={`w-4 h-4 ${contributorsLoading ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {!isAuthenticated && (
              <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-gray-400">
                Log in to see contributor rankings.
              </div>
            )}

            {isAuthenticated && contributorsLoading && topUsers.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-gray-400">
                Loading contributors...
              </div>
            )}

            {isAuthenticated && contributorsError && topUsers.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-rose-500">{contributorsError}</p>
                <button onClick={fetchTopContributors} className="mt-2 text-xs text-[#2ebd85] hover:underline">Retry</button>
              </div>
            )}

            {isAuthenticated && !contributorsLoading && !contributorsError && topUsers.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-gray-400">
                No contributor data yet.
              </div>
            )}

            {isAuthenticated && topUsers.length > 0 && (
              <div className="divide-y divide-slate-200 dark:divide-gray-700">
              {topUsers.map((user, index) => (
                <div key={user.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2ebd85] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[#2ebd85] text-xs font-semibold">
                          <Trophy className="w-3 h-3" />
                          {user.points} pts
                        </span>
                        <span className="flex items-center gap-1 text-slate-600 dark:text-gray-400 text-xs">
                          <Users className="w-3 h-3" />
                          {user.posts} posts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}