import { env } from '$env/dynamic/private';
import type { MediaResponse, PresensiResponse } from '$lib/types/all_types';

export const load = async () => {
	try {
		const [data, live_siswa] = await Promise.all([
			fetch(env.API_URL + '/media'),
			fetch('https://ma.krapyak.id/api/livesiswa.php')
		]);
		return {
			data: (await data.json()) as MediaResponse,
			live_siswa: await live_siswa.json() as PresensiResponse
		};
	} catch (error) {
		return {
			data: {
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
      }
		};
	}
};