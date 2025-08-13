<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import 'chartjs-adapter-date-fns';

	Chart.register(...registerables);

	let { 
		title = 'Dashboard Chart', 
		chartType = 'line', 
		data = null 
	}: {
		title?: string;
		chartType?: 'line' | 'bar' | 'doughnut' | 'pie';
		data?: any;
	} = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	async function fetchDummyData() {
		try {
			const response = await fetch('https://dummyjson.com/products?limit=10');
			const result = await response.json();
			
			// Convert products data to chart data based on the actual API structure
			const chartData = {
				labels: result.products.map((p: any) => p.title.length > 20 ? p.title.slice(0, 20) + '...' : p.title),
				datasets: [
					{
						label: 'Price ($)',
						data: result.products.map((p: any) => p.price),
						backgroundColor: [
							'rgba(99, 102, 241, 0.8)',   // indigo
							'rgba(139, 92, 246, 0.8)',   // violet
							'rgba(59, 130, 246, 0.8)',   // blue
							'rgba(16, 185, 129, 0.8)',   // emerald
							'rgba(245, 158, 11, 0.8)',   // amber
							'rgba(239, 68, 68, 0.8)',    // red
							'rgba(236, 72, 153, 0.8)',   // pink
							'rgba(6, 182, 212, 0.8)',    // cyan
							'rgba(34, 197, 94, 0.8)',    // green
							'rgba(168, 85, 247, 0.8)'    // purple
						],
						borderColor: [
							'rgba(99, 102, 241, 1)',
							'rgba(139, 92, 246, 1)',
							'rgba(59, 130, 246, 1)',
							'rgba(16, 185, 129, 1)',
							'rgba(245, 158, 11, 1)',
							'rgba(239, 68, 68, 1)',
							'rgba(236, 72, 153, 1)',
							'rgba(6, 182, 212, 1)',
							'rgba(34, 197, 94, 1)',
							'rgba(168, 85, 247, 1)'
						],
						borderWidth: 2,
						tension: 0.4,
						hoverBorderWidth: 3,
						hoverBackgroundColor: [
							'rgba(99, 102, 241, 0.9)',
							'rgba(139, 92, 246, 0.9)',
							'rgba(59, 130, 246, 0.9)',
							'rgba(16, 185, 129, 0.9)',
							'rgba(245, 158, 11, 0.9)',
							'rgba(239, 68, 68, 0.9)',
							'rgba(236, 72, 153, 0.9)',
							'rgba(6, 182, 212, 0.9)',
							'rgba(34, 197, 94, 0.9)',
							'rgba(168, 85, 247, 0.9)'
						]
					}
				]
			};
			return chartData;
		} catch (error) {
			console.error('Error fetching dummy data:', error);
			return {
				labels: ['No Data Available'],
				datasets: [
					{
						label: 'No Data',
						data: [0],
						backgroundColor: ['rgba(148, 163, 184, 0.6)'],
						borderColor: ['rgba(148, 163, 184, 1)'],
						borderWidth: 2
					}
				]
			};
		}
	}

	function createChart(chartData: any) {
		const config = {
			type: chartType,
			data: chartData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: !!title,
						text: title,
						color: '#e2e8f0',
						font: {
							size: 12,
							weight: 'bold'
						}
					},
					legend: {
						position: 'bottom',
						labels: {
							color: '#e2e8f0',
							padding: 8,
							usePointStyle: true,
							pointStyle: 'circle',
							font: {
								size: 9
							}
						}
					},
					tooltip: {
						backgroundColor: 'rgba(15, 23, 42, 0.9)',
						titleColor: '#e2e8f0',
						bodyColor: '#cbd5e1',
						borderColor: 'rgba(99, 102, 241, 0.5)',
						borderWidth: 1,
						cornerRadius: 6,
						displayColors: true,
						padding: 8
					}
				},
				scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
					x: {
						ticks: {
							color: '#cbd5e1',
							font: {
								size: 9
							}
						},
						grid: {
							color: 'rgba(203, 213, 225, 0.1)',
							borderColor: 'rgba(203, 213, 225, 0.2)'
						}
					},
					y: {
						ticks: {
							color: '#cbd5e1',
							font: {
								size: 9
							}
						},
						grid: {
							color: 'rgba(203, 213, 225, 0.1)',
							borderColor: 'rgba(203, 213, 225, 0.2)'
						}
					}
				} : {},
				animation: {
					animateRotate: true,
					animateScale: true,
					duration: 1200,
					easing: 'easeInOutQuart'
				},
				interaction: {
					intersect: false,
					mode: 'index'
				}
			}
		};
		
		// @ts-ignore
		chart = new Chart(canvas, config);
	}

	async function initializeChart() {
		let chartData;
		
		if (data) {
			chartData = data;
		} else {
			chartData = await fetchDummyData();
		}
		
		createChart(chartData);
	}

	onMount(() => {
		if (data) {
			createChart(data);
		} else {
			initializeChart();
		}

		return () => {
			if (chart) {
				chart.destroy();
			}
		};
	});
</script>

<div class="w-full h-full relative">
	<canvas bind:this={canvas} class="drop-shadow-lg"></canvas>
</div>
