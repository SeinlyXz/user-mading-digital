<script lang="ts">
	import LiveSiswa from '$lib/components/LiveSiswa.svelte';
	import MediaDisplay from '$lib/components/MediaDisplay.svelte';

	let { data } = $props();

	let slideEnded = $state(false);
	let scrolledToEnd = $state(false);

	$effect(() => {
		if (scrolledToEnd) {
			slideEnded = false;
		}
	});
</script>

<svelte:head>
	<title>Media Display</title>
	<meta name="description" content="Display media items with smooth transitions and controls." />
</svelte:head>

<div class="h-screen w-full bg-black">
	{#if !slideEnded}
		<MediaDisplay {data} bind:slideEnded />
	{:else}
		<LiveSiswa data={data.live_siswa} bind:scrolledToEnd />
	{/if}
</div>
