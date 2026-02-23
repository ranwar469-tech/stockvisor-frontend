// src/components/Layout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { User, MoonIcon, Settings, LogOut, LogIn, Brain, Info } from 'lucide-react';
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import AIInsightsSidebar from './AIInsightsSidebar';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // User avatar: show first letter of username, or default icon
  const avatarLabel = user?.username?.[0]?.toUpperCase() ?? null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <header>
        <div className="mx-auto w-full px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-5xl font-bold text-[#4cc99b]">
            StockVisor
          </Link>
          <div className="flex items-center gap-6 ml-auto">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setUserMenuOpen(prev => !prev)}
                className="hover:border-[#4cc99b] border-2 border-transparent rounded-full p-1 transition-colors text-slate-900 dark:text-white"
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                {avatarLabel ? (
                  <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2ebd85] text-white text-sm font-bold">
                    {avatarLabel}
                  </span>
                ) : (
                  <User size={28} />
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* User info header */}
                  {user && (
                    <>
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.username}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-400 truncate">{user.email}</p>
                      </div>
                    </>
                  )}
                  {user ? (
                    <>
                      <button
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#2ebd85]" />
                        Account Settings
                      </button>
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/about'); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Info className="w-4 h-4 text-[#2ebd85]" />
                        About
                      </button>
                      <div className="border-t border-slate-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/about'); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Info className="w-4 h-4 text-[#2ebd85]" />
                        About
                      </button>
                      <div className="border-t border-slate-200 dark:border-gray-700" />
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate('/login'); }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#2ebd85] hover:bg-[#edfaf4] dark:hover:bg-[#114832]/30 transition-colors font-medium"
                      >
                        <LogIn className="w-4 h-4" />
                        Log In
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className="sr-only peer"
                role="switch"
                aria-checked={theme === 'dark'}
              />
              <div className="w-12 h-7 bg-slate-300 dark:bg-slate-600 rounded-full peer-focus:ring-2 peer-focus:ring-[#80d6b3] dark:peer-focus:ring-[#35cc8e] transition-colors peer-checked:bg-green-500"></div>
              <MoonIcon className="text-yellow-400 absolute left-0.5 top-0.5 w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow transform peer-checked:translate-x-5 transition-transform"/>
            </label>
          </div>
        </div>
      </header>

      <nav className="bg-gray-100 dark:bg-slate-800 border-b-2 border-[#2ebd85] shadow-lg">
        <ul className="flex gap-8 px-6 py-3">
          <li>
            <Link to="/" className="hover:text-[#4cc99b] text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="hover:text-[#4cc99b] text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/community" className="hover:text-[#4cc99b] text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Community
            </Link>
          </li>
          <li>
            <Link to="/news" className="hover:text-[#4cc99b] text-lg transition-colors font-medium text-slate-900 dark:text-white">
              News
            </Link>
          </li>
          <li>
            <Link to="/tips" className="hover:text-[#4cc99b] text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Tips
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-[#4cc99b] text-lg transition-colors font-medium text-slate-900 dark:text-white">
              About
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-grow p-6">
        <Outlet />
      </main>

      {/* AI Insights FAB */}
      <button
        onClick={() => setAiSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#2ebd85] hover:bg-[#26a070] text-white px-4 py-2.5 rounded-full shadow-lg transition-colors"
        aria-label="Open AI Insights"
      >
        <Brain className="w-4 h-4" />
        <span className="text-sm font-semibold">AI Insights</span>
      </button>

      <AIInsightsSidebar open={aiSidebarOpen} onClose={() => setAiSidebarOpen(false)} />

      <footer className="bg-gray-100 dark:bg-slate-800 border-t-2 border-[#2ebd85] shadow-inner py-4 text-center">
        <p className="text-sm text-slate-600 dark:text-gray-400">
          © {new Date().getFullYear()} StockVisor. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Layout;
