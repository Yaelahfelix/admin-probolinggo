export interface LapAduan {
  id: number;
  tanggal: string;
  nomor: string;
  no_pelanggan?: string;
  jenis_aduan_id: number;
  jenis_nama: string;
  nama: string;
  no_hp: string;
  alamat: string;
  is_complete: number;
  completed_at: string;
  url_foto_aduan?: string;
  url_foto_penyelesaian?: string;
}
