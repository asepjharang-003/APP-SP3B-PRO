
import { ReportData } from './types';

export const INITIAL_DATA: ReportData = {
  biodata: {
    npsn: "20218196",
    namaSekolah: "SD NEGERI SETIALAKSANA 03",
    kecamatan: "CABANGBUNGIN",
    alamat: "Kp. Garon Barat RT. 04/01 Desa Setialaksana",
    email: "sdnsetialaksana@gmail.com",
    namaKepalaSekolah: "MARTA WIJAYA, S.Pd",
    nipKepsek: "19671216 199212 1 001",
    namaBendahara: "SITI MAELANI, S.Pd",
    nipBendahara: "19850602 201903 2 012"
  },
  silpa: {
    reguler: 695600,
    afirmasi: 0,
    kinerja: 0
  },
  danaSalur: [
    { tahap: "TAHAP-1", tglSalur: "2026-01-21", nilaiSalur: 80850000, keterangan: "Triwulan 1" },
    { tahap: "TAHAP-2", tglSalur: "2026-08-08", nilaiSalur: 80850000, keterangan: "Triwulan 3" },
    { tahap: "KINERJA 2026", tglSalur: "2026-06-16", nilaiSalur: 22500000, keterangan: "Triwulan 2" }
  ],
  rekapBelanja: [
    { jenis: "BARANG DAN JASA", trw1: 18475800, trw2: 16026000, trw3: 51123400, trw4: 17411900 },
    { jenis: "BELANJA MODAL KIB-B", trw1: 18000000, trw2: 16800000, trw3: 12450000, trw4: 9750000 },
    { jenis: "BELANJA MODAL KIB-E", trw1: 0, trw2: 0, trw3: 16044900, trw4: 5118000 }
  ],
  tglTitiMangsa: ["2026-08-08", "2026-08-08", "2026-08-08", "2026-08-08"]
};
