'use client';

import { SummaryMetrics } from '@/types/database';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
  transactionCount: number;
  masukCount: number;
  keluarCount: number;
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function SummaryCards({
  metrics,
  transactionCount,
  masukCount,
  keluarCount,
}: SummaryCardsProps) {
  const masukPercentage = metrics.totalMasuk + metrics.totalKeluar > 0
    ? Math.round((metrics.totalMasuk / (metrics.totalMasuk + metrics.totalKeluar)) * 100)
    : 100;

  const keluarPercentage = metrics.totalMasuk + metrics.totalKeluar > 0
    ? Math.round((metrics.totalKeluar / (metrics.totalMasuk + metrics.totalKeluar)) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Blue - Total Saldo Akhir */}
      <div className="bg-[#0d6efd] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="p-4 sm:p-5 flex items-start justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currencyFormatter.format(metrics.totalSaldo)}
            </h3>
            <p className="text-xs text-white/90 font-medium mt-1">Total Saldo Kas</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <div className="bg-black/15 px-4 py-2 flex items-center justify-between text-xs text-white/90 font-medium">
          <span>Sisa Saldo Kas Kelas</span>
          <span>Aktif</span>
        </div>
      </div>

      {/* Card 2: Green - Total Kas Masuk */}
      <div className="bg-[#198754] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="p-4 sm:p-5 flex items-start justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currencyFormatter.format(metrics.totalMasuk)}
            </h3>
            <p className="text-xs text-white/90 font-medium mt-1">Total Kas Masuk</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
        <div className="bg-black/15 px-4 py-2 flex items-center justify-between text-xs text-white/90 font-medium">
          <span>{masukCount} Transaksi Pemasukan</span>
          <span>{masukPercentage}%</span>
        </div>
      </div>

      {/* Card 3: Orange/Red - Total Kas Keluar */}
      <div className="bg-[#fd7e14] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="p-4 sm:p-5 flex items-start justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currencyFormatter.format(metrics.totalKeluar)}
            </h3>
            <p className="text-xs text-white/90 font-medium mt-1">Total Kas Keluar</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </div>
        <div className="bg-black/15 px-4 py-2 flex items-center justify-between text-xs text-white/90 font-medium">
          <span>{keluarCount} Transaksi Pengeluaran</span>
          <span>{keluarPercentage}%</span>
        </div>
      </div>

      {/* Card 4: Indigo/Purple - Total Transaksi */}
      <div className="bg-[#4f46e5] rounded-xl text-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="p-4 sm:p-5 flex items-start justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {transactionCount} Transaksi
            </h3>
            <p className="text-xs text-white/90 font-medium mt-1">Total Transaksi Kas</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <div className="bg-black/15 px-4 py-2 flex items-center justify-between text-xs text-white/90 font-medium">
          <span>Masuk: {masukCount} | Keluar: {keluarCount}</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
