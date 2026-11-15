'use client';

import { useState, useEffect } from 'react';
import { CashTransaction, TransactionFormData, TransactionType } from '@/types/database';

interface TransactionFormProps {
  editingTransaction: CashTransaction | null;
  onSubmit: (data: Omit<CashTransaction, 'id' | 'created_at'>) => Promise<void>;
  onCancelEdit: () => void;
  externalFormData?: TransactionFormData | null;
}

export default function TransactionForm({
  editingTransaction,
  onSubmit,
  onCancelEdit,
  externalFormData,
}: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    tanggal: new Date().toISOString().split('T')[0],
    jenis_transaksi: 'Masuk',
    nominal: '',
    keterangan: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        tanggal: editingTransaction.tanggal,
        jenis_transaksi: editingTransaction.jenis_transaksi,
        nominal: editingTransaction.nominal.toString(),
        keterangan: editingTransaction.keterangan,
      });
      setErrorMessage(null);
    } else {
      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        jenis_transaksi: 'Masuk',
        nominal: '',
        keterangan: '',
      });
      setErrorMessage(null);
    }
  }, [editingTransaction]);

  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
      setErrorMessage(null);
    }
  }, [externalFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // VALIDASI KETAT BLACK BOX (TC-01):
    const nominalNum = parseFloat(formData.nominal);
    if (isNaN(nominalNum) || nominalNum <= 0) {
      setErrorMessage('Nominal harus lebih dari 0');
      return;
    }

    if (!formData.tanggal) {
      setErrorMessage('Tanggal transaksi wajib dipilih');
      return;
    }

    if (!formData.keterangan.trim()) {
      setErrorMessage('Keterangan transaksi wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        tanggal: formData.tanggal,
        jenis_transaksi: formData.jenis_transaksi,
        nominal: nominalNum,
        keterangan: formData.keterangan.trim(),
      });

      if (!editingTransaction) {
        setFormData({
          tanggal: new Date().toISOString().split('T')[0],
          jenis_transaksi: 'Masuk',
          nominal: '',
          keterangan: '',
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan transaksi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeSelect = (type: TransactionType) => {
    setFormData((prev) => ({ ...prev, jenis_transaksi: type }));
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>{editingTransaction ? 'Edit Transaksi' : 'Catat Transaksi'}</span>
        </h2>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            editingTransaction ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-600'
          }`}
        >
          {editingTransaction ? 'Edit Mode' : 'Baru'}
        </span>
      </div>

      {/* Alert Error Box (TC-01 Validation Display) */}
      {errorMessage && (
        <div
          id="alert-error"
          className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5 mb-5 shadow-xs"
          role="alert"
        >
          <svg className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="font-bold text-rose-800">Peringatan Validasi</p>
            <p id="alert-message" className="text-xs mt-0.5 font-medium">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-600"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <form id="transaction-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Tanggal */}
        <div>
          <label htmlFor="input-tanggal" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tanggal Transaksi
          </label>
          <input
            type="date"
            id="input-tanggal"
            required
            value={formData.tanggal}
            onChange={(e) => setFormData((prev) => ({ ...prev, tanggal: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
          />
        </div>

        {/* Jenis Transaksi */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Jenis Transaksi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-type-masuk"
              onClick={() => handleTypeSelect('Masuk')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                formData.jenis_transaksi === 'Masuk'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Kas Masuk
            </button>
            <button
              type="button"
              id="btn-type-keluar"
              onClick={() => handleTypeSelect('Keluar')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                formData.jenis_transaksi === 'Keluar'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-400'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Kas Keluar
            </button>
          </div>
        </div>

        {/* Nominal: DILARANG pasang min="1" agar penguji dapat input negatif untuk TC-01 */}
        <div>
          <label htmlFor="input-nominal" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nominal (Rupiah)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
              Rp
            </div>
            <input
              type="number"
              id="input-nominal"
              placeholder="Contoh: 50000"
              value={formData.nominal}
              onChange={(e) => setFormData((prev) => ({ ...prev, nominal: e.target.value }))}
              className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Wajib bernilai positif (angka di atas 0).</p>
        </div>

        {/* Keterangan */}
        <div>
          <label htmlFor="input-keterangan" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Keterangan
          </label>
          <textarea
            id="input-keterangan"
            rows={3}
            placeholder="Contoh: Iuran kas kelas minggu ke-1..."
            required
            value={formData.keterangan}
            onChange={(e) => setFormData((prev) => ({ ...prev, keterangan: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            id="btn-submit"
            disabled={isSubmitting}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{isSubmitting ? 'Menyimpan...' : editingTransaction ? 'Perbarui Transaksi' : 'Simpan Transaksi'}</span>
          </button>

          {editingTransaction && (
            <button
              type="button"
              id="btn-cancel"
              onClick={onCancelEdit}
              className="w-full py-2 px-4 rounded-xl font-semibold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
            >
              Batal Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
