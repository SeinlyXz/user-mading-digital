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
    const scrollStep = 5; // pixels per step
    
    if (isScrollingDown) {
      currentScrollPosition += scrollStep;
      if (currentScrollPosition >= maxScroll) {
        currentScrollPosition = maxScroll;
        setTimeout(() => {
          isScrollingDown = false;
          scrolledToEnd = true;
        }, 2000);
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
    }, 50);

    return () => clearInterval(interval);
  });
</script>

<div class="px-4 py-6 max-h-screen overflow-y-auto bg-gradient-to-b from-transparent via-blue-950/10 to-purple-950/10 relative">
  <!-- Floating elements for underwater effect -->
  <div class="absolute top-4 right-8 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
  <div class="absolute top-16 left-6 w-1.5 h-1.5 bg-cyan-300/40 rounded-full animate-bounce"></div>
  <div class="absolute bottom-20 right-12 w-2.5 h-2.5 bg-purple-400/25 rounded-full animate-pulse delay-300"></div>

  <!-- Header Section -->
  <section class="bg-white/10 backdrop-blur-xl py-4 rounded-2xl mb-6 border border-white/20 shadow-2xl relative overflow-hidden">
    <!-- Shine effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
    
    <div class="relative z-10">
      <h1 class="text-2xl font-bold text-center bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent mb-1">
        Data Siswa Live
      </h1>
      <p class="text-center text-blue-200/70 text-sm font-medium">
        {dateNow}
      </p>
    </div>
  </section>
  
  {#if isLoading}
    <div class="flex items-center justify-center h-64 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
      <div class="text-center">
        <div class="relative">
          <!-- Animated loading spinner with underwater theme -->
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
    <div bind:this={tableContainer} class="overflow-auto max-h-[75vh] shadow-2xl rounded-2xl border border-white/20 scroll-smooth bg-white/5 backdrop-blur-xl relative">
      <!-- Table gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-2xl"></div>
      
      <table class="min-w-full relative z-10">
        <thead class="bg-white/10 backdrop-blur-sm sticky top-0 z-20 border-b border-white/20">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
              No
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
              Nama Siswa
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
              Kelas
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
              Mata Pelajaran
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
              Jam
            </th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-blue-200 uppercase tracking-wider">
              Presensi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10">
          {#each data.data as item, index}
            <tr class="hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
              <!-- Row hover effect -->
              <td class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></td>
              
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white relative z-10">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-white relative z-10">
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-blue-100">{item.nama_siswa}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-blue-200/80 relative z-10">
                <span class="bg-white/10 px-2 py-1 rounded-full text-xs font-medium border border-white/20">
                  {item.nama_kelas}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-blue-200/80 relative z-10">
                {item.mapel}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-blue-200/80 relative z-10">
                <div class="flex items-center space-x-1">
                  <svg class="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span>{item.jam}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center relative z-10">
                {#if item.presensi === 'I'}
                  <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-sm">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                    Izin
                  </span>
                {:else if item.presensi === 'S'}
                  <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    Sakit
                  </span>
                {:else if item.presensi === 'A'}
                  <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30 backdrop-blur-sm">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                    Alpha
                  </span>
                {:else}
                  <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-sm">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
    <div class="text-center py-16 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden">
      <!-- Empty state background pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
      
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