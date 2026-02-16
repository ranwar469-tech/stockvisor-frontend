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
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-2 text-blue-400">Community</h2>
        <p className="text-slate-400 mb-8">Connect with traders and share investment insights</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discussions */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-blue-600">
                <h3 className="text-2xl font-bold text-blue-400">Popular Discussions</h3>
              </div>
              <div className="divide-y divide-slate-700">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="p-6 hover:bg-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-600 rounded text-xs font-semibold text-white">
                            {discussion.category}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{discussion.title}</h4>
                        <p className="text-slate-400 text-sm">by {discussion.author}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-blue-400 font-semibold">{discussion.replies} replies</p>
                        <p className="text-slate-400 text-sm">{discussion.views} views</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Contributors */}
          <div>
            <div className="bg-slate-800 rounded-lg border border-blue-600 shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-blue-600">
                <h3 className="text-xl font-bold text-blue-400">Top Contributors</h3>
              </div>
              <div className="divide-y divide-slate-700">
                {topUsers.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-slate-700 transition-colors">
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-blue-400 text-sm">⚡ {user.points} points</p>
                    <p className="text-slate-400 text-xs">{user.posts} posts</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}