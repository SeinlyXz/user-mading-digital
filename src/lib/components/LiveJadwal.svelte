<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	interface JadwalItem {
		jam: number;
    guru: string;
		mapel: string;
	}

	interface JadwalData {
		tanggal: string;
		jadwal: {
			[kelas: string]: JadwalItem[];
		};
	}

	let jadwalData: JadwalData | null = $state(null);
	let currentKelas = $state('');
	let currentIndex = $state(0);
	let kelasArray: string[] = $state([]);
	let interval: number = $state(0);

	// State untuk mengontrol transisi - simplified
	let isVisible = $state(true);

	const fetchJadwal = async () => {
		try {
			const response = await fetch('https://ma.krapyak.id/api/livejadwal.php');
			const data = await response.json();
			jadwalData = data;

			if (jadwalData) {
				kelasArray = Object.keys(jadwalData.jadwal);
				currentKelas = kelasArray[0];
				currentIndex = 0;
				isVisible = true;
			}
		} catch (error) {
			console.error('Error fetching jadwal:', error);
		}
	};

	const switchToNextKelas = () => {
		if (kelasArray.length === 0) return;

		// Hide current content
		isVisible = false;

		// Wait for exit transition to complete, then switch
		setTimeout(() => {
			const nextIndex = (currentIndex + 1) % kelasArray.length;
			currentIndex = nextIndex;
			currentKelas = kelasArray[nextIndex];

			// Small delay before showing new content
			setTimeout(() => {
				isVisible = true;
			}, 100);
		}, 600); // Wait for all rows to exit
	};

	onMount(() => {
		fetchJadwal();

		// Auto-rotate every 5 seconds
		interval = setInterval(() => {
			switchToNextKelas();
		}, 5000);
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div class="flex h-full flex-col">
	<div class="mb-2 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
			<h3 class="text-sm font-semibold text-white">Jadwal Hari Ini</h3>
		</div>
		{#if jadwalData}
			<div class="rounded bg-white/10 px-2 py-1 text-xs text-blue-200/80">
				{jadwalData.tanggal}
			</div>
		{/if}
	</div>

	{#if jadwalData}
		<div class="flex-1 overflow-hidden">
			<!-- Judul Kelas -->
			<div class="mb-2 flex h-6 items-center justify-center">
				{#if isVisible}
					<h4
						class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-center text-lg font-bold text-transparent text-white"
						in:fly={{ x: 200, duration: 400, delay: 0 }}
						out:fly={{ x: -200, duration: 300 }}
					>
						{currentKelas}
					</h4>
				{/if}
			</div>

			<!-- Tabel Jadwal -->
			<div class="max-h-[calc(100%-3rem)] min-h-[180px] overflow-y-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-white/20">
							<th class="px-2 py-1 text-left font-medium text-blue-200/90">Jam</th>
							<th class="px-2 py-1 text-left font-medium text-blue-200/90">Mata Pelajaran</th>
							<th class="px-2 py-1 text-left font-medium text-blue-200/90">Guru</th>
						</tr>
					</thead>
					<tbody class="min-h-[180px]">
						{#each jadwalData.jadwal[currentKelas] as item, index (currentKelas + '-' + index)}
							{#if isVisible && jadwalData.jadwal[currentKelas]}
								<tr
									class="border-b border-white/10 transition-colors duration-200 hover:bg-white/5"
									in:fly={{
										x: 200,
										duration: 400,
										delay: index * 80 + 100
									}}
									out:fly={{
										x: -200,
										duration: 300,
										delay: (jadwalData.jadwal[currentKelas].length - index - 1) * 40
									}}
								>
									<td class="px-2 py-1 text-white/90">
										{index + 1}
									</td>
									<td class="px-2 py-1 text-white/90">
										{item.mapel}
									</td>
									<td class="px-2 py-1 text-white/90">
										{item.guru}
									</td>
								</tr>
              {/if}
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Progress indicator -->
			<div class="mt-2 flex justify-center space-x-1">
				{#each kelasArray as _, index}
					<div
						class="h-1 w-6 rounded-full transition-all duration-500 {index === currentIndex
							? 'bg-gradient-to-r from-green-400 to-blue-500'
							: 'bg-white/20'}"
					></div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex flex-1 items-center justify-center">
			<div class="text-center">
				<div class="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
				<p class="text-white/70">Memuat jadwal...</p>
			</div>
		</div>
	{/if}
</div>
