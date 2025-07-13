<script lang="ts">
    let { data } = $props();
    
    let currentIndex = $state(0);
    let mediaItems = $state(data?.data?.data?.items || []);
    let imageTimer: any = $state(null)
    
    function nextSlide() {
        if (mediaItems.length > 0) {
            currentIndex = (currentIndex + 1) % mediaItems.length;
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
    
    function startImageTimer() {
        if (imageTimer) {
            clearTimeout(imageTimer);
        }
        imageTimer = setTimeout(() => {
            // If only 1 image, restart from beginning, otherwise go to next
            if (mediaItems.length === 1) {
                // For single image, just restart the timer to keep showing it
                startImageTimer();
            } else {
                nextSlide();
            }
        }, 3000); // 3 seconds for images
    }
    
    function clearImageTimer() {
        if (imageTimer) {
            clearTimeout(imageTimer);
            imageTimer = null;
        }
    }
    
    // Watch for current index changes to manage timers
    $effect(() => {
        clearImageTimer();
        
        if (mediaItems.length > 0 && mediaItems[currentIndex]) {
            const currentItem = mediaItems[currentIndex];
            // Start image timer for images (both single and multiple items)
            if (currentItem.type === 'image') {
                startImageTimer();
            }
        }
        
        // Cleanup function
        return () => {
            clearImageTimer();
        };
    });
</script>

<div class="w-full h-screen bg-black">
        {#if mediaItems.length > 0}
            <!-- Full Screen Media Display -->
            <div class="relative w-full h-full overflow-hidden">
                {#each mediaItems as item, index}
                    <div 
                        class="absolute inset-0 transition-transform duration-300 ease-in-out"
                        style="transform: translateX({(index - currentIndex) * 100}%)"
                    >
                        <div class="w-full h-full">
                            {#if item.type === 'image'}
                                <img 
                                    src='http://192.168.188.80:8000/storage/{item.path}' 
                                    alt={item.original_name}
                                    class="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            {:else if item.type === 'video'}
                                <!-- svelte-ignore a11y_media_has_caption -->
                                <video 
                                    src='http://192.168.188.80:8000/storage/{item.path}'
                                    autoplay
                                    loop={false}
                                    muted
                                    playsinline
                                    class="w-full h-full"
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
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-3 rounded-full transition-all duration-200 z-10"
                    >
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <button 
                        onclick={() => {
                            clearImageTimer();
                            nextSlide();
                        }}
                        aria-label="Next Media"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-3 rounded-full transition-all duration-200 z-10"
                    >
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                {/if}
                
                <!-- Simple dots indicator at bottom -->
                {#if mediaItems.length > 1}
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                        {#each mediaItems as _, index}
                            <button
                                onclick={() => {
                                    clearImageTimer();
                                    goToSlide(index);
                                }}
                                aria-label={`Go to media ${index + 1}`}
                                class="w-3 h-3 rounded-full transition-all duration-200 {index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}"
                            ></button>
                        {/each}
                    </div>
                {/if}
            </div>
        {:else}
            <!-- No Media State -->
            <div class="flex items-center justify-center h-full">
                <div class="text-center text-white">
                    <div class="mx-auto w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                        <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">No Media Found</h3>
                    <p class="text-gray-400">There are no images or videos to display at the moment.</p>
                </div>
            </div>
        {/if}
    </div>