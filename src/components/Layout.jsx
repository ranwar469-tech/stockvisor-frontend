// src/components/Layout.jsx
import { Link, Outlet } from "react-router-dom";
import { User, Sun, Moon } from 'lucide-react';
import { useTheme } from "../hooks/useTheme";

function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <header>
        <div className="mx-auto w-full px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-5xl font-bold text-blue-400">
            StockVisor
          </Link>
          <div className="flex items-center gap-6 ml-auto">
            <Link to="/portfolio" className="text-4xl hover:border-blue-400 border-2 border-transparent rounded-full" >
              <User size={28} />
            </Link>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className="sr-only peer"
                role="switch"
                aria-checked={theme === 'dark'}
              />
              <div className="w-10 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-500 transition-colors peer-checked:bg-green-500 flex items-center justify-between px-1">
                <Sun className="w-3 h-3 text-yellow-400 opacity-100 peer-checked:opacity-0 transition-opacity" />
                <Moon className="w-3 h-3 text-gray-800 dark:text-gray-200 opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <div className="absolute left-0.5 top-1 w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow transform peer-checked:translate-x-4 transition-transform"></div>
            </label>
          </div>
        </div>
      </header>

      <nav className="bg-gray-100 dark:bg-slate-800 border-b-2 border-blue-600 shadow-lg">
        <ul className="flex gap-8 px-6 py-3">
          <li>
            <Link to="/" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/community" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Community
            </Link>
          </li>
          <li>
            <Link to="/news" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              News
            </Link>
          </li>
          <li>
            <Link to="/tips" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              Tips
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              About
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-grow p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-100 dark:bg-slate-800 border-t-2 border-blue-600 shadow-inner py-4 text-center">
        <p className="text-sm text-slate-600 dark:text-gray-400">
          © {new Date().getFullYear()} StockVisor. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Layout;
