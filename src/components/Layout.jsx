// src/components/Layout.jsx
import { Link, Outlet } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
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
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded border border-blue-400 hover:bg-blue-400 hover:text-white dark:hover:bg-blue-500 transition"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
            <Link
              to="/portfolio"
              className="text-4xl hover:border-blue-400 border-2 border-transparent rounded-full"
            >
              <MdAccountCircle />
            </Link>
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
            <Link to="/about" className="hover:text-blue-400 text-lg transition-colors font-medium text-slate-900 dark:text-white">
              About
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
