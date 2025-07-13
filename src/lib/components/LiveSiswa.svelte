<script lang="ts">
  let { 
    data,
    scrolledToEnd = $bindable(false) // Bindable to control scroll end state
  } = $props();

  let tableContainer = $state<HTMLDivElement>();
  let currentScrollPosition = $state(0);
  let isScrollingDown = $state(true);
  let dateNow = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
        // scrolledToEnd = true;
        // // Pause at bottom for 2 seconds before scrolling back up
        setTimeout(() => {
          isScrollingDown = false;
          scrolledToEnd = true;
        }, 2000);
      }
    } else {
      // currentScrollPosition -= scrollStep;
      // if (currentScrollPosition <= 0) {
      //   currentScrollPosition = 0;
      //   // Pause at top for 2 seconds before scrolling down
      //   setTimeout(() => {
      //     isScrollingDown = true;
      //   }, 2000);
      // }
    }
    
    tableContainer.scrollTo({
      top: currentScrollPosition,
      behavior: 'auto' // Use auto for smooth continuous scrolling
    });
  }

  // Auto scroll when data changes - reset to top
  $effect(() => {
    if (data?.data?.length > 0) {
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
      if (data?.data?.length > 0) {
        gradualScroll();
      }
    }, 30);

    return () => clearInterval(interval);
  });
</script>

<div class="px-4 py-8 max-h-screen overflow-y-auto bg-gray-300">
  <section class="bg-white py-3 rounded-xl mb-4">
    <h1 class="text-3xl font-bold text-center text-gray-500">Data Siswa {dateNow}</h1>
  </section>
  
  {#if data.data && data.data.length > 0}
    <div bind:this={tableContainer} class="overflow-auto max-h-[85vh] shadow-lg rounded-lg border border-gray-200 scroll-smooth">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50 sticky top-0 z-10 shadow-sm border-b-2 border-gray-200">
          <tr>
            <th class="px-6 py-4 text-left text-2xl font-medium text-gray-800 uppercase tracking-wider border-b">
              No
            </th>
            <th class="px-6 py-4 text-left text-2xl font-medium text-gray-800 uppercase tracking-wider border-b">
              Nama Siswa
            </th>
            <th class="px-6 py-4 text-left text-2xl font-medium text-gray-800 uppercase tracking-wider border-b">
              Kelas
            </th>
            <th class="px-6 py-4 text-left text-2xl font-medium text-gray-800 uppercase tracking-wider border-b">
              Mata Pelajaran
            </th>
            <th class="px-6 py-4 text-left text-2xl font-medium text-gray-800 uppercase tracking-wider border-b">
              Jam
            </th>
            <th class="px-6 py-4 text-center text-2xl font-medium text-gray-800 uppercase tracking-wider border-b">
              Presensi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each data.data as item, index}
            <tr class="hover:bg-gray-50 transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap text-3xl font-medium text-gray-900">
                {index + 1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-3xl font-medium text-gray-900">
                {item.nama_siswa}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-3xl text-gray-600">
                {item.nama_kelas}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-3xl text-gray-600">
                {item.mapel}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-3xl text-gray-600">
                {item.jam}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                {#if item.presensi === 'I'}
                  <span class="inline-flex px-3 py-1 text-2xl font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Izin
                  </span>
                {:else if item.presensi === 'S'}
                  <span class="inline-flex px-3 py-1 text-2xl font-semibold rounded-full bg-red-100 text-red-800">
                    Sakit
                  </span>
                {:else if item.presensi === 'A'}
                  <span class="inline-flex px-3 py-1 text-2xl font-semibold rounded-full bg-gray-100 text-gray-800">
                    Alpha
                  </span>
                {:else}
                  <span class="inline-flex px-3 py-1 text-2xl font-semibold rounded-full bg-blue-100 text-blue-800">
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
    <div class="text-center py-16">
      <div class="text-gray-400 text-6xl mb-4">📋</div>
      <h3 class="text-xl font-medium text-gray-600 mb-2">Tidak ada data siswa</h3>
      <p class="text-gray-500">Data siswa akan ditampilkan di sini ketika tersedia</p>
    </div>
  {/if}
</div>