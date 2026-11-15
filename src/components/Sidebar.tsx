'use client';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  onScrollToForm: () => void;
  onScrollToQA: () => void;
  onExport: () => void;
}

export default function Sidebar({
  isOpen,
  onCloseMobile,
  activeFilter,
  onSelectFilter,
  onScrollToForm,
  onScrollToQA,
  onExport,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#272d36] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 shadow-xl lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 bg-[#1f242c] px-4 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-wide block leading-tight">Kas Kelas Management</span>
            <span className="text-[10px] text-slate-400 block">Cashflow Tracker</span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 text-xs">
          
          {/* Group 1: NAVIGASI KAS KELAS */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1">
              <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">NAVIGASI TRANSAKSI</p>
              <p className="text-[10px] text-slate-400">Filter tampilan kas kelas</p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                onSelectFilter('Semua');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer text-left ${
                activeFilter === 'Semua'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-300'
              }`}
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Semua Transaksi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectFilter('Masuk');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer text-left ${
                activeFilter === 'Masuk'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-300'
              }`}
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>Pemasukan (Kas Masuk)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectFilter('Keluar');
                onCloseMobile?.();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition cursor-pointer text-left ${
                activeFilter === 'Keluar'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-300'
              }`}
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>Pengeluaran (Kas Keluar)</span>
            </button>
          </div>

          {/* Group 2: AKSI CEPAT & OPERASIONAL */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1">
              <p className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">AKSI & OPERASIONAL</p>
              <p className="text-[10px] text-slate-400">Pencatatan & pengujian</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onScrollToForm();
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer text-left"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Catat Transaksi Baru</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onScrollToQA();
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer text-left"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Panel Uji SKPL (QA)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onExport();
                onCloseMobile?.();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-slate-300 hover:text-white transition cursor-pointer text-left"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Riwayat (XLSX)</span>
            </button>
          </div>

        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 bg-[#1f242c] border-t border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300">Bendahara Kelas</p>
          <p className="text-[10px] text-slate-500">Transparansi Kas Digital</p>
        </div>
      </aside>
    </>
  );
}
