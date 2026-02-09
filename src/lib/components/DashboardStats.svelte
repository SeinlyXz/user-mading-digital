<script lang="ts">
	import PresensiBarChart from './PresensiBarChart.svelte';
	import PresensiDoughnutChart from './PresensiDoughnutChart.svelte';
	import PrayerTime from './PrayerTime.svelte';
	import WiseWord from './WiseWord.svelte';
</script>

<div class="flex h-full flex-col gap-4">
	<div
		class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl"
	>
		<WiseWord />
	</div>
	<div class="grid flex-1 grid-cols-[1fr,1fr,0.8fr] gap-4">
		<div
			class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl"
		>
			<PresensiBarChart />
		</div>
		<div
			class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl"
		>
			<PresensiDoughnutChart />
		</div>
		<div
			class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl"
		>
			<PrayerTime />
		</div>
	</div>
</div>
