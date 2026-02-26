import { useMemo } from 'react';
import { Chart } from 'react-google-charts';

const chartOptions = {
	isStacked: true,
	legend: { position: 'top' },
	chartArea: { width: '75%', height: '70%' },
	colors: ['#16a34a', '#2ebd85', '#f59e0b', '#f97316', '#ef4444'],
	hAxis: {
		minValue: 0,
		textStyle: { color: '#64748b' },
	},
	vAxis: {
		textStyle: { color: '#64748b' },
	},
	backgroundColor: 'transparent',
};

export default function AnalystChart({ recommendationData = [], height = '340px' }) {
	const rows = Array.isArray(recommendationData)
		? recommendationData
		: recommendationData
			? [recommendationData]
			: [];

	const chartData = useMemo(() => {
		if (!rows.length) return [];

		const sortedRows = [...rows].sort(
			(first, second) => new Date(first.period) - new Date(second.period)
		);

		return [
			['Period', 'Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'],
			...sortedRows.map((item) => [
				item.period,
				Number(item.strongBuy || 0),
				Number(item.buy || 0),
				Number(item.hold || 0),
				Number(item.sell || 0),
				Number(item.strongSell || 0),
			]),
		];
	}, [rows]);

	if (!chartData.length) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-6 text-slate-600 dark:text-gray-400">
				No analyst recommendation data available.
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-4">
			<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Recommendation Trends</h3>
			<Chart
				chartType="BarChart"
				width="100%"
				height={height}
				data={chartData}
				options={chartOptions}
			/>
		</div>
	);
}
