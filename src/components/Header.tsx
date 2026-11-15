'use client';

interface HeaderProps {
  isCloudMode: boolean;
  onToggleSidebar: () => void;
  onQuickAdd: () => void;
}

export default function Header({ isCloudMode, onToggleSidebar, onQuickAdd }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none cursor-pointer"
          title="Buka/Tutup Menu Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            Kas Kelas Management
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Pencatatan Arus Kas & Transparansi Saldo
          </p>
        </div>
      </div>

      {/* Right: Quick Action & Status Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Button */}
        <button
          type="button"
          onClick={onQuickAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Catat Transaksi</span>
          <span className="sm:hidden">Tambah</span>
        </button>

        {/* Supabase Status Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
            isCloudMode
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCloudMode ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="hidden md:inline">{isCloudMode ? 'Cloud Supabase Active' : 'Local Demo Mode'}</span>
          <span className="md:hidden">{isCloudMode ? 'Cloud' : 'Demo'}</span>
        </div>
      </div>
    </header>
  );
}
