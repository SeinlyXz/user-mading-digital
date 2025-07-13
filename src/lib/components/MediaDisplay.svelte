<script lang="ts">
	let { 
    data,
    slideEnded = $bindable(false) // Bindable to control slide end state
  } = $props();

	let currentIndex = $state(0);
	let mediaItems = $state(data?.data?.data?.items || []);
	let imageTimer: any = $state(null);
  let currentItem = $derived(mediaItems[currentIndex]);

	function nextSlide() {
		if (mediaItems.length > 1) {
			currentIndex = (currentIndex + 1) % mediaItems.length;
      // Clear image timer when moving to next slide
      clearImageTimer();
		}
	}

	function prevSlide() {
		if (mediaItems.length > 0) {
			currentIndex = currentIndex === 0 ? mediaItems.length - 1 : currentIndex - 1;
		}
	}

	function goToSlide(index: number) {
		currentIndex = index;
	}

	function handleVideoEnded() {
		// If only 1 video, restart the same video
		if (mediaItems.length === 1) {
			const videoElement = document.querySelector('video');
			if (videoElement) {
				videoElement.currentTime = 0;
				videoElement.play();
			}
		} else {
			// Auto-loop to next video/media when current video ends
			// Add small delay for smooth transition
			setTimeout(() => {
				nextSlide();
			}, 100);
		}
	}

	function clearImageTimer() {
		if (imageTimer) {
			clearTimeout(imageTimer);
			imageTimer = null;
		}
	}


  $effect(()=>{
    if(currentItem?.type === 'image' && imageTimer === null) {
      // Auto-advance images every 10 seconds
      imageTimer = setTimeout(() => {
        nextSlide();
      }, 5000);
    }
    if (currentIndex === mediaItems.length - 1) {
      // If at the last item, clear the timer to prevent auto-advance
      setTimeout(() => {
        clearImageTimer();
        slideEnded = true;
      }, 4000); // Small delay to ensure transition completes
    }
  })
</script>

{#if mediaItems.length > 0}
	<!-- Full Screen Media Display -->
	<div class="relative h-full w-full overflow-hidden">
		{#each mediaItems as item, index}
			<div
				class="absolute inset-0 transition-transform duration-300 ease-in-out"
				style="transform: translateX({(index - currentIndex) * 100}%)"
			>
				<div class="h-full w-full">
					{#if item.type === 'image'}
						<img
							src={item.full_url}
							alt={item.original_name}
							class="h-full w-full object-cover"
							loading="lazy"
						/>
					{:else if item.type === 'video'}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							src={item.full_url}
							autoplay
							loop={false}
							muted
							playsinline
							class="h-full w-full"
							preload="metadata"
							controls
							onended={handleVideoEnded}
						>
							Your browser does not support the video tag.
						</video>
					{/if}
				</div>
			</div>
		{/each}

		<!-- Navigation Arrows (minimal design) -->
		{#if mediaItems.length > 1}
			<button
				onclick={() => {
					clearImageTimer();
					prevSlide();
				}}
				aria-label="Previous Media"
				class="bg-opacity-30 hover:bg-opacity-60 absolute top-1/2 left-4 z-10 -translate-y-1/2 transform rounded-full bg-black p-3 text-white transition-all duration-200"
			>
				<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<button
				onclick={() => {
					clearImageTimer();
					nextSlide();
				}}
				aria-label="Next Media"
				class="bg-opacity-30 hover:bg-opacity-60 absolute top-1/2 right-4 z-10 -translate-y-1/2 transform rounded-full bg-black p-3 text-white transition-all duration-200"
			>
				<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}

		<!-- Simple dots indicator at bottom -->
		{#if mediaItems.length > 1}
			<div class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-2">
				{#each mediaItems as _, index}
					<button
						onclick={() => {
							clearImageTimer();
							goToSlide(index);
						}}
						aria-label={`Go to media ${index + 1}`}
						class="h-3 w-3 rounded-full transition-all duration-200 {index === currentIndex
							? 'bg-white'
							: 'hover:bg-opacity-75 bg-gray-400'}"
					></button>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<!-- No Media State -->
	<div class="flex h-full items-center justify-center">
		<div class="text-center text-white">
			<div class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-600">
				<svg class="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<h3 class="mb-2 text-xl font-semibold">No Media Found</h3>
			<p class="text-gray-400">There are no images or videos to display at the moment.</p>
		</div>
	</div>
{/if}
