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
  nama_kelas: string;
  mapel: string;
  jam: string;
  nama_siswa: string;
  presensi: "A" | "I" | "S" | string;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  [key: string]: string;
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimings;
    date: {
      readable: string;
      hijri: {
        date: string;
        day: string;
        month: { number: number; en: string; ar: string };
        year: string;
      };
      gregorian: {
        date: string;
        day: string;
        month: { number: number; en: string };
        year: string;
      };
    };
  };
}

export interface PresensiStats {
  kelas: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  total: number;
}