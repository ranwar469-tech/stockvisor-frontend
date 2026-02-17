// import { useState } from 'react';
// import { TrendingUp, TrendingDown, MessageSquare, Sparkles, X, BarChart3, DollarSign, Activity, Moon, Sun, User, Star } from 'lucide-react';
// /*import { Portfolio } from './Portfolio';*/

// interface Stock {
//   symbol: string;
//   name: string;
//   price: number;
//   change: number;
//   changePercent: number;
//   volume: string;
//   isFavorite?: boolean;
// }

// function App() {
//   const [showAIInsights, setShowAIInsights] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [activeTab, setActiveTab] = useState('all');
//   const [favorites, setFavorites] = useState<string[]>([]);
//   const [currentPage, setCurrentPage] = useState<'dashboard' | 'portfolio'>('dashboard');

//   const stocks: Stock[] = [
//     { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: 1.33, volume: '52.3M' },
//     { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -1.20, changePercent: -0.84, volume: '28.7M' },
//     { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 5.67, changePercent: 1.52, volume: '31.2M' },
//     { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: 3.21, changePercent: 2.16, volume: '45.8M' },
//     { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: -4.15, changePercent: -1.68, volume: '89.4M' },
//     { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 722.48, change: 12.30, changePercent: 1.73, volume: '38.9M' },
//   ];

//   const marketStats = [
//     { label: 'Market Cap', value: '$45.2T', icon: DollarSign },
//     { label: 'Total Volume', value: '286.3M', icon: Activity },
//     { label: 'Active Stocks', value: '6,247', icon: BarChart3 },
//   ];

//   const navItems = ['Home','Portfolio', 'Community', 'News', 'Tips'];

//   const toggleFavorite = (symbol: string) => {
//     setFavorites(prev =>
//       prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
//     );
//   };

//   const filteredStocks = activeTab === 'favorites'
//     ? stocks.filter(s => favorites.includes(s.symbol))
//     : stocks;

//   const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100';
//   const headerBgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200';
//   const textPrimaryClass = darkMode ? 'text-white' : 'text-slate-900';
//   const textSecondaryClass = darkMode ? 'text-gray-400' : 'text-slate-600';
//   const cardBgClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200';
//   const tableBgClass = darkMode ? 'bg-gray-700' : 'bg-slate-50';
//   const tableHoverClass = darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50';

