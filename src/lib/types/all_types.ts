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

export interface PresensiResponse {
  date: {
    iso: string; // e.g. "2025-07-13"
    formatted: string; // e.g. "Minggu, 13 Juli 2025"
  };
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  data: PresensiItem[];
}

export interface PresensiItem {
  nama_kelas: string; // e.g. "XI-TKJ"
  mapel: string; // e.g. "MATEMATIKA"
  jam: string; // e.g. "07:30 - 09:00"
  nama_siswa: string; // e.g. "Ahmad Fauzan"
  presensi: "A" | "I" | "S"; // atau bisa `string` jika masih belum pasti
}