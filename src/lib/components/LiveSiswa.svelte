<script lang="ts">
  import type { PresensiResponse } from '$lib/types/all_types.js';
  
  let { 
    scrolledToEnd = $bindable(false) // Bindable to control scroll end state
  } = $props();

  let data = $state<PresensiResponse | null>(null);
  let isLoading = $state(true);
  let tableContainer = $state<HTMLDivElement>();
  let currentScrollPosition = $state(0);
  let isScrollingDown = $state(true);
  let dateNow = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Fetch live siswa data
  async function fetchLiveSiswaData() {
    try {
      isLoading = true;
      const response = await fetch('https://ma.krapyak.id/api/livesiswa.php');
      data = await response.json() as PresensiResponse;
    } catch (error) {
      console.error('Error fetching live siswa data:', error);
      data = null;
    } finally {
      isLoading = false;
    }
  }
  
  // Fetch data on component mount
  $effect(() => {
    fetchLiveSiswaData();
  });
  
  // Gradual autoscroll function
  function gradualScroll() {
    if (!tableContainer) return;
    
    const maxScroll = tableContainer.scrollHeight - tableContainer.clientHeight;
    const scrollStep = 1; // pixels per step
    
    if (isScrollingDown) {
      currentScrollPosition += scrollStep;
      if (currentScrollPosition >= maxScroll) {
        currentScrollPosition = maxScroll;
        isScrollingDown = false;
        scrolledToEnd = true;
      }
    } 
    
    tableContainer.scrollTo({
      top: currentScrollPosition,
      behavior: 'auto' // Use auto for smooth continuous scrolling
    });
  }

  // Auto scroll when data changes - reset to top
  $effect(() => {
    // @ts-ignore
    if (data?.data.length > 0) {
      currentScrollPosition = 0;
      isScrollingDown = true;
      scrolledToEnd = false;
      if (tableContainer) {
        tableContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  // Gradual scroll every 50ms for smooth movement
  $effect(() => {
    const interval = setInterval(() => {
      // @ts-ignore
      if (data?.data?.length > 0) {
        gradualScroll();
      }
    }, 60);

    return () => clearInterval(interval);
  });
</script>

<div class="p-6 h-full relative">
  <!-- Header Section -->
  <section class="relative overflow-hidden">
    <div class="mb-4 flex justify-center items-center space-x-2">
      <h3 class="text-lg text-center font-semibold text-white">Data Siswa Live {dateNow}</h3>
    </div>
  </section>
  
  {#if isLoading}
    <div class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="relative">
          <!-- Animated loading spinner -->
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-400/30 border-t-blue-400 mx-auto mb-4"></div>
          <div class="absolute inset-0 animate-ping rounded-full h-10 w-10 border-2 border-cyan-400/20 mx-auto"></div>
        </div>
        <p class="text-blue-200/80 font-medium">Memuat data siswa...</p>
        <div class="flex justify-center space-x-1 mt-2">
          <div class="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div class="w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-100"></div>
          <div class="w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  {:else if data?.data && data.data.length > 0}
    <div bind:this={tableContainer} class="overflow-auto max-h-[calc(100vh-500px)] rounded-xl scroll-smooth bg-white/5 before:backdrop-blur-sm relative">
      <table class="w-full relative z-10 table-fixed">
        <thead class="backdrop-blur-md sticky top-0 z-20 rounded-xl">
          <tr>
            <th class="w-[35%] px-2 py-2 text-left text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Nama
            </th>
            <th class="w-[15%] px-2 py-2 text-left text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Kelas
            </th>
            <th class="w-[20%] px-2 py-2 text-left text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Mapel
            </th>
            <th class="w-[15%] px-2 py-2 text-left text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Jam
            </th>
            <th class="w-[15%] px-2 py-2 text-center text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Ket
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          {#each data.data as item, index}
            <tr class="hover:bg-white/5 transition-all duration-300 group relative">
              <td class="px-2 py-2 text-xs font-medium text-white relative z-10">
                <div class="flex items-center space-x-1">
                  <div class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="text-white truncate">{item.nama_siswa}</span>
                </div>
              </td>
              <td class="px-2 py-2 text-xs text-blue-200/80 relative z-10">
                <span class="bg-white/10 px-1.5 py-0.5 rounded text-xs font-medium border border-white/20 block text-center">
                  {item.nama_kelas}
                </span>
              </td>
              <td class="px-2 py-2 text-xs text-blue-200/80 relative z-10">
                <span class="truncate block">{item.mapel}</span>
              </td>
              <td class="px-2 py-2 text-xs text-blue-200/80 relative z-10">
                <div class="flex items-center space-x-0.5">
                  <svg class="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span class="truncate">{item.jam}</span>
                </div>
              </td>
              <td class="px-2 py-2 text-center relative z-10">
                {#if item.presensi === 'I'}
                  <span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-sm">
                    <svg class="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    I
                  </span>
                {:else if item.presensi === 'S'}
                  <span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
                    <svg class="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    S
                  </span>
                {:else if item.presensi === 'A'}
                  <span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30 backdrop-blur-sm">
                    <svg class="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    A
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-sm">
                    <svg class="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    {item.presensi}
                  </span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="text-center py-16 relative overflow-hidden">
      <div class="relative z-10">
        <!-- Animated empty state icon -->
        <div class="relative mx-auto w-16 h-16 mb-6">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl opacity-20 animate-pulse"></div>
          <div class="relative flex items-center justify-center w-full h-full">
            <svg class="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-blue-200 mb-2">Tidak ada data siswa</h3>
        <p class="text-blue-300/70 text-sm">Data siswa akan ditampilkan di sini ketika tersedia</p>
        
        <!-- Floating dots animation -->
        <div class="flex justify-center space-x-2 mt-4">
          <div class="w-2 h-2 bg-blue-400/50 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-purple-400/50 rounded-full animate-bounce delay-100"></div>
          <div class="w-2 h-2 bg-cyan-400/50 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Hide vertical scrollbar -->

<style>
  /* Hide vertical scrollbar */
  .scroll-smooth::-webkit-scrollbar {
    display: none;
  }
  .scroll-smooth {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
 