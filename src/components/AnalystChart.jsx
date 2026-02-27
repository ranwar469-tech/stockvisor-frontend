import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart } from 'react-google-charts';
import { RefreshCw, Search } from 'lucide-react';
import api from '../services/api';

const BASE_OPTIONS = {
	isStacked: true,
	legend: { position: 'bottom', textStyle: { fontSize: 10, color: '#64748b' } },
	chartArea: { width: '86%', height: '60%' },
	colors: ['#16a34a', '#2ebd85', '#f59e0b', '#f97316', '#ef4444'],
	hAxis: {
		title: 'Date',
		textStyle: { color: '#64748b', fontSize: 10 },
		titleTextStyle: { color: '#64748b', fontSize: 10 },
	},
	vAxis: {
		title: 'Number of Analysts',
		minValue: 0,
		textStyle: { color: '#64748b', fontSize: 10 },
		titleTextStyle: { color: '#64748b', fontSize: 10 },
		gridlines: { color: '#e2e8f0' },
	},
	backgroundColor: 'transparent',
};

export default function AnalystChart({
	recommendationData = [],
	width = 'auto',
	height = '312px',
	defaultSymbol = 'AAPL',
}) {
	const initialRows = Array.isArray(recommendationData)
		? recommendationData
		: recommendationData
			? [recommendationData]
			: [];

	const [rows, setRows] = useState(initialRows);
	const [symbol, setSymbol] = useState(defaultSymbol);
	const [loadingRecs, setLoadingRecs] = useState(false);
	const [error, setError] = useState('');

	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const searchRef = useRef(null);

	useEffect(() => {
		setRows(initialRows);
	}, [recommendationData]);

	useEffect(() => {
		if (!searchQuery.trim()) {
			setSearchResults([]);
			setHasSearched(false);
			setShowDropdown(false);
			return;
		}

		const timer = setTimeout(async () => {
			setSearchLoading(true);
			setHasSearched(true);
			try {
				const { data } = await api.get('/stocks/search', { params: { q: searchQuery.trim() } });
				setSearchResults(Array.isArray(data) ? data : []);
			} catch {
				setSearchResults([]);
			} finally {
				setSearchLoading(false);
				setShowDropdown(true);
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		const handleClick = (event) => {
			if (searchRef.current && !searchRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, []);

	const fetchRecommendations = async (nextSymbol) => {
		setLoadingRecs(true);
		setError('');
		try {
			const { data } = await api.get('/stocks/recommendations', {
				params: { symbol: nextSymbol },
			});
			const payload = data;

			const normalized = Array.isArray(payload)
				? payload
				: payload
					? [payload]
					: [];

			setRows(normalized);
			setSymbol(nextSymbol);
		} catch {
			setError(`Could not load recommendations for ${nextSymbol}`);
		} finally {
			setLoadingRecs(false);
		}
	};

	useEffect(() => {
		if (!defaultSymbol) return;
		fetchRecommendations(defaultSymbol);
	}, [defaultSymbol]);

	const selectSymbol = (nextSymbol) => {
		setShowDropdown(false);
		setSearchQuery('');
		fetchRecommendations(nextSymbol);
	};

	const chartData = useMemo(() => {
		if (!rows.length) return [];

		const sortedRows = [...rows].sort(
			(first, second) => new Date(first.period) - new Date(second.period)
		);
		const recentThreeMonths = sortedRows.slice(-3);

		let normalizedThreeMonths = recentThreeMonths;
		if (recentThreeMonths.length < 3) {
			const template = recentThreeMonths[recentThreeMonths.length - 1] || {
				strongBuy: 10,
				buy: 20,
				hold: 7,
				sell: 2,
				strongSell: 1,
				period: new Date().toISOString().slice(0, 10),
			};

			const baseDate = new Date(template.period);
			const safeBaseDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;

			normalizedThreeMonths = Array.from({ length: 3 }, (_, index) => {
				const monthOffset = 2 - index;
				const periodDate = new Date(safeBaseDate);
				periodDate.setMonth(periodDate.getMonth() - monthOffset);

				return {
					...template,
					period: periodDate.toISOString().slice(0, 10),
				};
			});
		}

		const formatPeriodLabel = (period) => {
			const date = new Date(period);
			if (Number.isNaN(date.getTime())) return period;
			return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
		};

		return [
			['Period', 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'],
			...normalizedThreeMonths.map((item) => [
				formatPeriodLabel(item.period),
				Number(item.strongBuy || 0),
				Number(item.buy || 0),
				Number(item.hold || 0),
				Number(item.sell || 0),
				Number(item.strongSell || 0),
			]),
		];
	}, [rows]);

	const chartOptions = useMemo(
		() => ({
			...BASE_OPTIONS,
			title: symbol ? `${symbol} Recommendations` : 'Recommendation Trends',
			titleTextStyle: { color: '#0f172a', fontSize: 12, bold: true },
		}),
		[symbol]
	);

	return (
		<div
			className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-2"
			style={{ width, height }}
		>
			<div ref={searchRef} className="relative mb-2">
				<Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-gray-400 pointer-events-none" />
				<input
					type="text"
					value={searchQuery}
					onChange={(event) => setSearchQuery(event.target.value)}
					onFocus={() => {
						if (hasSearched) setShowDropdown(true);
					}}
					placeholder="Search stock"
					className="w-full rounded-md border border-[#2ebd85] bg-[#edfaf4] dark:bg-gray-700 pl-7 pr-2 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2ebd85]"
				/>

				{showDropdown && (
					<div className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#2ebd85] bg-white dark:bg-gray-800 shadow-lg z-50">
						{searchLoading ? (
							<div className="flex items-center justify-center py-3 text-xs text-slate-500 dark:text-gray-400">
								<RefreshCw className="w-3 h-3 animate-spin mr-1" /> Searching…
							</div>
						) : searchResults.length === 0 ? (
							<div className="py-3 px-3 text-center text-xs text-rose-500">Stock not found</div>
						) : (
							searchResults.map((item) => (
								<button
									key={item.symbol}
									onClick={() => selectSymbol(item.symbol)}
									className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-[#edfaf4] dark:hover:bg-gray-700 transition-colors"
								>
									<span className="font-bold text-xs text-slate-900 dark:text-white">{item.symbol}</span>
									<span className="text-[11px] text-slate-500 dark:text-gray-400 truncate">{item.name}</span>
								</button>
							))
						)}
					</div>
				)}
			</div>

			{loadingRecs ? (
				<div className="h-65 flex items-center justify-center text-xs text-slate-600 dark:text-gray-400">
					<RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" /> Loading recommendations...
				</div>
			) : error ? (
				<div className="h-65 flex items-center justify-center text-xs text-rose-600 dark:text-rose-400 px-2 text-center">
					{error}
				</div>
			) : !chartData.length ? (
				<div className="h-65 flex items-center justify-center text-xs text-slate-600 dark:text-gray-400">
					No analyst recommendation data available.
				</div>
			) : (
				<Chart
					chartType="ColumnChart"
					width="100%"
					height="260px"
					data={chartData}
					options={chartOptions}
				/>
			)}
		</div>
	);
}
