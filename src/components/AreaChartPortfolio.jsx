import { useMemo } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const getHoldingDate = (holding) => {
	const rawDate =
		holding.purchaseDate ||
		holding.purchase_date ||
		holding.createdAt ||
		holding.created_at ||
		holding.dateAdded ||
		holding.date_added;

	if (!rawDate) return null;
	const parsed = new Date(rawDate);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function AreaChartPortfolio({ holdings = [] }) {
	const chartState = useMemo(() => {
		const safeHoldings = Array.isArray(holdings) ? holdings : [];

		if (!safeHoldings.length) {
			return {
				labels: [],
				investedValues: [],
				currentValues: [],
				profitGapValues: [],
				lossGapValues: [],
			};
		}

		const timeline = safeHoldings
			.map((holding, index) => ({
				...holding,
				timelineDate: getHoldingDate(holding),
				fallbackIndex: index,
			}))
			.sort((first, second) => {
				if (first.timelineDate && second.timelineDate) {
					return first.timelineDate - second.timelineDate;
				}
				if (first.timelineDate) return -1;
				if (second.timelineDate) return 1;
				return first.fallbackIndex - second.fallbackIndex;
			});

		const hasDates = timeline.some((holding) => holding.timelineDate);

		let runningInvested = 0;
		let runningCurrent = 0;

		const labels = [];
		const investedValues = [];
		const currentValues = [];

		timeline.forEach((holding, index) => {
			const quantity = Number(holding.quantity || 0);
			const purchasePrice = Number(holding.purchasePrice || holding.purchase_price || 0);
			const currentPrice = Number(holding.currentPrice || holding.current_price || 0);

			runningInvested += quantity * purchasePrice;
			runningCurrent += quantity * currentPrice;

			if (hasDates && holding.timelineDate) {
				labels.push(
					holding.timelineDate.toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
					})
				);
			} else {
				labels.push(`Position ${index + 1}`);
			}

			investedValues.push(Number(runningInvested.toFixed(2)));
			currentValues.push(Number(runningCurrent.toFixed(2)));
		});

		const profitGapValues = currentValues.map((value, index) =>
			value >= investedValues[index] ? value : investedValues[index]
		);
		const lossGapValues = currentValues.map((value, index) =>
			value < investedValues[index] ? value : investedValues[index]
		);

		return {
			labels,
			investedValues,
			currentValues,
			profitGapValues,
			lossGapValues,
		};
	}, [holdings]);

	const data = useMemo(
		() => ({
			labels: chartState.labels,
			datasets: [
				{
					label: 'Total Invested',
					data: chartState.investedValues,
					borderColor: '#0f766e',
					backgroundColor: 'transparent',
					pointRadius: 2,
					pointHoverRadius: 4,
					borderWidth: 2,
					tension: 0.25,
				},
				{
					label: 'Profit Zone',
					data: chartState.profitGapValues,
					borderWidth: 0,
					pointRadius: 0,
					fill: 0,
					backgroundColor: 'rgba(46, 189, 133, 0.25)',
				},
				{
					label: 'Loss Zone',
					data: chartState.lossGapValues,
					borderWidth: 0,
					pointRadius: 0,
					fill: 0,
					backgroundColor: 'rgba(244, 63, 94, 0.22)',
				},
				{
					label: 'Current Value',
					data: chartState.currentValues,
					borderColor: '#2ebd85',
					backgroundColor: 'transparent',
					pointRadius: 2,
					pointHoverRadius: 4,
					borderWidth: 2,
					tension: 0.25,
				},
			],
		}),
		[chartState]
	);

	const options = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'bottom',
					labels: {
						filter: (legendItem) => !['Profit Zone', 'Loss Zone'].includes(legendItem.text),
					},
				},
				tooltip: {
					mode: 'index',
					intersect: false,
					callbacks: {
						label: (context) => {
							if (context.dataset.label === 'Profit Zone' || context.dataset.label === 'Loss Zone') {
								return null;
							}
							return `${context.dataset.label}: $${Number(context.parsed.y || 0).toLocaleString()}`;
						},
					},
				},
			},
			scales: {
				y: {
					ticks: {
						callback: (value) => `$${Number(value).toLocaleString()}`,
					},
					grid: {
						color: '#e2e8f0',
					},
				},
				x: {
					grid: {
						display: false,
					},
				},
			},
			interaction: {
				mode: 'index',
				intersect: false,
			},
		}),
		[]
	);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-[#2ebd85] h-full min-h-80">
			<div className="mb-3">
				<h3 className="text-sm font-semibold text-slate-900 dark:text-white">Portfolio Cost vs Market Value</h3>
				<p className="text-xs text-slate-600 dark:text-gray-400">Green gap = profit, red gap = drawdown</p>
			</div>

			{chartState.labels.length > 0 ? (
				<div className="h-64">
					<Line data={data} options={options} />
				</div>
			) : (
				<div className="h-64 flex items-center justify-center text-sm text-slate-500 dark:text-gray-400">
					Add holdings to visualize invested vs current value.
				</div>
			)}
		</div>
	);
}
