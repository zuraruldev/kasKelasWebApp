'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import DonutChartCard from '@/components/DonutChartCard';
import TransactionTable from '@/components/TransactionTable';
import TransactionForm from '@/components/TransactionForm';
import QAPanel from '@/components/QAPanel';
import { CashTransaction, SummaryMetrics, TransactionFormData } from '@/types/database';
import {
  isCloudModeConfigured,
  fetchTransactions,
  insertTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/lib/supabase';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<CashTransaction | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [testFormData, setTestFormData] = useState<TransactionFormData | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const qaSectionRef = useRef<HTMLDivElement>(null);
  const tableSectionRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Gagal memuat transaksi:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics: SummaryMetrics = useMemo(() => {
    let totalMasuk = 0;
    let totalKeluar = 0;

    transactions.forEach((item) => {
      const nom = Number(item.nominal) || 0;
      if (item.jenis_transaksi === 'Masuk') {
        totalMasuk += nom;
      } else if (item.jenis_transaksi === 'Keluar') {
        totalKeluar += nom;
      }
    });

    return {
      totalSaldo: totalMasuk - totalKeluar,
      totalMasuk,
      totalKeluar,
    };
  }, [transactions]);

  const masukCount = useMemo(
    () => transactions.filter((t) => t.jenis_transaksi === 'Masuk').length,
    [transactions]
  );
  const keluarCount = useMemo(
    () => transactions.filter((t) => t.jenis_transaksi === 'Keluar').length,
    [transactions]
  );

  const handleFormSubmit = async (data: Omit<CashTransaction, 'id' | 'created_at'>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      await insertTransaction(data);
    }
    setTestFormData(null);
    await loadData();
    tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEdit = (transaction: CashTransaction) => {
    setEditingTransaction(transaction);
    setTestFormData(null);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setTestFormData(null);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteTransaction(id);
      if (editingTransaction && editingTransaction.id === id) {
        setEditingTransaction(null);
      }
      await loadData();
    } catch (err) {
      console.error('Gagal menghapus transaksi:', err);
    }
  };

  const handleTriggerTest = (formData: TransactionFormData) => {
    setEditingTransaction(null);
    setTestFormData(formData);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    const inputNominal = document.getElementById('input-nominal');
    if (inputNominal) {
      inputNominal.focus();
    }
  };

  const handleScrollToQA = () => {
    qaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectFilter = (filter: string) => {
    setCategoryFilter(filter);
    tableSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExportCSV = () => {
    const headers = ['No,Tanggal,Jenis Transaksi,Nominal,Keterangan\n'];
    const rows = transactions.map(
      (item, idx) =>
        `${idx + 1},"${item.tanggal}","${item.jenis_transaksi}",${item.nominal},"${item.keterangan.replace(/"/g, '""')}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kas_kelas_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatShortRupiah = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return `${val}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-row font-sans">
      {/* 1. Sidebar Navigation (Kas Kelas Focused) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        activeFilter={categoryFilter}
        onSelectFilter={handleSelectFilter}
        onScrollToForm={handleScrollToForm}
        onScrollToQA={handleScrollToQA}
        onExport={handleExportCSV}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <Header
          isCloudMode={isCloudModeConfigured}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onQuickAdd={handleScrollToForm}
        />

        {/* Breadcrumbs Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center text-xs text-slate-500">
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => handleSelectFilter('Semua')}>
            Home
          </span>
          <span className="mx-2 text-slate-400">»</span>
          <span className="text-blue-600 font-medium">Dashboard Kas Kelas</span>
          {categoryFilter !== 'Semua' && (
            <>
              <span className="mx-2 text-slate-400">»</span>
              <span className="text-slate-700 font-semibold">Filter: Kas {categoryFilter}</span>
            </>
          )}
          {editingTransaction && (
            <>
              <span className="mx-2 text-slate-400">»</span>
              <span className="text-amber-600 font-semibold">Mode Edit Transaksi</span>
            </>
          )}
        </div>

        {/* Dashboard Main Container */}
        <main className="p-4 sm:p-6 space-y-6 flex-1">
          {/* Top Row: 4 Metric Cards */}
          <SummaryCards
            metrics={metrics}
            transactionCount={transactions.length}
            masukCount={masukCount}
            keluarCount={keluarCount}
          />

          {/* Row 1: Riwayat Transaksi Table (Left, 8 cols) + Donut Chart Kas (Right, 4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Transaction Table */}
            <div ref={tableSectionRef} className="lg:col-span-8">
              <TransactionTable
                transactions={transactions}
                searchKeyword={searchKeyword}
                onSearchChange={setSearchKeyword}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onExportXLSX={handleExportCSV}
              />
            </div>

            {/* Right: Donut Chart (Distribusi Kas Masuk vs Kas Keluar) */}
            <div className="lg:col-span-4">
              <DonutChartCard
                title="Distribusi Arus Kas"
                subtitle="Kas Masuk vs Kas Keluar"
                segments={[
                  {
                    label: 'Kas Masuk',
                    value: metrics.totalMasuk || 1,
                    color: '#22c55e', // Green segment
                  },
                  {
                    label: 'Kas Keluar',
                    value: metrics.totalKeluar || 1,
                    color: '#ef4444', // Red segment
                  },
                ]}
                badge1={{
                  label: 'Masuk',
                  value: formatShortRupiah(metrics.totalMasuk),
                  bg: '#198754',
                }}
                badge2={{
                  label: 'Keluar',
                  value: formatShortRupiah(metrics.totalKeluar),
                  bg: '#dc3545',
                }}
                badge3={{
                  label: 'Saldo',
                  value: formatShortRupiah(metrics.totalSaldo),
                  bg: '#0d6efd',
                }}
              />
            </div>
          </div>

          {/* Row 2: Form Catat Transaksi (Left, 7 cols) + QA Panel (Right, 5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Transaction Input Form */}
            <div ref={formSectionRef} className="lg:col-span-7">
              <TransactionForm
                editingTransaction={editingTransaction}
                onSubmit={handleFormSubmit}
                onCancelEdit={handleCancelEdit}
                externalFormData={testFormData}
              />
            </div>

            {/* Right: QA Helper Panel */}
            <div ref={qaSectionRef} className="lg:col-span-5">
              <QAPanel onTriggerTest={handleTriggerTest} />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3.5 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 <strong className="text-slate-700">Kas Kelas Management</strong> &bull; Sesuai SKPL Manajemen Kas Kelas</span>
          <span className="text-slate-400">Next.js 15 &bull; TypeScript &bull; Tailwind CSS</span>
        </footer>
      </div>
    </div>
  );
}
