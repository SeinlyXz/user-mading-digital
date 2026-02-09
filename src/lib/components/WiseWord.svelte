<script>
	import { onMount } from 'svelte';
	import NextPrayerMini from './NextPrayerMini.svelte';

	let currentTime = $state('');
	let currentWiseWord = $state('');
	let wordIndex = $state(0);

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

	function updateTime() {
		const now = new Date();
		// @ts-ignore
		currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
	}

	function updateWiseWord() {
		wordIndex = (wordIndex + 1) % wiseWords.length;
		currentWiseWord = wiseWords[wordIndex];
	}

	onMount(() => {
		updateTime();
		currentWiseWord = wiseWords[0];
		const timeInterval = setInterval(updateTime, 1000);
		const wordInterval = setInterval(updateWiseWord, 3000);
		return () => {
			clearInterval(timeInterval);
			clearInterval(wordInterval);
		};
	});
</script>

<div
	class="flex h-full w-full items-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6"
>
	<div class="flex items-center justify-between gap-8 w-full">
		<div class="flex-1 min-w-0">
			<div class="rounded-lg bg-white/5 p-4">
				<div class="relative flex items-center min-h-[3.5rem]">
					{#key currentWiseWord}
						<p class="text-2xl leading-relaxed text-white">
							{currentWiseWord}
						</p>
					{/key}
				</div>
			</div>
			<div class="mt-3">
				<NextPrayerMini />
			</div>
		</div>
		<div class="shrink-0 text-right">
			<div
				class="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent"
			>
				{currentTime}
			</div>
			<div class="mt-1 text-base text-slate-400">Waktu Indonesia Barat</div>
		</div>
	</div>
</div>
