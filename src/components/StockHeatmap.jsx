import { useState, useEffect, useMemo, useRef } from "react";
import { Chart } from "react-google-charts";
import api from '../services/api';

const CACHE_KEY = 'stockvisor_heatmap';
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

const StockHeatmap = ({ headerAction = null }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = window.localStorage.getItem("theme");
    return storedTheme ? storedTheme === "dark" : true;
  });
  const cacheCheckDone = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const options = useMemo(() => {
    const tooltipBackground = isDark ? '#1f2937' : '#ffffff';
    const tooltipBorder = isDark ? '#374151' : '#cbd5e1';
    const tooltipText = isDark ? '#ffffff' : '#0f172a';

    return {
      minColor: '#b91c1c',
      midColor: isDark ? '#1f2937' : '#e2e8f0',
      maxColor: '#15803d',
      headerHeight: 25,
      headerColor: isDark ? '#111827' : '#f1f5f9',
      fontColor: isDark ? '#d1d5db' : '#334155',
      showScale: false,
      generateTooltip: (row) => {
        const rowIndex = Number(row);
        const rowData = Number.isFinite(rowIndex) ? chartData[rowIndex + 1] : null;

        const label = rowData?.[0] ?? String(row);
        const parent = rowData?.[1] ?? null;
        const storedSize = Number(rowData?.[2] ?? 0);
        const storedChange = Number(rowData?.[3] ?? 0);

        const isLeafStock = Boolean(parent && parent !== 'Market');
        const displayChange = Number.isFinite(storedChange)
          ? `${storedChange > 0 ? '+' : ''}${storedChange.toFixed(2)}%`
          : '-';
        const realMcap = isLeafStock && Number.isFinite(storedSize)
          ? storedSize * storedSize
          : null;

        return (
          '<div style="background:' + tooltipBackground + '; padding:10px; border:1px solid ' + tooltipBorder + '; color:' + tooltipText + '; font-family:sans-serif;">' +
          '<strong>' + label + '</strong><br/>' +
          'Change: ' + displayChange + '<br/>' +
          (realMcap !== null ? 'Mcap: $' + (realMcap / 1e9).toFixed(1) + 'B' : 'Aggregate Sector') +
          '</div>'
        );
      },
    };
  }, [isDark, chartData]);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      // ── Check sessionStorage cache first ──
      try {
        const cachedRaw = sessionStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const { data: flatData, timestamp } = JSON.parse(cachedRaw);
          if (Date.now() - timestamp < CACHE_TTL) {
            buildChartData(flatData);
            setLoading(false);
            cacheCheckDone.current = true;
            return;
          }
        }
      } catch {
        // Corrupted cache — ignore and fetch fresh
        sessionStorage.removeItem(CACHE_KEY);
      }

      try {
        const { data: flatData } = await api.get('/api/heatmap');

        // Cache the raw API response in sessionStorage
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: flatData, timestamp: Date.now() })
          );
        } catch {
          // sessionStorage full or unavailable — non-critical
        }

        buildChartData(flatData);
      } catch (err) {
        console.error("Error loading heatmap data:", err);
        setError("Failed to load market data.");
      } finally {
        setLoading(false);
        cacheCheckDone.current = true;
      }
    };

    const buildChartData = (flatData) => {
      // Header Row: [ID, Parent, Size, ColorValue]
      const dataForChart = [
        ["ID", "Parent", "Market Cap (size)", "Market Change (color)"],
        ["Market", null, 0, 0], // The Root node
      ];

      // Sector nodes with weighted average change based on market cap
      const sectorStats = flatData.reduce((acc, item) => {
        const sector = item.sector || 'Other';
        const mcap = Number(item.mcap) || 0;
        const change = Number(item.change) || 0;

        if (!acc[sector]) {
          acc[sector] = {
            totalMcap: 0,
            weightedChangeSum: 0,
          };
        }

        acc[sector].totalMcap += mcap;
        acc[sector].weightedChangeSum += change * mcap;
        return acc;
      }, {});

      Object.entries(sectorStats).forEach(([sector, stats]) => {
        const sectorChange = stats.totalMcap > 0 ? stats.weightedChangeSum / stats.totalMcap : 0;
        dataForChart.push([sector, "Market", 0, sectorChange]);
      });

      // Stock nodes (sqrt compresses huge caps so smaller stocks get readable tiles)
      flatData.forEach((stock) => {
        dataForChart.push([
          stock.stock,                    // Unique ID (Ticker)
          stock.sector || 'Other',        // Parent ID (Sector)
          Math.sqrt(stock.mcap || 1),     // Size logic – compressed
          stock.change || 0,              // Color logic
        ]);
      });

      setChartData(dataForChart);
    };

    fetchHeatmapData();
  }, []);

  if (loading) return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-gray-900 p-3 rounded-xl border border-[#2ebd85] dark:border-[#2ebd85]">
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-slate-900 dark:text-white text-sm font-bold">Market Heatmap</h2>
          {headerAction}
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="text-[#2ebd85] animate-pulse text-sm font-semibold">Loading Heatmap...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-gray-900 p-3 rounded-xl border border-[#2ebd85] dark:border-[#2ebd85]">
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-slate-900 dark:text-white text-sm font-bold">Market Heatmap</h2>
          {headerAction}
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        <div className="text-red-400 text-sm">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white dark:bg-gray-900 p-3 rounded-xl border border-[#2ebd85] dark:border-[#2ebd85]">
      <div className="flex justify-between items-center gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-slate-900 dark:text-white text-sm font-bold">Market Heatmap</h2>
          {headerAction}
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-red-400 font-medium">Loss</span>
          <div className="relative flex flex-col items-center gap-0.5">
            {/* Gradient track */}
            <div
              className="w-32 h-2.5 rounded-full"
              style={{ background: 'linear-gradient(to right, #b91c1c, #1f2937, #15803d)' }}
            />
            {/* Tick marks */}
            <div className="w-32 flex justify-between px-0.5">
              <span className="w-px h-1 bg-slate-400 dark:bg-gray-500" />
              <span className="w-px h-1 bg-slate-400 dark:bg-gray-500" />
              <span className="w-px h-1 bg-slate-400 dark:bg-gray-500" />
              <span className="w-px h-1 bg-slate-400 dark:bg-gray-500" />
              <span className="w-px h-1 bg-slate-400 dark:bg-gray-500" />
            </div>
          </div>
          <span className="text-green-400 font-medium">Gain</span>
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