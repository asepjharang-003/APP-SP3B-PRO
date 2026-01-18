
import React, { useState } from 'react';
import { INITIAL_DATA } from './constants';
import { ReportData } from './types';
import { 
  Printer, 
  RefreshCcw,
  Plus,
  Trash2,
  TrendingUp,
  AlertTriangle,
  School,
  Coins,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'input' | 'sp3b'>('report');
  const [selectedTw, setSelectedTw] = useState<1 | 2 | 3 | 4>(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const formatNumber = (num: number) => {
    if (num === 0) return '-';
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const calculateTotalSilpa = () => data.silpa.reguler + data.silpa.afirmasi + data.silpa.kinerja;
  const calculateTotalSalur = () => data.danaSalur.reduce((acc, curr) => acc + curr.nilaiSalur, 0);

  const getTwIncome = (tw: number) => {
    const mapping: Record<number, string> = { 1: '1', 2: '2', 3: '3', 4: '4' };
    return data.danaSalur
      .filter(d => d.keterangan.includes(mapping[tw]))
      .reduce((acc, curr) => acc + curr.nilaiSalur, 0);
  };

  const getTwExpenditureTotal = (tw: number) => {
    const key = `trw${tw}` as keyof typeof data.rekapBelanja[0];
    return data.rekapBelanja.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
  };

  const getSaldoAwalTw = (tw: number) => {
    if (tw === 1) return calculateTotalSilpa();
    let prevBalance = calculateTotalSilpa();
    for (let i = 1; i < tw; i++) {
      prevBalance = (prevBalance + getTwIncome(i)) - getTwExpenditureTotal(i);
    }
    return prevBalance;
  };

  const getSaldoAkhirTw = (tw: number) => {
    return (getSaldoAwalTw(tw) + getTwIncome(tw)) - getTwExpenditureTotal(tw);
  };

  const confirmDelete = (idx: number) => setDeleteId(idx);
  const handleDelete = () => {
    if (deleteId !== null) {
      setData({ ...data, danaSalur: data.danaSalur.filter((_, i) => i !== deleteId) });
      setDeleteId(null);
    }
  };

  const updateTitiMangsa = (val: string) => {
    const next = [...data.tglTitiMangsa];
    next[selectedTw - 1] = val;
    setData({ ...data, tglTitiMangsa: next });
  };

  const LOGO_URL = "https://files.oaiusercontent.com/file-K8yvY65HscS5FAnpYF2G98?se=2025-02-23T15%3A25%3A10Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D314e308b-944c-4235-8651-78923a10502a.png&sig=7D5Aia6RovvFAn7A/Y8O5668e1W/K5iitqX7E1k0m1c%3D";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="font-black uppercase tracking-tight">Konfirmasi Hapus</h3>
            </div>
            <p className="text-slate-600 font-medium mb-6">Apakah Anda yakin ingin menghapus data dana salur ini?</p>
            <div className="flex space-x-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">Batal</button>
              <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-slate-900 text-white shadow-xl no-print sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-blue-400" />
            <h1 className="font-black tracking-tighter uppercase italic">SP3B <span className="text-blue-400">PRO</span></h1>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-lg">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'report', label: 'Rekap' },
              { id: 'sp3b', label: 'Cetak SP3B' },
              { id: 'input', label: 'Edit Data' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 px-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border-l-8 border-blue-600 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Total Pendapatan</p>
                <p className="text-2xl font-black">{formatIDR(calculateTotalSalur())}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border-l-8 border-red-600 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Total Belanja</p>
                <p className="text-2xl font-black">{formatIDR(getTwExpenditureTotal(1)+getTwExpenditureTotal(2)+getTwExpenditureTotal(3)+getTwExpenditureTotal(4))}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border-l-8 border-emerald-600 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase mb-1">Sisa Saldo</p>
                <p className="text-2xl font-black">{formatIDR(getSaldoAkhirTw(4))}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'TW 1', val: getTwExpenditureTotal(1) },
                    { name: 'TW 2', val: getTwExpenditureTotal(2) },
                    { name: 'TW 3', val: getTwExpenditureTotal(3) },
                    { name: 'TW 4', val: getTwExpenditureTotal(4) },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} />
                    <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="flex justify-center animate-in fade-in duration-700">
            <div className="w-full max-w-4xl bg-white p-12 rounded-3xl shadow-2xl border border-slate-200">
              <div className="text-center mb-12 border-b-4 border-slate-900 pb-6">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">REKAPITULASI <span className="text-blue-600">PENDAPATAN DAN BELANJA</span></h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">DOKUMEN KONTROL KEUANGAN SEKOLAH TAHUN 2026</p>
              </div>

              <div className="grid grid-cols-2 gap-10 mb-10">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Identitas Sekolah</h3>
                  <div className="text-[11px] space-y-2">
                    <p className="flex justify-between font-bold"><span className="text-slate-400">NPSN:</span> {data.biodata.npsn}</p>
                    <p className="flex justify-between font-bold"><span className="text-slate-400">NAMA:</span> {data.biodata.namaSekolah}</p>
                    <p className="flex justify-between font-bold"><span className="text-slate-400">KECAMATAN:</span> {data.biodata.kecamatan}</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-center text-center">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Total Pagu SiLPA</p>
                  <p className="text-2xl font-black text-slate-900">{formatIDR(calculateTotalSilpa())}</p>
                </div>
              </div>

              <div className="mb-10 rounded-2xl border-2 border-slate-900 overflow-hidden shadow-lg">
                <div className="bg-slate-900 text-white p-4 font-black text-xs uppercase tracking-widest flex justify-between">
                  <span>Rekapitulasi Belanja Per Jenis</span>
                  <span className="text-blue-400">TA 2026</span>
                </div>
                <table className="w-full text-[10px] border-collapse">
                  <thead className="bg-slate-100 font-black text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-left border-r border-slate-200">JENIS BELANJA</th>
                      <th className="p-4 border-r border-slate-200">TW 1</th>
                      <th className="p-4 border-r border-slate-200">TW 2</th>
                      <th className="p-4 border-r border-slate-200">TW 3</th>
                      <th className="p-4">TW 4</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-800">
                    {data.rekapBelanja.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-4 text-left font-black bg-slate-50 border-r border-slate-200">{r.jenis}</td>
                        <td className="p-4 border-r border-slate-200">{formatIDR(r.trw1)}</td>
                        <td className="p-4 border-r border-slate-200">{formatIDR(r.trw2)}</td>
                        <td className="p-4 border-r border-slate-200">{formatIDR(r.trw3)}</td>
                        <td className="p-4">{formatIDR(r.trw4)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-200 text-slate-900 font-black">
                      <td className="p-4 text-left border-r border-slate-300">TOTAL BELANJA</td>
                      <td className="p-4 border-r border-slate-300">{formatIDR(getTwExpenditureTotal(1))}</td>
                      <td className="p-4 border-r border-slate-300">{formatIDR(getTwExpenditureTotal(2))}</td>
                      <td className="p-4 border-r border-slate-300">{formatIDR(getTwExpenditureTotal(3))}</td>
                      <td className="p-4">{formatIDR(getTwExpenditureTotal(4))}</td>
                    </tr>
                    <tr className="bg-blue-600 text-white font-black text-sm">
                      <td className="p-5 text-left border-r border-blue-500">SALDO AKHIR</td>
                      <td className="p-5 border-r border-blue-500">{formatIDR(getSaldoAkhirTw(1))}</td>
                      <td className="p-5 border-r border-blue-500">{formatIDR(getSaldoAkhirTw(2))}</td>
                      <td className="p-5 border-r border-blue-500">{formatIDR(getSaldoAkhirTw(3))}</td>
                      <td className="p-5">{formatIDR(getSaldoAkhirTw(4))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sp3b' && (
          <div className="flex flex-col items-center animate-in slide-in-from-bottom-4">
            <div className="no-print bg-white p-5 mb-6 rounded-2xl shadow-md border flex flex-col md:flex-row items-center gap-6">
               <div className="flex items-center space-x-3">
                 <span className="text-xs font-black text-slate-500 uppercase">Pilih Triwulan:</span>
                 <div className="flex space-x-1">
                   {[1,2,3,4].map(tw => (
                     <button 
                      key={tw}
                      onClick={() => setSelectedTw(tw as any)}
                      className={`px-4 py-2 rounded-lg text-xs font-black transition ${selectedTw === tw ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                     >
                       TW {tw}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
               <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-blue-500" />
                  <span className="text-xs font-black text-slate-500 uppercase">Edit Tanggal:</span>
                  <input 
                    type="date" 
                    value={data.tglTitiMangsa[selectedTw - 1]}
                    onChange={(e) => updateTitiMangsa(e.target.value)}
                    className="p-2 border rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  />
               </div>
            </div>

            {/* PRINT LAYOUT ADJUSTED FOR F4 (21.5cm x 33cm) */}
            <div className="sp3b-print-container w-[215mm] min-h-[330mm] bg-white shadow-2xl relative text-black print:shadow-none print:border-none border border-black overflow-hidden" style={{ fontFamily: 'Calibri, sans-serif' }}>
              
              <div className="flex border-b border-black h-[145px]">
                <div className="w-[21%] border-r border-black p-4 flex items-center justify-center">
                  <img src={LOGO_URL} alt="Logo Bekasi" className="w-[105px] h-auto" />
                </div>
                <div className="w-[79%] flex flex-col pt-3">
                  <div className="text-center font-bold mb-3">
                    <h2 className="text-[10pt] uppercase leading-tight font-bold">Pemerintah Kabupaten Bekasi</h2>
                    <h1 className="text-[13pt] uppercase leading-tight font-black tracking-tight">Surat Perintah Permintaan Pengesahan Belanja (SP3B)</h1>
                  </div>
                  <div className="px-5 text-[10.5pt] font-normal leading-tight">
                    <div className="grid grid-cols-12 gap-y-0.5">
                      <div className="col-span-4">Nama Sub Unit</div>
                      <div className="col-span-1 text-center">:</div>
                      <div className="col-span-7 font-bold">{data.biodata.namaSekolah}</div>
                      <div className="col-span-4">Tanggal</div>
                      <div className="col-span-1 text-center">:</div>
                      <div className="col-span-7">{new Date(data.tglTitiMangsa[selectedTw-1]).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</div>
                      <div className="col-span-4">Nomor</div>
                      <div className="col-span-1 text-center">:</div>
                      <div className="col-span-7">400.3.5.5/536/SP3B-TW{selectedTw}/DISDIK/2026</div>
                      <div className="col-span-4">Tahun Anggaran</div>
                      <div className="col-span-1 text-center">:</div>
                      <div className="col-span-7">2026</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 text-[11pt] leading-tight">
                <p className="mb-0.5">Kepala SKPD Dinas Pendidikan memohon kepada Bendahara Umum Daerah selaku PPKD</p>
                <p className="mb-2.5">agar mengesahkan dan membukukan pendapatan dan belanja sejumlah</p>
                <div className="border border-black border-dashed py-0.5 mt-1">
                   <div className="space-y-0">
                      <div className="flex items-center pl-6 h-[26px]">
                        <div className="w-[310px]">a. Saldo Awal</div>
                        <div className="w-[45px] border-l border-black border-dashed h-full flex items-center pl-2">Rp</div>
                        <div className="flex-1 text-right tabular-nums pr-20 h-full flex items-center justify-end">{formatNumber(getSaldoAwalTw(selectedTw))}</div>
                      </div>
                      <div className="flex items-center pl-6 h-[26px] border-t border-black border-dashed">
                        <div className="w-[310px]">b. Pendapatan</div>
                        <div className="w-[45px] border-l border-black border-dashed h-full flex items-center pl-2">Rp</div>
                        <div className="flex-1 text-right tabular-nums pr-20 h-full flex items-center justify-end">{formatNumber(getTwIncome(selectedTw))}</div>
                      </div>
                      <div className="flex flex-col border-t border-black border-dashed">
                        <div className="flex items-center pl-6 h-[26px]">
                          <div className="w-[310px]">c. Belanja</div>
                          <div className="w-[45px] border-l border-black border-dashed h-full flex items-center pl-2">Rp</div>
                          <div className="flex-1 text-right tabular-nums pr-20 h-full flex items-center justify-end">{formatNumber(getTwExpenditureTotal(selectedTw))}</div>
                        </div>
                        <div className="border-t border-black border-dashed">
                           {data.rekapBelanja.map((r, i) => (
                             <div key={i} className="flex items-center pl-14 h-[24px]">
                                <div className="w-[256px]">{i+1}. Belanja {r.jenis}</div>
                                <div className="w-[45px] border-l border-black border-dashed h-full flex items-center pl-2">Rp</div>
                                <div className="flex-1 text-right tabular-nums pr-20 h-full flex items-center justify-end">{formatNumber((r as any)[`trw${selectedTw}`])}</div>
                             </div>
                           ))}
                        </div>
                      </div>
                      <div className="flex items-center pl-6 h-[26px] border-t border-black border-dashed">
                        <div className="w-[310px]">d. Saldo Akhir</div>
                        <div className="w-[45px] border-l border-black border-dashed h-full flex items-center pl-2">Rp</div>
                        <div className="flex-1 text-right tabular-nums pr-20 h-full flex items-center justify-end font-bold">{formatNumber(getSaldoAkhirTw(selectedTw))}</div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-14 flex flex-col items-end px-12 text-[11pt]">
                 <div className="text-center w-[350px]">
                    <p className="mb-0.5">{data.biodata.kecamatan.charAt(0).toUpperCase() + data.biodata.kecamatan.slice(1).toLowerCase()}, {new Date(data.tglTitiMangsa[selectedTw-1]).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <p className="font-bold uppercase tracking-tight mb-20 leading-tight">Kuasa Pengguna Anggaran</p>
                    <p className="font-bold uppercase mb-0.5 leading-tight">{data.biodata.namaKepalaSekolah}</p>
                    <div className="text-center inline-block">
                      <p className="border-t border-black pt-0.5 inline-block min-w-[210px]">NIP. {data.biodata.nipKepsek}</p>
                    </div>
                 </div>
              </div>
            </div>

            <button onClick={() => window.print()} className="mt-8 no-print bg-slate-900 text-white px-10 py-4 rounded-full font-black flex items-center space-x-3 shadow-2xl hover:bg-blue-600 transition">
              <Printer size={24} />
              <span>CETAK DOKUMEN SP3B (F4)</span>
            </button>
          </div>
        )}

        {activeTab === 'input' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-300 max-w-5xl mx-auto mb-24 no-print">
            <header className="flex justify-between items-end border-b-2 border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Master Data Editor</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Input Parameter & Anggaran Sekolah</p>
              </div>
              <button 
                onClick={() => { setActiveTab('report'); window.scrollTo(0,0); }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition flex items-center space-x-2 shadow-lg"
              >
                <RefreshCcw size={18} /> <span>UPDATE LAPORAN</span>
              </button>
            </header>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center space-x-2 mb-6 border-b pb-2">
                  <School size={16} />
                  <span>1. Identitas & Biodata Sekolah</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {Object.keys(data.biodata).map((key) => (
                    <div key={key}>
                      <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input 
                        type="text" 
                        value={data.biodata[key as keyof typeof data.biodata]} 
                        onChange={(e) => setData({ ...data, biodata: { ...data.biodata, [key]: e.target.value } })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:bg-white focus:border-blue-500 transition outline-none"
                      />
                    </div>
                  ))}
                </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center space-x-2 mb-6 border-b pb-2">
                    <Coins size={16} />
                    <span>2. Pagu Saldo Awal (SiLPA)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {['reguler', 'afirmasi', 'kinerja'].map(k => (
                     <div key={k}>
                       <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">SiLPA {k}</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                          <input 
                            type="number" 
                            value={data.silpa[k as keyof typeof data.silpa]} 
                            onChange={(e) => setData({ ...data, silpa: { ...data.silpa, [k]: Number(e.target.value) || 0 } })}
                            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 shadow-inner focus:bg-white focus:border-blue-500 transition outline-none"
                          />
                       </div>
                     </div>
                   ))}
                </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center space-x-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  <span>3. Penyaluran Dana Pendapatan</span>
                </h3>
                <button 
                  onClick={() => setData({ ...data, danaSalur: [...data.danaSalur, { tahap: 'BARU', tglSalur: new Date().toISOString().split('T')[0], nilaiSalur: 0, keterangan: 'Triwulan 1' }] })}
                  className="bg-blue-600 text-white p-1.5 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {data.danaSalur.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 bg-slate-50 p-4 rounded-xl border items-center">
                    <div className="flex-1 w-full">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Keterangan Tahap</label>
                      <input className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-bold text-xs outline-none" value={item.tahap} onChange={(e) => {
                        const next = [...data.danaSalur];
                        next[idx].tahap = e.target.value;
                        setData({ ...data, danaSalur: next });
                      }} />
                    </div>
                    <div className="w-32">
                       <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Masa TW</label>
                       <select 
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black outline-none"
                        value={item.keterangan}
                        onChange={(e) => {
                          const next = [...data.danaSalur];
                          next[idx].keterangan = e.target.value;
                          setData({ ...data, danaSalur: next });
                        }}
                       >
                         <option value="Triwulan 1">TW 1</option>
                         <option value="Triwulan 2">TW 2</option>
                         <option value="Triwulan 3">TW 3</option>
                         <option value="Triwulan 4">TW 4</option>
                       </select>
                    </div>
                    <div className="flex-1 w-full relative">
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1">Nilai Salur</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                        <input type="number" className="w-full pl-8 p-2.5 bg-white border border-slate-200 rounded-lg font-black text-sm text-blue-600 outline-none" value={item.nilaiSalur} onChange={(e) => {
                          const next = [...data.danaSalur];
                          next[idx].nilaiSalur = Number(e.target.value) || 0;
                          setData({ ...data, danaSalur: next });
                        }} />
                      </div>
                    </div>
                    <button onClick={() => confirmDelete(idx)} className="p-2.5 bg-white text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm mt-4 md:mt-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center space-x-2 mb-6 border-b pb-2">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  <span>4. Belanja Per Triwulan</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase font-black text-[9px]">
                        <th className="p-3 text-left">Jenis Belanja</th>
                        <th className="p-3">TW 1 (Rp)</th>
                        <th className="p-3">TW 2 (Rp)</th>
                        <th className="p-3">TW 3 (Rp)</th>
                        <th className="p-3">TW 4 (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.rekapBelanja.map((r, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/20 transition">
                          <td className="p-2">
                            <input className="w-full p-2 bg-slate-50 border-none font-bold text-slate-700 outline-none uppercase text-[10px]" value={r.jenis} onChange={(e) => {
                              const next = [...data.rekapBelanja];
                              next[idx].jenis = e.target.value;
                              setData({ ...data, rekapBelanja: next });
                            }} />
                          </td>
                          {[1,2,3,4].map(tw => (
                            <td key={tw} className="p-1">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[8px]">Rp</span>
                                <input 
                                  type="number" 
                                  className="w-full pl-6 p-2 bg-white border border-slate-100 rounded text-center font-black text-blue-600 focus:border-blue-500 transition outline-none"
                                  value={(data.rekapBelanja[idx] as any)[`trw${tw}`]}
                                  onChange={(e) => {
                                    const next = [...data.rekapBelanja];
                                    (next[idx] as any)[`trw${tw}`] = Number(e.target.value) || 0;
                                    setData({ ...data, rekapBelanja: next });
                                  }}
                                />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
