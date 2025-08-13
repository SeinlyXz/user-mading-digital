<script lang="ts">
	import Chart from './Chart.svelte';
	import LiveSiswa from './LiveSiswa.svelte';
	import MediaDisplay from './MediaDisplay.svelte';
	import LiveJadwal from './LiveJadwal.svelte';
</script>

<div
	class="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
>

	<!-- Glassmorphism Header -->
	<header
		class="relative flex-shrink-0 border-b border-white/10 bg-white/5 px-6 py-4 shadow-lg backdrop-blur-xl"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 shadow-lg"
				>
					<span class="text-sm font-bold text-white">MD</span>
				</div>
				<h1
					class="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent"
				>
					Dashboard Mading Digital
				</h1>
			</div>
			<div
				class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-blue-200/80 backdrop-blur-sm"
			>
				{new Date().toLocaleDateString('id-ID', {
					day: '2-digit',
					month: 'short',
					year: 'numeric'
				})}
			</div>
		</div>
	</header>

	<div class="relative z-10 flex-1 overflow-hidden p-6">
		<!-- Main Content Grid with Glassmorphism -->
		<div class="grid grid-cols-2 gap-5">
			<div
				class="overflow-hidden rounded-3xl bg-white/10 shadow-2xl transition-all duration-300 hover:border-white/30"
			>
				<div class="h-full overflow-hidden">
					<LiveSiswa />
				</div>
			</div>

			<div
				class="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/30 row-span-2"
			>
				<div class="h-[calc(100%)] overflow-hidden">
					<MediaDisplay />
				</div>
			</div>
			<div class="grid grid-cols-2 gap-5">
				<div
					class="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/30"
				>
					<LiveJadwal />
				</div>
				<div
					class="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/30"
				>
					<div class="mb-4 flex items-center space-x-2">
						<div class="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
						<h3 class="text-lg font-semibold text-white">Product Analysis</h3>
					</div>
					<div class="relative">
						<Chart title="" chartType="doughnut" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
