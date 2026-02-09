<script lang="ts">
	import { onMount } from 'svelte';
	import type { PrayerTimesResponse, PrayerTimings } from '$lib/types/all_types';

	let timings = $state<PrayerTimings | null>(null);
	let hijriDate = $state('');
	let nextPrayer = $state('');
	let nextPrayerTime = $state('');
	let countdown = $state('');
	let currentTime = $state('');
	let countdownInterval: ReturnType<typeof setInterval> | null = null;

	const PRAYER_NAMES: Record<string, string> = {
		Fajr: 'Subuh',
		Sunrise: 'Syuruq',
		Dhuhr: 'Dzuhur',
		Asr: 'Ashar',
		Maghrib: 'Maghrib',
		Isha: 'Isya'
	};

	const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

	function timeToMinutes(time: string): number {
		const [h, m] = time.split(':').map(Number);
		return h * 60 + m;
	}

	function updateNextPrayer() {
		if (!timings) return;
		const now = new Date();
		const nowMinutes = now.getHours() * 60 + now.getMinutes();
		currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

		let found = false;
		for (const key of PRAYER_ORDER) {
			const prayerMinutes = timeToMinutes(timings[key]);
			if (nowMinutes < prayerMinutes) {
				nextPrayer = PRAYER_NAMES[key];
				nextPrayerTime = timings[key];
				const diff = prayerMinutes - nowMinutes;
				const hours = Math.floor(diff / 60);
				const mins = diff % 60;
				countdown = hours > 0 ? `${hours}j ${mins}m` : `${mins} menit`;
				found = true;
				break;
			}
		}
		if (!found) {
			nextPrayer = PRAYER_NAMES['Fajr'];
			nextPrayerTime = timings['Fajr'];
			const fajrMinutes = timeToMinutes(timings['Fajr']);
			const diff = (24 * 60 - nowMinutes) + fajrMinutes;
			const hours = Math.floor(diff / 60);
			const mins = diff % 60;
			countdown = `${hours}j ${mins}m`;
		}
	}

	async function fetchPrayerTimes() {
		try {
			const response = await fetch('/api/prayer-times');
			const result = (await response.json()) as PrayerTimesResponse;
			timings = result.data.timings;
			const h = result.data.date.hijri;
			hijriDate = `${h.day} ${h.month.ar} ${h.year}`;
		} catch (error) {
			console.error('Error fetching prayer times:', error);
		}
	}

	onMount(() => {
		fetchPrayerTimes();
		countdownInterval = setInterval(updateNextPrayer, 1000);
		return () => {
			if (countdownInterval) clearInterval(countdownInterval);
		};
	});

	$effect(() => {
		if (timings) updateNextPrayer();
	});
</script>

<div class="flex h-full flex-col p-5">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
			<h3 class="text-base font-bold text-white">Waktu Sholat Yogyakarta</h3>
		</div>
		{#if hijriDate}
			<div class="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-400">{hijriDate}</div>
		{/if}
	</div>

	{#if timings}
		<div class="mb-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 text-center">
			<p class="text-sm uppercase tracking-wider text-emerald-300/80">Sholat Selanjutnya</p>
			<p class="mt-1 text-3xl font-bold text-white">{nextPrayer}</p>
			<p class="text-2xl text-emerald-300">{nextPrayerTime}</p>
			<p class="mt-1 text-base text-white/60">{countdown} lagi</p>
		</div>

		<div class="grid grid-cols-3 gap-3">
			{#each PRAYER_ORDER as key}
				{@const isNext = PRAYER_NAMES[key] === nextPrayer}
				<div
					class="rounded-lg p-3 text-center transition-colors {isNext
						? 'bg-emerald-500/30 ring-1 ring-emerald-400/50'
						: 'bg-white/5'}"
				>
					<p class="text-sm {isNext ? 'text-emerald-300' : 'text-white/50'}">
						{PRAYER_NAMES[key]}
					</p>
					<p class="text-lg font-semibold {isNext ? 'text-emerald-200' : 'text-white/80'}">
						{timings[key]}
					</p>
				</div>
			{/each}
		</div>
	{:else}
		<div class="space-y-3">
			<div class="rounded-xl bg-white/5 p-3 space-y-2">
				<div class="h-3 w-24 mx-auto animate-pulse rounded bg-white/10"></div>
				<div class="h-7 w-20 mx-auto animate-pulse rounded bg-white/10"></div>
				<div class="h-5 w-16 mx-auto animate-pulse rounded bg-white/10"></div>
			</div>
			<div class="grid grid-cols-3 gap-2">
				{#each Array(6) as _}
					<div class="rounded-lg bg-white/5 p-2 space-y-1">
						<div class="h-3 w-10 mx-auto animate-pulse rounded bg-white/10"></div>
						<div class="h-4 w-12 mx-auto animate-pulse rounded bg-white/10"></div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
