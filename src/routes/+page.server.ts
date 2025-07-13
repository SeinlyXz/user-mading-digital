import { env } from '$env/dynamic/private';

export const load = async () => {
	try {
		const data = await fetch(env.API_URL + '/media');
		return {
			data: (await data.json()) as MediaResponse
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

export interface MediaResponse {
	success: boolean;
	message: string;
	data: {
		items: MediaItem[];
		pagination: Pagination;
	};
}

export interface MediaItem {
	id: number;
	uuid: string;
	filename: string;
	original_name: string;
	mime_type: string;
	extension: string;
	size: number;
	size_formatted: string;
	disk: string;
	path: string;
	url: string;
	full_url: string;
	type: 'video' | 'image';
	description: string | null;
	metadata: VideoMetadata | ImageMetadata;
	created_at: string;
	updated_at: string;
}

export interface VideoMetadata {
	type: 'video';
	file_size: number;
}

export interface ImageMetadata {
	width: number;
	height: number;
	aspect_ratio: number;
}

export interface Pagination {
	current_page: number;
	per_page: number;
	total: number;
	last_page: number;
	from: number;
	to: number;
	has_more_pages: boolean;
}
