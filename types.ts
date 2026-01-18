
export interface BiodataSekolah {
  npsn: string;
  namaSekolah: string;
  kecamatan: string;
  alamat: string;
  email: string;
  namaKepalaSekolah: string;
  nipKepsek: string;
  namaBendahara: string;
  nipBendahara: string;
}

export interface SiLPA {
  reguler: number;
  afirmasi: number;
  kinerja: number;
}

export interface DanaSalur {
  tahap: string;
  tglSalur: string;
  nilaiSalur: number;
  keterangan: string;
}

export interface RekapBelanja {
  jenis: string;
  trw1: number;
  trw2: number;
  trw3: number;
  trw4: number;
}

export interface ReportData {
  biodata: BiodataSekolah;
  silpa: SiLPA;
  danaSalur: DanaSalur[];
  rekapBelanja: RekapBelanja[];
  tglTitiMangsa: string[];
}
