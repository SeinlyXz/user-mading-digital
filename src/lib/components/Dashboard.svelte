<script lang="ts">
	import Chart from './Chart.svelte';
	import LiveSiswa from './LiveSiswa.svelte';
	import MediaDisplay from './MediaDisplay.svelte';
</script>

<div
	class="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
>
	<!-- Underwater background effects -->
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-950/30 via-purple-950/20 to-slate-900/30"
	></div>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"
	></div>

	<!-- Floating bubble effects -->
	<div class="absolute left-10 top-10 h-3 w-3 animate-pulse rounded-full bg-blue-400/20"></div>
	<div class="absolute right-20 top-32 h-2 w-2 animate-bounce rounded-full bg-purple-400/30"></div>
	<div
		class="absolute bottom-40 left-1/4 h-4 w-4 animate-pulse rounded-full bg-cyan-400/15 delay-300"
	></div>
	<div
		class="absolute bottom-20 right-1/3 h-2 w-2 animate-bounce rounded-full bg-blue-300/25 delay-500"
	></div>

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
				class="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/30"
			>
				<div
					class="border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-4"
				>
					<h3 class="flex items-center text-lg font-semibold text-white">
						<span class="mr-2 text-xl">👥</span>
						Live Siswa
						<div class="ml-auto h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
					</h3>
				</div>
				<div class="h-[calc(100%-4rem)] overflow-hidden">
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
					<div class="mb-4 flex items-center space-x-2">
						<div class="h-3 w-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
						<h3 class="text-lg font-semibold text-white">Product Analysis</h3>
					</div>
					<div class="relative">
						<Chart title="" chartType="doughnut" />
					</div>
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
