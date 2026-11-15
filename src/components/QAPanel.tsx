'use client';

import { TransactionFormData } from '@/types/database';

interface QAPanelProps {
  onTriggerTest: (formData: TransactionFormData) => void;
}

export default function QAPanel({ onTriggerTest }: QAPanelProps) {
  const handleTC01 = () => {
    onTriggerTest({
      tanggal: new Date().toISOString().split('T')[0],
      jenis_transaksi: 'Keluar',
      nominal: '-50000',
      keterangan: 'Pengujian TC-01 Nominal Negatif',
    });
  };

  const handleTC02 = () => {
    onTriggerTest({
      tanggal: new Date().toISOString().split('T')[0],
      jenis_transaksi: 'Masuk',
      nominal: '20000',
      keterangan: 'Iuran Kas Mingguan (Uji TC-02)',
    });
  };

  const handleSEC01 = () => {
    onTriggerTest({
      tanggal: new Date().toISOString().split('T')[0],
      jenis_transaksi: 'Masuk',
      nominal: '15000',
      keterangan: '<img src=x onerror=alert("Jebol XSS!")>',
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs bg-gradient-to-b from-indigo-50/40 to-white">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-indigo-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
          Panel Uji Cepat SKPL (QA & Security)
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-3">Tombol otomatisasi skenario uji sesuai kontrak PRD:</p>
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleTC01}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition flex items-center justify-between"
        >
          <span><strong>TC-01:</strong> Input Nominal Negatif (-50000)</span>
          <span className="text-[10px] bg-rose-200 px-1.5 py-0.5 rounded font-semibold">Tolak</span>
        </button>
        <button
          type="button"
          onClick={handleTC02}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition flex items-center justify-between"
        >
          <span><strong>TC-02:</strong> Pemasukan Valid (+20000)</span>
          <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded font-semibold">Sukses</span>
        </button>
        <button
          type="button"
          onClick={handleSEC01}
          className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition flex items-center justify-between"
        >
          <span><strong>SEC-01:</strong> Uji Injeksi XSS (&lt;img onerror&gt;)</span>
          <span className="text-[10px] bg-indigo-200 px-1.5 py-0.5 rounded font-semibold">Sanitasi</span>
        </button>
      </div>
    </div>
  );
}
