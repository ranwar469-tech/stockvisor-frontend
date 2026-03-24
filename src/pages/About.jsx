import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Brain,
  Globe2,
  Layers,
  MessageSquare,
  Newspaper,
  PieChart,
  Shield,
  TrendingUp,
  Lightbulb,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Market Dashboard',
    description:
      'A live market overview with a sector heatmap, analyst recommendation charts, and a popular-stocks table with favorites support. Refresh on demand to pull the latest quotes and sentiment.',
  },
  {
    icon: TrendingUp,
    title: 'Portfolio Tracker',
    description:
      'Add and sell stock positions with a searchable autocomplete. Track total invested capital, current market value, and total profit/loss in real time. Holdings are sorted by the time they were added.',
  },
  {
    icon: PieChart,
    title: 'Sector Allocation Radar',
    description:
      'A radar chart that instantly shows how your capital is spread across Technology, Energy, Financial Services, Healthcare, and other sectors — making concentration risk easy to spot at a glance.',
  },
  {
    icon: Layers,
    title: 'Cost vs Value Area Chart',
    description:
      'Visualise total invested cost against current market value over your holding timeline. A green gap means profit; a red gap means drawdown. Colour-coded fills make performance immediately visible.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description:
      'An AI sidebar delivers on-demand analysis for any stock — covering price action, fundamentals, analyst outlook, and risk factors — powered by a large language model integrated into the platform.',
  },
  {
    icon: Newspaper,
    title: 'Financial News',
    description:
      'Browse the latest market news and save articles to your personal reading list. A saved-articles tab lets you revisit key stories any time.',
  },
  {
    icon: MessageSquare,
    title: 'Community Discussion',
    description:
      'Join ticker-specific discussion threads to share analysis, ask questions, and read what other investors are saying about the stocks you follow.',
  },
  {
    icon: Lightbulb,
    title: 'Investment Tips',
    description:
      'A curated tips section covering fundamental and technical concepts — from reading price action to managing risk — to help you build a stronger investing foundation.',
  },
  {
    icon: Globe2,
    title: 'Interactive Tutorials',
    description:
      'Every major chart and table has a built-in tutorial popup explaining what it shows, how to read it, and what to watch out for — so the platform is approachable for investors at every level.',
  },
  {
    icon: Shield,
    title: 'Secure Accounts',
    description:
      'JWT-based authentication keeps your portfolio data and saved content private. Register and log in to unlock the full feature set across all pages.',
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">About StockVisor</h2>
        <p className="text-slate-600 dark:text-gray-400">
          A full-stack investment intelligence platform built to help you monitor markets, manage your portfolio, and make more informed decisions.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-[#2ebd85]">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Our Mission</h3>
        <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
          StockVisor was built to close the gap between raw market data and actionable insight. We combine real-time prices, AI-driven analysis, community discussion, and portfolio tracking into a single, cohesive platform — so you spend less time switching tools and more time making informed investment decisions.
        </p>
      </div>

      {/* Features grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Platform Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-gray-700 hover:border-[#2ebd85] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edfaf4] dark:bg-[#114832]/40">
                  <Icon className="h-5 w-5 text-[#2ebd85]" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Built With</h3>
        <div className="flex flex-wrap gap-2">
          {['React 19', 'Vite', 'Tailwind CSS v4', 'Chart.js', 'Recharts', 'React Google Charts', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'JWT Auth'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#edfaf4] dark:bg-[#114832]/40 text-[#2ebd85] border border-[#2ebd85]/40"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-linear-to-r from-[#2ebd85] to-[#26a070] rounded-xl p-8 shadow-sm text-white">
        <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
        <p className="text-white/80 mb-5">
          Create a free account to unlock the full platform — portfolio tracking, AI insights, saved news, and community discussion.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-100 text-[#2ebd85] font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-2.5 rounded-lg border border-white/30 transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

