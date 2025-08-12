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
	path: string;
	filename: string;
	extension: string;
	mime_type: string;
	type: 'video' | 'image';
	full_url: string;
	file_exists: boolean;
	created_at: string;
	updated_at: string;
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