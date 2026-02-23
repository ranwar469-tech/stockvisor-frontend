import { MessageSquare, Eye, Users, Trophy } from 'lucide-react';

export default function Community() {
  const discussions = [
    { id: 1, author: 'Alex Chen', title: 'Best dividend stocks for 2026', replies: 24, views: 1205, category: 'Dividends' },
    { id: 2, author: 'Jordan Smith', title: 'Tech sector analysis Q1 2026', replies: 18, views: 892, category: 'Analysis' },
    { id: 3, author: 'Morgan Lee', title: 'Long-term investment strategy', replies: 42, views: 2150, category: 'Strategy' },
    { id: 4, author: 'Casey Davis', title: 'Emerging markets opportunities', replies: 15, views: 645, category: 'International' },
  ];

  const topUsers = [
    { id: 1, name: 'Alex Chen', points: 4850, posts: 126 },
    { id: 2, name: 'Jordan Smith', points: 3920, posts: 98 },
    { id: 3, name: 'Morgan Lee', points: 5210, posts: 142 },
  ];

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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Popular Discussions</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-gray-700">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="px-6 py-5 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#2ebd85] rounded text-xs font-semibold text-white">
                          {discussion.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{discussion.title}</h4>
                      <p className="text-slate-600 dark:text-gray-400 text-sm">by {discussion.author}</p>
                    </div>
                    <div className="text-right ml-4 space-y-1">
                      <div className="flex items-center justify-end gap-1 text-[#2ebd85]">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-semibold text-sm">{discussion.replies}</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-slate-600 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">{discussion.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Contributors</h3>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-gray-700">
              {topUsers.map((user, index) => (
                <div key={user.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2ebd85] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
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
          </div>
        </div>
      </div>
    </div>
  );
}