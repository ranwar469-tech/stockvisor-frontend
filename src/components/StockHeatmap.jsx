import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import api from '../services/api';

// 1. Theme colors for the Stock Market (Red to Green)
export const options = {
  minColor: "#b91c1c", // Deep Red
  midColor: "#1f2937", // Dark Gray (Neutral)
  maxColor: "#15803d", // Deep Green
  headerHeight: 25,
  headerColor: "#111827",
  fontColor: "#d1d5db",
  showScale: false,
  // Customizing the tooltip to show Stock metrics
  generateTooltip: (row, size, value) => {
    // size was sqrt-compressed, so square it back for display
    const realMcap = size * size;
    return (
      '<div style="background:#1f2937; padding:10px; border: 1px solid #374151; color: white; font-family: sans-serif;">' +
      '<strong>' + row + '</strong><br/>' +
      'Change: ' + value + '%<br/>' +
      'Mcap: $' + (realMcap / 1e9).toFixed(1) + 'B' +
      '</div>'
    );
  },
};

const StockHeatmap = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const { data: flatData } = await api.get('/api/heatmap');

        // 2. Build the Google Charts Array Format
        // Header Row: [ID, Parent, Size, ColorValue]
        const dataForChart = [
          ["ID", "Parent", "Market Cap (size)", "Market Change (color)"],
          ["Market", null, 0, 0], // The Root node
        ];

        // 3. Create Sector nodes
        const sectorNames = [...new Set(flatData.map((item) => item.sector))];
        sectorNames.forEach((sector) => {
          dataForChart.push([sector, "Market", 0, 0]);
        });

        // 4. Create Stock nodes (sqrt compresses huge caps so smaller stocks get readable tiles)
        flatData.forEach((stock) => {
          dataForChart.push([
            stock.stock,                    // Unique ID (Ticker)
            stock.sector,                   // Parent ID (Sector)
            Math.sqrt(stock.mcap || 1),     // Size logic – compressed
            stock.change || 0,              // Color logic
          ]);
        });

        setChartData(dataForChart);
      } catch (err) {
        console.error("Error loading heatmap data:", err);
        setError("Failed to load market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmapData();
  }, []);

  if (loading) return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gray-900 p-3 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h2 className="text-white text-sm font-bold">Market Heatmap</h2>
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="text-blue-400 animate-pulse text-sm font-semibold">Loading Heatmap...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gray-900 p-3 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h2 className="text-white text-sm font-bold">Market Heatmap</h2>
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-gray-900 p-3 rounded-xl border border-gray-800">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <h2 className="text-white text-sm font-bold">Market Heatmap</h2>
        <div className="flex gap-3 text-[10px]">
           <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded-sm"></span><span className="text-gray-400">Loss</span></div>
           <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-600 rounded-sm"></span><span className="text-gray-400">Gain</span></div>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full">
        <Chart
          chartType="TreeMap"
          width="100%"
          height="100%"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default StockHeatmap;