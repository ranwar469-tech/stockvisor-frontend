import React, { useState, useEffect } from 'react';

const getTileColor = (change) => {
    if (change >= 3)   return '#15803d';
    if (change >= 1.5) return '#16a34a';
    if (change >= 0.5) return '#22c55e';
    if (change > 0)    return '#4ade80';
    if (change > -0.5) return '#f87171';
    if (change > -1.5) return '#ef4444';
    if (change > -3)   return '#dc2626';
    return '#b91c1c';
};

const StockHeatmap = () => {
    const [sectors, setSectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHeatmapData = async () => {
            try {
                const response = await fetch('http://localhost:8000/heatmap');
                const flatData = await response.json();

                const sectorNames = [...new Set(flatData.map(item => item.sector))];
                const grouped = sectorNames.map(name => {
                    const stocks = flatData.filter(item => item.sector === name);
                    const totalMcap = stocks.reduce((sum, s) => sum + (s.mcap || 0), 0);
                    return { name, stocks, totalMcap };
                });

                grouped.sort((a, b) => b.totalMcap - a.totalMcap);
                setSectors(grouped);
            } catch (err) {
                console.error('Error loading heatmap data:', err);
                setError('Failed to load heatmap data.');
            } finally {
                setLoading(false);
            }
        };
        fetchHeatmapData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-900 rounded-xl">
                <div className="text-blue-400 animate-pulse text-sm font-semibold">
                    Fetching Market Data...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-900 rounded-xl">
                <div className="text-red-400 text-sm">{error}</div>
            </div>
        );
    }

    const totalMcap = sectors.reduce((sum, s) => sum + s.totalMcap, 0);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-gray-900 rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center px-3 pt-3 pb-2 shrink-0">
                <h2 className="text-white text-sm font-bold">Sector Performance</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#dc2626' }}></span>
                    <span>−</span>
                    <span className="w-2.5 h-2.5 rounded-sm bg-gray-700"></span>
                    <span>0</span>
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#16a34a' }}></span>
                    <span>+</span>
                </div>
            </div>

            {/* Treemap body */}
            <div className="flex-1 overflow-hidden p-1.5 flex flex-wrap gap-1 content-start">
                {sectors.map(sector => {
                    const sectorPct = totalMcap > 0
                        ? Math.max((sector.totalMcap / totalMcap) * 100, 12)
                        : 12;

                    return (
                        <div
                            key={sector.name}
                            className="overflow-hidden rounded border border-gray-700"
                            style={{ flexBasis: `calc(${sectorPct}% - 4px)`, flexGrow: 1 }}
                        >
                            <div className="bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300 font-semibold truncate">
                                {sector.name}
                            </div>
                            <div className="flex flex-wrap gap-px p-px">
                                {sector.stocks
                                    .slice()
                                    .sort((a, b) => (b.mcap || 0) - (a.mcap || 0))
                                    .map(stock => {
                                        const tilePct = sector.totalMcap > 0
                                            ? Math.max((stock.mcap / sector.totalMcap) * 100, 18)
                                            : 18;
                                        const bg = getTileColor(stock.change ?? 0);
                                        const changeStr = stock.change != null
                                            ? `${stock.change > 0 ? '+' : ''}${Number(stock.change).toFixed(2)}%`
                                            : '—';
                                        return (
                                            <div
                                                key={stock.stock}
                                                title={`${stock.stock}: ${changeStr}\nMcap: $${stock.mcap ? (stock.mcap / 1e9).toFixed(1) + 'B' : 'N/A'}`}
                                                className="flex flex-col items-center justify-center rounded-sm cursor-default overflow-hidden px-0.5 py-1"
                                                style={{
                                                    flexBasis: `calc(${tilePct}% - 2px)`,
                                                    flexGrow: 1,
                                                    background: bg,
                                                    minWidth: '36px',
                                                    minHeight: '36px',
                                                }}
                                            >
                                                <span className="text-white font-bold leading-tight text-xs truncate w-full text-center">
                                                    {stock.stock}
                                                </span>
                                                <span className="text-white/80 leading-tight text-xs truncate w-full text-center">
                                                    {changeStr}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StockHeatmap;