<script lang="ts">
	import { onMount } from 'svelte';
	import type { PrayerTimesResponse, PrayerTimings } from '$lib/types/all_types';

	let timings = $state<PrayerTimings | null>(null);
	let nextPrayer = $state('');
	let nextPrayerTime = $state('');
	let countdown = $state('');

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

	function update() {
		if (!timings) return;
		const now = new Date();
		const nowMinutes = now.getHours() * 60 + now.getMinutes();

		let found = false;
		for (const key of PRAYER_ORDER) {
			const pm = timeToMinutes(timings[key]);
			if (nowMinutes < pm) {
				nextPrayer = PRAYER_NAMES[key];
				nextPrayerTime = timings[key];
				const diff = pm - nowMinutes;
				const h = Math.floor(diff / 60);
				const m = diff % 60;
				countdown = h > 0 ? `${h}j ${m}m lagi` : `${m}m lagi`;
				found = true;
				break;
			}
		}
		if (!found) {
			nextPrayer = PRAYER_NAMES['Fajr'];
			nextPrayerTime = timings['Fajr'];
			const diff = (24 * 60 - nowMinutes) + timeToMinutes(timings['Fajr']);
			const h = Math.floor(diff / 60);
			const m = diff % 60;
			countdown = `${h}j ${m}m lagi`;
		}
	}

	onMount(() => {
		(async () => {
			try {
				const res = await fetch('/api/prayer-times');
				const result = (await res.json()) as PrayerTimesResponse;
				timings = result.data.timings;
			} catch (e) {
				console.error('Error fetching prayer times:', e);
			}
		})();
		const iv = setInterval(update, 30000);
		return () => clearInterval(iv);
	});

	$effect(() => {
		if (timings) update();
	});
</script>

{#if nextPrayer}
	<div class="flex items-center gap-3 text-base text-teal-300/90">
		<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
		</svg>
		<span class="text-lg font-semibold">{nextPrayer}</span>
		<span class="text-lg text-white/70">{nextPrayerTime}</span>
		<span class="rounded-full bg-teal-500/20 px-2.5 py-1 text-sm font-medium text-teal-300">{countdown}</span>
	</div>
{/if}
