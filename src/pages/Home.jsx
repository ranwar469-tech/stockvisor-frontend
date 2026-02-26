import { Activity, BarChart3, Brain } from 'lucide-react';
import TradingViewWidget from '../components/StockWdgets';
import StockHeatmap from '../components/StockHeatmap';
import StocksTable from '../components/StocksTable';
import { useEffect, useState } from 'react';
import api from '../services/api';


export default function Home() {
  const [marketStatus,setMarketStatus]=useState("Loading...");

  useEffect(()=>{
  const fetchMarketStatus = async () => {
    try {
      const response = await api.get('/stocks/status');
      let statusText = response.data.status[0].toUpperCase()+response.data.status.slice(1);
      setMarketStatus(statusText);
    } catch (error) {
      console.error('Failed to fetch market status:', error);
    }
  };
  fetchMarketStatus();
}, []);

  const marketStats = [
    { label: 'Market Sentiment', value: 'Bullish 🔥', icon: Brain },
    { label: 'US Market Status', value: marketStatus, icon: Activity },
    { label: 'Active Stocks', value: '6,247', icon: BarChart3 },
  ];

  return (
    <div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Market Dashboard</h2>
          <span className="text-slate-600 dark:text-slate-400 mb-6 inline-block border-[#2ebd85] border-b-2">Real-time stock prices and market insights at your fingertips</span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" style={{ gridAutoRows: '1fr' }}>
            {/* Market Stats – stacked vertically */}
            <div className="flex flex-col gap-4 mt-2">
              {marketStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-[#2ebd85] dark:border-[#2ebd85] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className="bg-[#edfaf4] dark:bg-gray-700 p-3 rounded-lg">
                      <stat.icon className="w-5 h-5 text-[#2ebd85] dark:text-[#4cc99b]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TradingView Widget – spans 1 cols */}
            <div className="md:col-span-1 p-0.5">
              <div className="bg-slate-50 dark:bg-gray-900 p-1 rounded-lg h-full min-h-80">
                <TradingViewWidget />
              </div>
            </div>

            {/* Heatmap Widget – spans 1 col, same height as siblings */}
            <div className="md:col-span-1 p-0.5">
              <div className="relative overflow-hidden rounded-lg h-full min-h-80 max-h-[28rem]">
                <StockHeatmap />
              </div>
            </div>

          </div>
        </div>
      <StocksTable />
    </div>
  );
}
