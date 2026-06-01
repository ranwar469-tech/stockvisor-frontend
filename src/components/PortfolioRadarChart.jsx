import { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const PortfolioRadarChart = ({ holdings = [] }) => {
  const data = useMemo(() => {
    if (!holdings.length) return [];

    const KNOWN_SECTORS = new Set(['Technology', 'Energy', 'Financial Services', 'Healthcare']);

    const sectorMap = {};
    let grandTotal = 0;

    holdings.forEach((h) => {
      const raw = h.sector?.trim();
      const sector = raw && KNOWN_SECTORS.has(raw) ? raw : 'Other';
      const invested = (h.quantity ?? 0) * (h.purchasePrice ?? 0);
      sectorMap[sector] = (sectorMap[sector] ?? 0) + invested;
      grandTotal += invested;
    });

    if (grandTotal === 0) return [];

    return Object.entries(sectorMap).map(([sector, invested]) => ({
      subject: sector,
      A: parseFloat(((invested / grandTotal) * 100).toFixed(2)),
      fullMark: 100,
    }));
  }, [holdings]);

  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#9ca3af' : '#374151';

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-gray-500 text-sm">
        No sector data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        outerRadius="90%"
        data={data}
        margin={{ top: 10, left: 30, right: 30, bottom: 10 }}
      >
        <PolarGrid stroke="#4b5563" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: tickColor, fontSize: 12, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 'auto']}
          tickCount={5}
          tick={{ fontSize: 9, fill: tickColor }}
          tickFormatter={(v) => `${v}%`}
        />
        <Radar
          name="Allocation"
          dataKey="A"
          stroke="#2ebd85"
          fill="#2ebd85"
          fillOpacity={0.45}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, 'Allocation']}
          contentStyle={{
            backgroundColor: isDark ? '#1f2937' : '#fff',
            border: '1px solid #2ebd85',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PortfolioRadarChart;