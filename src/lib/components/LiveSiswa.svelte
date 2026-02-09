<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresensiResponse, PresensiItem } from '$lib/types/all_types.js';

	let {
		scrolledToEnd = $bindable(false)
	} = $props();

	let data = $state<PresensiResponse | null>(null);
	let isLoading = $state(true);
	let scrollWrapper = $state<HTMLDivElement>();
	let scrollInner = $state<HTMLDivElement>();
	let scrollDistance = $state(0);
	let scrollDuration = $state(0);
	let animationState = $state<'down' | 'paused-bottom' | 'up' | 'paused-top'>('paused-top');
	let dateNow = new Date().toLocaleDateString('id-ID', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	let summary = $derived.by(() => {
		if (!data?.data) return { total: 0, hadir: 0, izin: 0, sakit: 0, alpa: 0 };
		let hadir = 0, izin = 0, sakit = 0, alpa = 0;
		for (const item of data.data) {
			if (item.presensi === 'I') izin++;
			else if (item.presensi === 'S') sakit++;
			else if (item.presensi === 'A') alpa++;
			else hadir++;
		}
		return { total: data.data.length, hadir, izin, sakit, alpa };
	});

	const SCROLL_SPEED = 30;
	const PAUSE_DURATION = 3000;

	interface GroupedKelas {
		kelas: string;
		jam: string;
		items: PresensiItem[];
	}

	let grouped = $derived.by(() => {
		if (!data?.data) return [];
		const map = new Map<string, GroupedKelas>();
		for (const item of data.data) {
			const key = `${item.nama_kelas}__${item.jam}`;
			let g = map.get(key);
			if (!g) {
				g = { kelas: item.nama_kelas, jam: item.jam, items: [] };
				map.set(key, g);
			}
			g.items.push(item);
		}
		return Array.from(map.values());
	});

	async function fetchLiveSiswaData() {
		try {
			isLoading = true;
			const response = await fetch('/api/livesiswa');
			data = (await response.json()) as PresensiResponse;
		} catch (error) {
			console.error('Error fetching live siswa data:', error);
			data = null;
		} finally {
			isLoading = false;
		}
	}

	function startScrollCycle() {
		if (!scrollWrapper || !scrollInner) return;
		const dist = scrollInner.scrollHeight - scrollWrapper.clientHeight;
		if (dist <= 0) return;
		scrollDistance = dist;
		scrollDuration = dist / SCROLL_SPEED;
		animationState = 'down';
	}

	function handleAnimationEnd() {
		if (animationState === 'down') {
			scrolledToEnd = true;
			animationState = 'paused-bottom';
			setTimeout(() => {
				animationState = 'up';
			}, PAUSE_DURATION);
		} else if (animationState === 'up') {
			scrolledToEnd = false;
			animationState = 'paused-top';
			setTimeout(() => {
				animationState = 'down';
			}, PAUSE_DURATION);
		}
	}

	onMount(() => {
		fetchLiveSiswaData();
	});

	$effect(() => {
		if (grouped.length > 0 && scrollWrapper && scrollInner) {
			requestAnimationFrame(() => startScrollCycle());
		}
	});
</script>

<div class="relative h-full p-4">
	<!-- Header Section -->
	<section class="relative overflow-hidden">
		<div class="mb-1 flex items-center justify-center space-x-2">
			<h3 class="text-center text-lg font-bold text-white">Data Presensi Siswa</h3>
		</div>
		<p class="mb-3 text-center text-sm text-slate-400">{dateNow}</p>
		{#if summary.total > 0}
			<div class="mb-3 grid grid-cols-5 gap-2 text-center">
				<div class="rounded-lg bg-white/5 px-2 py-1.5">
					<p class="text-lg font-bold text-white">{summary.total}</p>
					<p class="text-xs text-slate-400">Total</p>
				</div>
				<div class="rounded-lg bg-green-500/10 px-2 py-1.5">
					<p class="text-lg font-bold text-green-400">{summary.hadir}</p>
					<p class="text-xs text-green-400/70">Hadir</p>
				</div>
				<div class="rounded-lg bg-yellow-500/10 px-2 py-1.5">
					<p class="text-lg font-bold text-yellow-400">{summary.izin}</p>
					<p class="text-xs text-yellow-400/70">Izin</p>
				</div>
				<div class="rounded-lg bg-red-500/10 px-2 py-1.5">
					<p class="text-lg font-bold text-red-400">{summary.sakit}</p>
					<p class="text-xs text-red-400/70">Sakit</p>
				</div>
				<div class="rounded-lg bg-gray-500/10 px-2 py-1.5">
					<p class="text-lg font-bold text-gray-400">{summary.alpa}</p>
					<p class="text-xs text-gray-400/70">Alpa</p>
				</div>
			</div>
		{/if}
	</section>

	{#if isLoading}
		<div class="space-y-3">
			<div class="grid grid-cols-5 gap-2">
				{#each Array(5) as _}
					<div class="rounded-lg bg-white/5 p-2">
						<div class="h-6 animate-pulse rounded bg-white/10 mb-1"></div>
						<div class="h-3 animate-pulse rounded bg-white/5 w-12 mx-auto"></div>
					</div>
				{/each}
			</div>
			<div class="rounded-xl bg-white/5 p-3 space-y-2">
				{#each Array(8) as _}
					<div class="grid grid-cols-[2fr,1fr,0.5fr] gap-2">
						<div class="h-6 animate-pulse rounded bg-white/5"></div>
						<div class="h-6 animate-pulse rounded bg-white/5"></div>
						<div class="h-6 animate-pulse rounded-full bg-white/5 w-12 mx-auto"></div>
					</div>
				{/each}
			</div>
		</div>
	{:else if grouped.length > 0}
		<div
			bind:this={scrollWrapper}
			class="scroll-viewport relative max-h-[50dvh] overflow-hidden rounded-xl bg-white/5"
		>
			<div
				bind:this={scrollInner}
				class="scroll-content will-change-transform"
				class:scroll-down={animationState === 'down'}
				class:scroll-up={animationState === 'up'}
				style:--scroll-distance="{scrollDistance}px"
				style:--scroll-duration="{scrollDuration}s"
				onanimationend={handleAnimationEnd}
			>
				{#each grouped as group}
					<div class="border-b border-white/10 py-2">
						<div class="flex items-center gap-3 px-4 py-2">
							<span class="text-base font-bold text-teal-300">{group.kelas}</span>
							<span class="text-sm text-slate-500">Jam ke-{group.jam}</span>
							<span class="ml-auto rounded-full bg-teal-500/20 px-2.5 py-0.5 text-sm font-medium text-teal-300">{group.items.length} siswa</span>
						</div>
						<table class="w-full">
							<tbody>
								{#each group.items as item}
									<tr class="border-t border-white/5">
										<td class="py-1.5 pe-2 ps-6 text-base text-white">{item.nama_siswa}</td>
										<td class="px-2 py-1.5 text-sm text-slate-400">{item.mapel}</td>
										<td class="px-2 py-1.5 text-right">
											{#if item.presensi === 'I'}
												<span class="inline-flex items-center rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-0.5 text-sm font-semibold text-yellow-300">Izin</span>
											{:else if item.presensi === 'S'}
												<span class="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/20 px-3 py-0.5 text-sm font-semibold text-red-300">Sakit</span>
											{:else if item.presensi === 'A'}
												<span class="inline-flex items-center rounded-full border border-gray-500/30 bg-gray-500/20 px-3 py-0.5 text-sm font-semibold text-gray-300">Alpa</span>
											{:else}
												<span class="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/20 px-3 py-0.5 text-sm font-semibold text-green-300">Hadir</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<svg class="mb-3 h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<p class="text-sm text-slate-500">Tidak ada data siswa</p>
		</div>
	{/if}
</div>

<style>
	.scroll-content {
		transform: translateY(0);
	}
	.scroll-down {
		animation: scroll-down var(--scroll-duration) linear forwards;
	}
	.scroll-up {
		animation: scroll-up var(--scroll-duration) linear forwards;
	}
	@keyframes scroll-down {
		from { transform: translateY(0); }
		to { transform: translateY(calc(var(--scroll-distance) * -1)); }
	}
	@keyframes scroll-up {
		from { transform: translateY(calc(var(--scroll-distance) * -1)); }
		to { transform: translateY(0); }
	}
</style>
