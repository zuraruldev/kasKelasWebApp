import { createClient } from '@supabase/supabase-js';
import { CashTransaction } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const isCloudModeConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('your-supabase-publishable-anon-key')
);

export const supabase = isCloudModeConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial dummy data matching supabase_schema.sql
function getOffsetDate(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const INITIAL_DUMMY_DATA: CashTransaction[] = [
  {
    id: 1,
    tanggal: getOffsetDate(-3),
    jenis_transaksi: 'Masuk',
    nominal: 150000,
    keterangan: 'Iuran Kas Kelas Minggu Ke-1',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 2,
    tanggal: getOffsetDate(-2),
    jenis_transaksi: 'Keluar',
    nominal: 35000,
    keterangan: 'Pembelian Spidol & Penghapus Whiteboard',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 3,
    tanggal: getOffsetDate(-1),
    jenis_transaksi: 'Masuk',
    nominal: 100000,
    keterangan: 'Iuran Kas Kelas Minggu Ke-2',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const LOCAL_STORAGE_KEY = 'cash_transactions';

export async function fetchTransactions(): Promise<CashTransaction[]> {
  if (isCloudModeConfigured && supabase) {
    const { data, error } = await supabase
      .from('cash_transactions')
      .select('*')
      .order('tanggal', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase query error, fallback to localStorage:', error);
      return getLocalTransactions();
    }
    return (data as CashTransaction[]) || [];
  } else {
    return getLocalTransactions();
  }
}

export async function insertTransaction(
  payload: Omit<CashTransaction, 'id' | 'created_at'>
): Promise<CashTransaction> {
  if (isCloudModeConfigured && supabase) {
    const { data, error } = await supabase
      .from('cash_transactions')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insert error, saving to localStorage:', error);
      return insertLocalTransaction(payload);
    }
    return data[0] as CashTransaction;
  } else {
    return insertLocalTransaction(payload);
  }
}

export async function updateTransaction(
  id: number | string,
  payload: Partial<CashTransaction>
): Promise<CashTransaction> {
  if (isCloudModeConfigured && supabase) {
    const { data, error } = await supabase
      .from('cash_transactions')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.warn('Supabase update error, updating in localStorage:', error);
      return updateLocalTransaction(id, payload);
    }
    return data[0] as CashTransaction;
  } else {
    return updateLocalTransaction(id, payload);
  }
}

export async function deleteTransaction(id: number | string): Promise<void> {
  if (isCloudModeConfigured && supabase) {
    const { error } = await supabase
      .from('cash_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.warn('Supabase delete error, deleting from localStorage:', error);
      deleteLocalTransaction(id);
    }
  } else {
    deleteLocalTransaction(id);
  }
}

// LocalStorage helpers
function getLocalTransactions(): CashTransaction[] {
  if (typeof window === 'undefined') return INITIAL_DUMMY_DATA;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DUMMY_DATA));
    return INITIAL_DUMMY_DATA;
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed.sort(
      (a: CashTransaction, b: CashTransaction) =>
        new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime() ||
        Number(b.id) - Number(a.id)
    );
  } catch {
    return INITIAL_DUMMY_DATA;
  }
}

function insertLocalTransaction(
  payload: Omit<CashTransaction, 'id' | 'created_at'>
): CashTransaction {
  const current = getLocalTransactions();
  const newRecord: CashTransaction = {
    ...payload,
    id: Date.now(),
    created_at: new Date().toISOString()
  };
  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return newRecord;
}

function updateLocalTransaction(
  id: number | string,
  payload: Partial<CashTransaction>
): CashTransaction {
  const current = getLocalTransactions();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...payload } : item
  );
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated.find((item) => item.id === id) || (payload as CashTransaction);
}

function deleteLocalTransaction(id: number | string): void {
  const current = getLocalTransactions();
  const updated = current.filter((item) => item.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  }
}
