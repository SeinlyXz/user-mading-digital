<!-- +page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut, quintOut } from 'svelte/easing';

	// Reactive variables
	let currentTime = $state('');
	let currentWiseWord = $state('');
	let wordIndex = $state(0);

	// Indonesian wise words collection
	const wiseWords = [
		'Belajar adalah investasi terbaik untuk masa depan',
		'Kesuksesan dimulai dari langkah pertama yang berani',
		'Ilmu adalah cahaya yang menerangi kegelapan',
		'Kesabaran adalah kunci dari segala pintu kebijaksanaan',
		'Mimpi tanpa usaha hanya akan menjadi angan-angan',
		'Kebaikan sekecil apapun tidak akan pernah sia-sia',
		'Waktu adalah emas, gunakanlah dengan bijak',
		'Kegagalan adalah guru terbaik menuju kesuksesan'
	];

	// Update time function
	function updateTime() {
		const now = new Date();
		const timeOptions = {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		};
		// @ts-ignore
		currentTime = now.toLocaleTimeString('id-ID', timeOptions);
	}

	// Update wise word function
	function updateWiseWord() {
		wordIndex = (wordIndex + 1) % wiseWords.length;
		currentWiseWord = wiseWords[wordIndex];
	}

	// Initialize on mount
	onMount(() => {
		// Set initial values
		updateTime();
		currentWiseWord = wiseWords[0];

		// Set up intervals
		const timeInterval = setInterval(updateTime, 1000);
		const wordInterval = setInterval(updateWiseWord, 3000);

		// Cleanup
		return () => {
			clearInterval(timeInterval);
			clearInterval(wordInterval);
		};
	});
</script>

<div
	class="flex h-full w-full items-center rounded-xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4"
>
	<div class="flex items-center justify-between gap-6 w-full">
		<!-- Wise Words Display -->
		<div class="w-[80%]">
			<div class="rounded-lg bg-white/5 p-3 backdrop-blur-sm">
				<div class="relative flex items-center min-h-[3rem]">
					{#key currentWiseWord}
						<p
							class="text-xl leading-relaxed text-white"
						>
							{currentWiseWord}
						</p>
					{/key}
				</div>
			</div>
		</div>
		<!-- Time Display -->
		<div class="w-[20%]">
			{#key currentTime}
				<div
					class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent"
				>
					{currentTime}
				</div>
			{/key}
			<div class="mt-1 text-xs text-gray-400">Waktu Indonesia Barat</div>
		</div>
	</div>
</div>