//   return (
//     <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
//       <header className={`${headerBgClass} border-b shadow-sm transition-colors duration-300`}>
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center space-x-3">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <TrendingUp className="w-6 h-6 text-white" />
//               </div>
//               <h1 className={`text-2xl font-bold ${textPrimaryClass}`}>StockVisor</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`p-2 rounded-lg transition-colors ${
//                   darkMode
//                     ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
//                     : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
//                 }`}
//               >
//                 {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//               </button>
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfile(!showProfile)}
//                   className={`p-2 rounded-lg transition-colors ${
//                     darkMode
//                       ? 'bg-gray-700 text-blue-400 hover:bg-gray-600'
//                       : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
//                   }`}
//                 >
//                   <User className="w-5 h-5" />
//                 </button>
//                 {showProfile && (
//                   <div className={`absolute right-0 mt-2 w-48 ${cardBgClass} rounded-lg shadow-lg border p-4 z-40`}>
//                     <div className="space-y-3">
//                       <div className={`text-sm font-semibold ${textPrimaryClass}`}>User Profile</div>
//                       <div className={`text-xs ${textSecondaryClass}`}>john.doe@example.com</div>
//                       <hr className={darkMode ? 'border-gray-600' : 'border-slate-200'} />
//                       <button className={`text-sm w-full text-left py-2 ${textSecondaryClass} hover:text-blue-600 transition-colors`}>Settings</button>
//                       <button className={`text-sm w-full text-left py-2 ${textSecondaryClass} hover:text-blue-600 transition-colors`}>Preferences</button>
//                       <button className={`text-sm w-full text-left py-2 ${textSecondaryClass} hover:text-blue-600 transition-colors`}>Logout</button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <nav className="flex items-center space-x-8">
//             {navItems.map((item) => {
//               const isActive = (item === 'Portfolio' && currentPage === 'portfolio') || (item === 'Portfolio' && currentPage === 'dashboard');
//               return (
//                 <button
//   key={item}
//   onClick={() => {
//     if (item === 'Home') {
//       setCurrentPage('dashboard');
//     } else if (item === 'Portfolio') {
//       setCurrentPage('portfolio');
//     }
//   }}
//   className={`text-sm font-medium transition-colors ${
//     // Check if the current state matches the item to highlight it
//     (item === 'Home' && currentPage === 'dashboard') || (item === 'Portfolio' && currentPage === 'portfolio')
//       ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
//       : `hover:text-blue-600 ${textSecondaryClass}`
//   }`}
// >
//   {item}
// </button>
//               );
//             })}
//           </nav>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {currentPage === 'portfolio' ? (
//           <Portfolio darkMode={darkMode} />
//         ) : (
//           <>
//         <div className="mb-8">
//           <h2 className={`text-3xl font-bold ${textPrimaryClass} mb-2`}>Market Dashboard</h2>
//           <p className={textSecondaryClass}>Real-time stock prices and market insights at your fingertips</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {marketStats.map((stat) => (
//             <div
//               key={stat.label}
//               className={`${cardBgClass} rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow`}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className={`text-sm ${textSecondaryClass} mb-1`}>{stat.label}</p>
//                   <p className={`text-2xl font-bold ${textPrimaryClass}`}>{stat.value}</p>
//                 </div>
//                 <div className={darkMode ? 'bg-gray-700 p-3 rounded-lg' : 'bg-blue-50 p-3 rounded-lg'}>
//                   <stat.icon className={darkMode ? 'w-6 h-6 text-blue-400' : 'w-6 h-6 text-blue-600'} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className={`${cardBgClass} rounded-xl shadow-sm border overflow-hidden transition-colors duration-300`}>
//           <div className={`px-6 py-4 border-b ${tableBgClass} flex items-center space-x-4`}>
//             <button
//               onClick={() => setActiveTab('all')}
//               className={`pb-2 px-4 font-medium transition-colors border-b-2 ${
//                 activeTab === 'all'
//                   ? 'border-blue-600 text-blue-600'
//                   : `border-transparent ${textSecondaryClass} hover:text-blue-600`
//               }`}
//             >
//               All Stocks
//             </button>
//             <button
//               onClick={() => setActiveTab('favorites')}
//               className={`pb-2 px-4 font-medium transition-colors border-b-2 flex items-center space-x-2 ${
//                 activeTab === 'favorites'
//                   ? 'border-blue-600 text-blue-600'
//                   : `border-transparent ${textSecondaryClass} hover:text-blue-600`
//               }`}
//             >
//               <Star className="w-4 h-4" />
//               <span>Favorites</span>
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className={`${tableBgClass} border-b ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}>
//                 <tr>
//                   <th className={`px-6 py-3 text-left text-xs font-semibold ${textSecondaryClass} uppercase tracking-wider w-12`}></th>
//                   <th className={`px-6 py-3 text-left text-xs font-semibold ${textSecondaryClass} uppercase tracking-wider`}>Symbol</th>
//                   <th className={`px-6 py-3 text-left text-xs font-semibold ${textSecondaryClass} uppercase tracking-wider`}>Company</th>
//                   <th className={`px-6 py-3 text-right text-xs font-semibold ${textSecondaryClass} uppercase tracking-wider`}>Price</th>
//                   <th className={`px-6 py-3 text-right text-xs font-semibold ${textSecondaryClass} uppercase tracking-wider`}>Change</th>
//                   <th className={`px-6 py-3 text-right text-xs font-semibold ${textSecondaryClass} uppercase tracking-wider`}>Volume</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-200'}`}>
//                 {filteredStocks.map((stock) => (
//                   <tr key={stock.symbol} className={`${tableHoverClass} transition-colors`}>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => toggleFavorite(stock.symbol)}
//                         className={`transition-colors ${
//                           favorites.includes(stock.symbol)
//                             ? 'text-yellow-500'
//                             : textSecondaryClass
//                         }`}
//                       >
//                         <Star
//                           className={`w-4 h-4 ${
//                             favorites.includes(stock.symbol) ? 'fill-current' : ''
//                           }`}
//                         />
//                       </button>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`font-bold ${textPrimaryClass}`}>{stock.symbol}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={textSecondaryClass}>{stock.name}</span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className={`font-semibold ${textPrimaryClass}`}>${stock.price.toFixed(2)}</span>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <div className="flex items-center justify-end space-x-1">
//                         {stock.change >= 0 ? (
//                           <>
//                             <TrendingUp className="w-4 h-4 text-blue-600" />
//                             <span className="font-semibold text-blue-600">
//                               +${Math.abs(stock.change).toFixed(2)} ({stock.changePercent}%)
//                             </span>
//                           </>
//                         ) : (
//                           <>
//                             <TrendingDown className="w-4 h-4 text-rose-600" />
//                             <span className="font-semibold text-rose-600">
//                               -${Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent)}%)
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-right">
//                       <span className={textSecondaryClass}>{stock.volume}</span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//           </>
//         )}
//       </main>

//       <button
//         onClick={() => setShowAIInsights(true)}
//         className="fixed bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 group"
//       >
//         <Sparkles  className="w-6 h-6" />
//         <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
//           AI Insights
//         </span>
//       </button>

//       {showAIInsights && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className={`${cardBgClass} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden transition-colors duration-300`}>
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-white bg-opacity-20 p-2 rounded-lg">
//                   <MessageSquare className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-xl font-bold text-white">AI Market Insights</h3>
//               </div>
//               <button
//                 onClick={() => setShowAIInsights(false)}
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
//               <div className="space-y-4">
//                 <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 transition-colors duration-300`}>
//                   <h4 className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-900'} mb-2`}>Market Overview</h4>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-slate-700'} leading-relaxed`}>
//                     The market is showing positive momentum with tech stocks leading the rally.
//                     NVDA and MSFT are showing strong gains, indicating investor confidence in the AI sector.
//                   </p>
//                 </div>

//                 <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 transition-colors duration-300`}>
//                   <h4 className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-900'} mb-2`}>Top Performers</h4>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-slate-700'} leading-relaxed`}>
//                     Amazon (AMZN) leads with +2.16% gain, followed by NVIDIA at +1.73%.
//                     Strong consumer confidence and AI infrastructure demand are key drivers.
//                   </p>
//                 </div>

//                 <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-amber-50 border-amber-200'} border rounded-lg p-4 transition-colors duration-300`}>
//                   <h4 className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-900'} mb-2`}>Watch List</h4>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-slate-700'} leading-relaxed`}>
//                     Tesla (TSLA) is down -1.68% today. Monitor for potential entry points if it
//                     continues to correct. Google shows slight weakness at -0.84%.
//                   </p>
//                 </div>

//                 <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-slate-50 border-slate-200'} border rounded-lg p-4 transition-colors duration-300`}>
//                   <h4 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-slate-900'} mb-2`}>AI Recommendation</h4>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-slate-700'} leading-relaxed`}>
//                     Consider diversifying your portfolio across sectors. Current market conditions
//                     favor growth stocks, particularly in technology and AI infrastructure.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
