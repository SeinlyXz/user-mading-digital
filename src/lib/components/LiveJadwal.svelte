<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	interface JadwalItem {
		jam: number;
		mapel: string;
	}

	interface JadwalData {
		tanggal: string;
		jadwal: {
			[kelas: string]: JadwalItem[];
		};
	}

	let jadwalData: JadwalData | null = null;
	let currentKelas = '';
	let currentIndex = 0;
	let kelasArray: string[] = [];
	let isTransitioning = false;
	let interval: number;
	let rowsKey = 0; // Key untuk memaksa re-render rows

	const fetchJadwal = async () => {
		try {
			const response = await fetch('https://ma.krapyak.id/api/livejadwal.php');
			const data = await response.json();
			jadwalData = data;
			
			if (jadwalData) {
				kelasArray = Object.keys(jadwalData.jadwal);
				currentKelas = kelasArray[0];
				currentIndex = 0;
			}
		} catch (error) {
			console.error('Error fetching jadwal:', error);
		}
	};

	const nextKelas = () => {
		if (kelasArray.length === 0) return;
		
		isTransitioning = true;
		
		setTimeout(() => {
			currentIndex = (currentIndex + 1) % kelasArray.length;
			currentKelas = kelasArray[currentIndex];
			rowsKey += 1; // Trigger re-render
			isTransitioning = false;
		}, 500); // Wait for all rows to fly out
	};

	onMount(() => {
		fetchJadwal();
		
		// Auto-rotate every 5 seconds
		interval = setInterval(() => {
			nextKelas();
		}, 5000);
	});

	onDestroy(() => {
		if (interval) {
			clearInterval(interval);
		}
	});
</script>

<div class="h-full flex flex-col">
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<div class="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
			<h3 class="text-lg font-semibold text-white">Jadwal Hari Ini</h3>
		</div>
		{#if jadwalData}
			<div class="text-xs text-blue-200/80 bg-white/10 px-2 py-1 rounded">
				{jadwalData.tanggal}
			</div>
		{/if}
	</div>

	{#if jadwalData && !isTransitioning}
		<div class="flex-1 overflow-hidden">
			<div class="mb-3">
				<h4 class="text-center text-xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
					{currentKelas}
				</h4>
			</div>
			
			<div class="overflow-y-auto max-h-[calc(100%-4rem)]">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-white/20">
							<th class="text-left py-2 px-3 text-blue-200/90 font-medium">Jam</th>
							<th class="text-left py-2 px-3 text-blue-200/90 font-medium">Mata Pelajaran</th>
						</tr>
					</thead>
					<tbody>
						{#each jadwalData.jadwal[currentKelas] as item, index (rowsKey + index)}
							<tr 
								class="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
								in:fly={{ x: 200, duration: 300, delay: index * 50 }}
								out:fly={{ x: -200, duration: 300, delay: index * 30 }}
							>
								<td class="py-2 px-3 text-white/90">
									{item.jam || '-'}
								</td>
								<td class="py-2 px-3 text-white/90">
									{item.mapel}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Progress indicator -->
			<div class="mt-3 flex justify-center space-x-1">
				{#each kelasArray as _, index}
					<div 
						class="h-1.5 w-8 rounded-full transition-all duration-300 {index === currentIndex ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-white/20'}"
					></div>
				{/each}
			</div>
		</div>
	{:else if !jadwalData}
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-3 mx-auto"></div>
				<p class="text-white/70">Memuat jadwal...</p>
			</div>
		</div>
	{/if}
</div>
