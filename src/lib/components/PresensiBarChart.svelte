<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import type { PresensiItem, PresensiStats } from '$lib/types/all_types';

	Chart.register(...registerables);

	let canvas = $state<HTMLCanvasElement>();
	let chart: Chart | null = null;
	let stats = $state<PresensiStats[]>([]);

	function computeStats(items: PresensiItem[]): PresensiStats[] {
		const map = new Map<string, PresensiStats>();
		for (const item of items) {
			let s = map.get(item.nama_kelas);
			if (!s) {
				s = { kelas: item.nama_kelas, hadir: 0, izin: 0, sakit: 0, alpa: 0, total: 0 };
				map.set(item.nama_kelas, s);
			}
			s.total++;
			if (item.presensi === 'I') s.izin++;
			else if (item.presensi === 'S') s.sakit++;
			else if (item.presensi === 'A') s.alpa++;
			else s.hadir++;
		}
		return Array.from(map.values()).slice(0, 8);
	}

	function buildChart(data: PresensiStats[]) {
		if (!canvas) return;
		if (chart) chart.destroy();

		chart = new Chart(canvas, {
			type: 'bar',
			data: {
				labels: data.map((s) => s.kelas),
				datasets: [
					{
						label: 'Hadir',
						data: data.map((s) => s.hadir),
						backgroundColor: 'rgba(34, 197, 94, 0.7)',
						borderColor: 'rgba(34, 197, 94, 1)',
						borderWidth: 1,
						borderRadius: 4
					},
					{
						label: 'Izin',
						data: data.map((s) => s.izin),
						backgroundColor: 'rgba(250, 204, 21, 0.7)',
						borderColor: 'rgba(250, 204, 21, 1)',
						borderWidth: 1,
						borderRadius: 4
					},
					{
						label: 'Sakit',
						data: data.map((s) => s.sakit),
						backgroundColor: 'rgba(239, 68, 68, 0.7)',
						borderColor: 'rgba(239, 68, 68, 1)',
						borderWidth: 1,
						borderRadius: 4
					},
					{
						label: 'Alpa',
						data: data.map((s) => s.alpa),
						backgroundColor: 'rgba(148, 163, 184, 0.7)',
						borderColor: 'rgba(148, 163, 184, 1)',
						borderWidth: 1,
						borderRadius: 4
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				animation: { duration: 800, easing: 'easeOutQuart' },
				plugins: {
						legend: {
						position: 'bottom',
						labels: {
							color: '#e2e8f0',
							padding: 16,
							usePointStyle: true,
							pointStyle: 'rectRounded',
							font: { size: 14 }
						}
					},
					tooltip: {
						backgroundColor: 'rgba(15, 23, 42, 0.9)',
						titleColor: '#e2e8f0',
						bodyColor: '#cbd5e1',
						borderColor: 'rgba(99, 102, 241, 0.3)',
						borderWidth: 1,
						cornerRadius: 8,
						padding: 10
					}
				},
				scales: {
					x: {
						stacked: true,
						ticks: { color: '#cbd5e1', font: { size: 13 } },
						grid: { display: false }
					},
					y: {
						stacked: true,
						beginAtZero: true,
						ticks: { color: '#cbd5e1', font: { size: 13 }, stepSize: 1 },
						grid: { color: 'rgba(203, 213, 225, 0.08)' }
					}
				}
			}
		});
	}

	async function fetchAndBuild() {
		try {
			const response = await fetch('/api/livesiswa');
			const result = await response.json();
			if (result?.data) {
				stats = computeStats(result.data);
				requestAnimationFrame(() => buildChart(stats));
			}
		} catch (error) {
			console.error('Error fetching presensi for chart:', error);
		}
	}

	onMount(() => {
		fetchAndBuild();
		return () => { if (chart) chart.destroy(); };
	});
</script>

<div class="flex h-full flex-col p-5">
	<div class="mb-3 flex items-center space-x-2">
		<div class="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
		<h3 class="text-base font-bold text-white">Rekap Presensi per Kelas</h3>
	</div>
	<div class="relative flex-1">
		<canvas bind:this={canvas}></canvas>
	</div>
</div>
