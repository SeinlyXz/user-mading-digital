<script lang="ts">
	import LiveSiswa from './LiveSiswa.svelte';
	import MediaDisplay from './MediaDisplay.svelte';
	import LiveJadwal from './LiveJadwal.svelte';
	import WiseWord from './WiseWord.svelte';
	import DashboardStats from './DashboardStats.svelte';

	let currentSlide = $state(0);
	let slideEnded = $state(false);
	let scrollEnded = $state(false);

	const STATS_SLIDE_DURATION = 20000;
	let statsTimeout: ReturnType<typeof setTimeout> | null = null;
	let statsProgress = $state(false);
	let slide0Animate = $state(false);
	const SLIDE0_ESTIMATE = 45000;

	function handleSlide0End() {
		currentSlide = 1;
		slideEnded = false;
		scrollEnded = false;
		slide0Animate = false;
		statsProgress = false;
		requestAnimationFrame(() => {
			statsProgress = true;
		});
		statsTimeout = setTimeout(() => {
			currentSlide = 0;
			statsProgress = false;
		}, STATS_SLIDE_DURATION);
	}

	$effect(() => {
		if (currentSlide === 0 && !slide0Animate) {
			requestAnimationFrame(() => {
				slide0Animate = true;
			});
		}
	});

	$effect(() => {
		if (currentSlide === 0 && slideEnded && scrollEnded) {
			handleSlide0End();
		}
	});

	$effect(() => {
		return () => {
			if (statsTimeout) clearTimeout(statsTimeout);
		};
	});
</script>

<div
	class="relative flex h-screen max-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
>
	<div class="relative z-10 flex-1 p-5 pb-8">
		<div class="relative h-full">
			<div
				class="absolute inset-0 transition-all duration-500 ease-in-out {currentSlide === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}"
			>
				<div class="grid h-full grid-cols-[0.5fr,1fr] gap-4">
					<div class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl">
						<div class="h-full overflow-hidden">
							<LiveSiswa bind:scrolledToEnd={scrollEnded} />
						</div>
					</div>
					<section class="grid grid-cols-1 gap-4 row-span-2">
						<div class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl">
							<WiseWord />
						</div>
						<div class="overflow-hidden rounded-2xl bg-white/10 shadow-2xl flex items-center">
							<div class="h-full overflow-hidden">
								<MediaDisplay bind:slideEnded />
							</div>
						</div>
					</section>
					<div class="grid grid-cols-1 gap-4">
						<div class="h-full rounded-2xl bg-white/10 p-5 shadow-2xl">
							<LiveJadwal />
						</div>
					</div>
				</div>
			</div>
			<div
				class="absolute inset-0 transition-all duration-500 ease-in-out {currentSlide === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}"
			>
				<DashboardStats />
			</div>
		</div>
	</div>

	<div class="absolute bottom-0 left-0 right-0 z-20 flex items-center gap-3 px-5 pb-2">
		<div class="flex items-center gap-2">
			{#each [0, 1] as i}
				<div
					class="h-1.5 w-1.5 rounded-full transition-all duration-300 {currentSlide === i ? 'bg-teal-400 scale-125' : 'bg-white/20'}"
				></div>
			{/each}
		</div>
		<div class="flex-1">
			<div class="h-1 overflow-hidden rounded-full bg-white/10">
				{#if currentSlide === 0}
					<div
						class="h-full rounded-full bg-teal-400/60"
						class:progress-bar-animate={slide0Animate}
						style:--progress-duration="{SLIDE0_ESTIMATE}ms"
						onanimationend={handleSlide0End}
					></div>
				{:else}
					<div
						class="h-full rounded-full bg-teal-400/60"
						class:progress-bar-animate={statsProgress}
						style:--progress-duration="{STATS_SLIDE_DURATION}ms"
					></div>
				{/if}
			</div>
		</div>
		<p class="shrink-0 text-xs text-white/30">
			Slide {currentSlide + 1} / 2
		</p>
	</div>
</div>

<style>
	.progress-bar-animate {
		animation: progress-fill var(--progress-duration) linear forwards;
	}
	@keyframes progress-fill {
		from { width: 0%; }
		to { width: 100%; }
	}
</style>
