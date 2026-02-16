import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Community from './pages/Community'
import News from './pages/News'
import Tips from './pages/Tips'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-2 px-4 py-4">
        <div className="flex items-center">
          <h1 className="text-4xl font-bold text-blue-400">StockVisor</h1>
        </div>
      </div>
      <nav className="bg-slate-800 border-b-2 border-blue-600 shadow-lg">
        <ul className="flex gap-8 px-6 py-3">
          <li>
            <Link to="/" className="hover:text-blue-400 text-lg transition-colors font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-400 text-lg transition-colors font-medium">
              About
            </Link>
          </li>
          <li>
            <Link to="/portfolio" className="hover:text-blue-400 text-lg transition-colors font-medium">
              Portfolio
            </Link>
          </li>
          <li>
            <Link to="/community" className="hover:text-blue-400 text-lg transition-colors font-medium">
              Community
            </Link>
          </li>
          <li>
            <Link to="/news" className="hover:text-blue-400 text-lg transition-colors font-medium">
              News
            </Link>
          </li>
          <li>
            <Link to="/tips" className="hover:text-blue-400 text-lg transition-colors font-medium">
              Tips
            </Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/community" element={<Community />} />
        <Route path="/news" element={<News />} />
        <Route path="/tips" element={<Tips />} />
      </Routes>
    </div>
  )
}

export default App
