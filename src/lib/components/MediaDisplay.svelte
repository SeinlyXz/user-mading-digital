<script lang="ts">
	import { onMount } from 'svelte';
	import type { MediaResponse } from '$lib/types/all_types.js';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	import { optimizedImageUrl } from '$lib/utils/image.js';

	let {
		slideEnded = $bindable(false) // Bindable to control slide end state
	} = $props();

	let data = $state<MediaResponse | null>(null);
	let isLoading = $state(true);
	let mediaItems: any = $state([]);
	let imageTimer: any = $state(null);
	let splideComponent: any = $state(null);
	let currentIndex = $state(0);
	let currentItem = $derived(mediaItems[currentIndex]);
	let firstImageUrl = $derived.by(() => {
		const first = mediaItems.find((i: any) => i.type === 'image');
		return first ? optimizedImageUrl(first.full_url, 1920, 80) : '';
	});

	// Fetch media data
	async function fetchMediaData() {
		try {
			isLoading = true;
			const response = await fetch('/api/media');
			data = (await response.json()) as MediaResponse;
		} catch (error) {
			console.error('Error fetching media data:', error);
			data = {
				success: false,
				message: 'Failed to fetch media data',
				data: {
					items: [],
					pagination: {
						current_page: 1,
						per_page: 10,
						total: 0,
						last_page: 1,
						from: 0,
						to: 0,
						has_more_pages: false
					}
				}
			};
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		fetchMediaData();
	});

	// Update mediaItems when data changes
	$effect(() => {
		if (data?.success && data.data?.items) {
			mediaItems = data.data.items;
			isLoading = false;
		} else {
			mediaItems = [];
		}
	});

	function handleSlideMoved(e: any) {
		currentIndex = e.detail.index;
		clearImageTimer();
	}

	function handleVideoEnded() {
		if (splideComponent && currentIndex < mediaItems.length - 1) {
			// If video ends and not at last item, go to next slide
			splideComponent.go('+1');
		} else {
			// If at last item, set slideEnded
			console.log('Video ended, setting slideEnded');
			setTimeout(() => {
				slideEnded = true;
			}, 1000); // Small delay to ensure transition completes
		}
	}

	function clearImageTimer() {
		if (imageTimer) {
			clearTimeout(imageTimer);
			imageTimer = null;
		}
	}

	$effect(() => {
		if (currentItem?.type === 'image' && imageTimer === null) {
			// Auto-advance images every 5 seconds
			imageTimer = setTimeout(() => {
				if (splideComponent) {
					splideComponent.go('+1');
				}
			}, 5000);
		}
		if (currentIndex === mediaItems.length - 1 && currentItem?.type !== 'video') {
			setTimeout(() => {
				clearImageTimer();
				slideEnded = true;
			}, 4000);
		} else {
			slideEnded = false;
		}
	});
</script>

<svelte:head>
	{#if firstImageUrl}
		<link rel="preload" as="image" href={firstImageUrl} />
	{/if}
</svelte:head>

{#if isLoading}
	<div class="flex h-full w-full items-center justify-center p-4">
		<div class="h-full w-full animate-pulse rounded-lg bg-white/5"></div>
	</div>
{:else if mediaItems.length > 0}
	<!-- Splide Media Display -->
	<div class="flex h-full w-full items-center justify-center">
		<Splide
			bind:this={splideComponent}
			on:move={handleSlideMoved}
			options={{
				type: 'loop',
				autoplay: true,
				pagination: false,
				arrows: false,
				height: '100%',
				width: '100%',
				cover: false,
				focus: 'center',
				trimSpace: false,
			}}
			class="h-full w-full flex items-center justify-center"
		>
			{#each mediaItems as item}
				<SplideSlide class="flex items-center justify-center">
					<div class="flex h-full w-full items-center justify-center p-2">
						{#if item.type === 'image'}
							<img
								src={optimizedImageUrl(item.full_url, 1920, 80)}
								alt={item.filename}
								class="max-h-full max-w-full object-contain rounded-lg shadow-lg"
								loading={currentIndex === 0 ? 'eager' : 'lazy'}
								fetchpriority={currentIndex === 0 ? 'high' : 'auto'}
							/>
						{:else if item.type === 'video'}
							<!-- svelte-ignore a11y_media_has_caption -->
							<video
								src={item.full_url}
								autoplay={true}
								loop={false}
								muted
								playsinline
								class="max-h-full max-w-full object-contain rounded-lg shadow-lg"
								preload="metadata"
								controls
								onended={handleVideoEnded}
							>
								Your browser does not support the video tag.
							</video>
						{/if}
					</div>
				</SplideSlide>
			{/each}
		</Splide>
	</div>
{:else}
	<!-- No Media State -->
	<div class="flex h-full items-center justify-center">
		<div class="text-center text-white">
			<div class="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-600">
				<svg class="h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<h3 class="mb-1 text-lg font-semibold">No Media Found</h3>
			<p class="text-gray-400 text-sm">There are no images or videos to display at the moment.</p>
		</div>
	</div>
{/if}
