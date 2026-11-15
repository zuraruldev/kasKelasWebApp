'use client';

import { useState } from 'react';
import { CashTransaction } from '@/types/database';

interface TransactionTableProps {
  transactions: CashTransaction[];
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  onEdit: (transaction: CashTransaction) => void;
  onDelete: (id: number | string) => void;
  onExportXLSX?: () => void;
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export default function TransactionTable({
  transactions,
  searchKeyword,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  onEdit,
  onDelete,
  onExportXLSX,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = transactions.filter((item) => {
    const matchKeyword = (item.keterangan || '')
      .toLowerCase()
      .includes(searchKeyword.toLowerCase().trim());
    const matchCategory =
      categoryFilter === 'Semua' || item.jenis_transaksi === categoryFilter;
    return matchKeyword && matchCategory;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentEntries = filtered.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateStr: string) => {
    try {
      return dateFormatter.format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  const handleDeleteClick = (id: number | string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      onDelete(id);
    }
  };

  const handleExportCSV = () => {
    if (onExportXLSX) {
      onExportXLSX();
      return;
    }
    const headers = ['No,Tanggal,Jenis Transaksi,Nominal,Keterangan\n'];
    const rows = filtered.map(
      (item, idx) =>
        `${idx + 1},"${item.tanggal}","${item.jenis_transaksi}",${item.nominal},"${item.keterangan.replace(/"/g, '""')}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `riwayat_kas_kelas_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Card Header Title */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Riwayat Transaksi Kas</h3>
          <span className="text-xs text-slate-400 font-medium">Buku Kas Kelas</span>
        </div>

        {/* Toolbar: Filter Dropdown, XLSX Export, and Search Input */}
        <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">Tampilkan:</span>
            <select
              value={categoryFilter}
              onChange={(e) => {
                onCategoryFilterChange(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Semua">Semua Transaksi</option>
              <option value="Masuk">Kas Masuk</option>
              <option value="Keluar">Kas Keluar</option>
            </select>

            {/* XLSX Export Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded flex items-center gap-1.5 font-medium transition cursor-pointer"
              title="Export Data ke CSV/Excel"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>XLSX</span>
            </button>
          </div>

          {/* Search Box on Right */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Search:</span>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 w-full sm:w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Bordered Data Table */}
        <div className="overflow-x-auto px-4 pb-2">
          <table className="w-full text-left border border-slate-200 border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center">No</th>
                <th className="py-2.5 px-3 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Tanggal</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Jenis</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Nominal</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">
                  <div className="flex items-center justify-between">
                    <span>Keterangan</span>
                    <span className="text-slate-400 text-[10px]">▲▼</span>
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-36">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentEntries.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 border-r border-slate-200 text-center font-medium text-slate-500">
                    {startIndex + idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700 whitespace-nowrap">
                    {formatDate(item.tanggal)}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-200 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.jenis_transaksi === 'Masuk'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.jenis_transaksi}
                    </span>
                  </td>
                  <td
                    className={`py-2 px-3 border-r border-slate-200 font-bold whitespace-nowrap ${
                      item.jenis_transaksi === 'Masuk' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {item.jenis_transaksi === 'Masuk' ? '+ ' : '- '}
                    {currencyFormatter.format(item.nominal)}
                  </td>
                  {/* SAFE FROM XSS (SEC-01): JSX raw string binding compiles to safe textContent */}
                  <td className="py-2 px-3 border-r border-slate-200 text-slate-700 max-w-xs truncate" title={item.keterangan}>
                    {item.keterangan || '-'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Green Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="bg-[#198754] hover:bg-emerald-700 text-white font-medium text-[11px] px-2.5 py-1 rounded flex items-center gap-1 shadow-2xs transition"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      {/* Red Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)}
                        className="bg-[#dc3545] hover:bg-rose-700 text-white font-medium text-[11px] px-2.5 py-1 rounded flex items-center gap-1 shadow-2xs transition"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data transaksi ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Showing {filtered.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className={`px-2.5 py-1 border border-slate-200 rounded ${
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed bg-slate-50'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 flex items-center justify-center rounded font-semibold text-xs border ${
                currentPage === pageNum
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className={`px-2.5 py-1 border border-slate-200 rounded ${
              currentPage >= totalPages
                ? 'opacity-40 cursor-not-allowed bg-slate-50'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
