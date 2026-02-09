<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import type { PresensiItem } from '$lib/types/all_types';

	Chart.register(...registerables);

	let canvas = $state<HTMLCanvasElement>();
	let chart: Chart | null = null;
	let totalSiswa = $state(0);

	function buildChart(items: PresensiItem[]) {
		if (!canvas) return;
		if (chart) chart.destroy();

		let hadir = 0, izin = 0, sakit = 0, alpa = 0;
		for (const item of items) {
			if (item.presensi === 'I') izin++;
			else if (item.presensi === 'S') sakit++;
			else if (item.presensi === 'A') alpa++;
			else hadir++;
		}
		totalSiswa = items.length;

		chart = new Chart(canvas, {
			type: 'doughnut',
			data: {
				labels: ['Hadir', 'Izin', 'Sakit', 'Alpa'],
				datasets: [
					{
						data: [hadir, izin, sakit, alpa],
						backgroundColor: [
							'rgba(34, 197, 94, 0.8)',
							'rgba(250, 204, 21, 0.8)',
							'rgba(239, 68, 68, 0.8)',
							'rgba(148, 163, 184, 0.8)'
						],
						borderColor: [
							'rgba(34, 197, 94, 1)',
							'rgba(250, 204, 21, 1)',
							'rgba(239, 68, 68, 1)',
							'rgba(148, 163, 184, 1)'
						],
						borderWidth: 2,
						hoverOffset: 6
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				cutout: '60%',
				animation: { animateRotate: true, duration: 800, easing: 'easeOutQuart' },
				plugins: {
					legend: {
						position: 'bottom',
						labels: {
							color: '#e2e8f0',
							padding: 16,
							usePointStyle: true,
							pointStyle: 'circle',
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
						padding: 10,
						callbacks: {
							label: (ctx) => {
								const val = ctx.parsed;
								const pct = totalSiswa > 0 ? ((val / totalSiswa) * 100).toFixed(1) : '0';
								return ` ${ctx.label}: ${val} (${pct}%)`;
							}
						}
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
				requestAnimationFrame(() => buildChart(result.data));
			}
		} catch (error) {
			console.error('Error fetching presensi for doughnut:', error);
		}
	}

	onMount(() => {
		fetchAndBuild();
		return () => { if (chart) chart.destroy(); };
	});
</script>

<div class="flex h-full flex-col p-5">
	<div class="mb-3 flex items-center space-x-2">
		<div class="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
		<h3 class="text-base font-bold text-white">Distribusi Kehadiran</h3>
	</div>
	<div class="relative flex-1">
		<canvas bind:this={canvas}></canvas>
		{#if totalSiswa > 0}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center pb-10">
				<div class="text-center">
					<p class="text-4xl font-bold text-white">{totalSiswa}</p>
					<p class="text-sm text-white/50">Total Siswa</p>
				</div>
			</div>
		{/if}
	</div>
</div>
