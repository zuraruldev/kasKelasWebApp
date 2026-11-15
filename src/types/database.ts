export type TransactionType = 'Masuk' | 'Keluar';

export interface CashTransaction {
  id: number | string;
  tanggal: string;
  jenis_transaksi: TransactionType;
  nominal: number;
  keterangan: string;
  created_at?: string;
}

export interface TransactionFormData {
  tanggal: string;
  jenis_transaksi: TransactionType;
  nominal: string;
  keterangan: string;
}

export interface SummaryMetrics {
  totalSaldo: number;
  totalMasuk: number;
  totalKeluar: number;
}
