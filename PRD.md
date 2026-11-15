# Product Requirements Document (PRD)
## Sistem Manajemen Kas Kelas (Cashflow Tracker)

### 1. Identitas & Tujuan Aplikasi
- **Nama Aplikasi:** Sistem Manajemen Kas Kelas (Cashflow Tracker)
- **Ringkasan Sistem:** Aplikasi web pencatatan dan pengelolaan arus kas masuk (pemasukan/iuran) serta kas keluar (pengeluaran) kelas secara transparan, akurat, dan real-time. Aplikasi memfasilitasi bendahara kelas dalam memantau sisa saldo akhir secara otomatis.
- **Capaian Utama Sesuai SKPL:** Terbangunnya aplikasi manajemen kas berbasis web yang akurat, mencakup pengelolaan pencatatan transaksi kas (CRUD), kalkulasi saldo akhir dinamis, serta validasi input nominal angka non-negatif yang divalidasi melalui pengujian Black Box.
- **Tujuan Aplikasi:**
  1. Memfasilitasi pencatatan arus keuangan kas kelas secara transparan.
  2. Mengotomatiskan kalkulasi total saldo berdasarkan akumulasi transaksi pemasukan dan pengeluaran.
  3. Menerapkan validasi numerik pada transaksi keuangan dan pengujian fungsional dasar.

---

### 2. Spesifikasi Fungsional Lengkap (CRUD + Kalkulasi/Filter)
Aplikasi mencakup seluruh siklus operasional pengelolaan kas kelas:

- **REQ-01: Catat Transaksi Kas (Create)**
  - Formulir input mutasi kas baru untuk transaksi kas masuk maupun kas keluar.
  - Field yang dicatat: Tanggal transaksi (`tanggal`), Jenis transaksi (`jenis_transaksi`: 'Masuk' atau 'Keluar'), Nominal transaksi (`nominal`), dan Keterangan transaksi (`keterangan`).
  - Sistem memvalidasi input sebelum data dikirim ke Supabase.

- **REQ-02: Kalkulasi Saldo Otomatis & Indikator Finansial (Read - KPI Summary Cards)**
  - Menampilkan 3 kartu ringkasan keuangan di bagian atas:
    1. **Total Saldo Akhir:** Akumulasi `Total Kas Masuk - Total Kas Keluar`.
    2. **Total Kas Masuk:** Akumulasi nilai transaksi dengan `jenis_transaksi = 'Masuk'`.
    3. **Total Kas Keluar:** Akumulasi nilai transaksi dengan `jenis_transaksi = 'Keluar'`.
  - Format angka ditampilkan dalam format mata uang Rupiah (`id-ID`).

- **REQ-03: Riwayat Transaksi & Filter Interaktif (Read - Data Table)**
  - Menampilkan riwayat seluruh transaksi dalam tabel yang responsif dan terurut dari transaksi terbaru.
  - **Pencarian Real-Time:** Kotak pencarian untuk memfilter data berdasarkan kata kunci pada field `keterangan`.
  - **Filter Jenis:** Dropdown pilihan untuk memfilter tampilan data (`Semua`, `Masuk`, `Keluar`).
  - Penanda visual menggunakan badge status warna hijau untuk 'Masuk' dan merah untuk 'Keluar'.

- **REQ-04: Edit Transaksi Kas (Update)**
  - Setiap baris riwayat transaksi memiliki tombol **Edit**.
  - Saat tombol Edit ditekan, data transaksi dimuat kembali ke formulir input, judul form berganti menjadi "Edit Transaksi", dan tombol berubah menjadi "Perbarui Transaksi".
  - Tersedia tombol **Batal Edit** untuk mereset formulir kembali ke mode tambah baru.

- **REQ-05: Hapus Transaksi Kas (Delete)**
  - Setiap baris riwayat transaksi memiliki tombol **Hapus**.
  - Sistem menampilkan dialog konfirmasi keamanan sebelum penghapusan data dijalankan.
  - Data yang berhasil dihapus langsung memperbarui daftar tabel dan mengkalkulasi ulang saldo akhir secara instan.

---

### 3. Spesifikasi Skema Data (Supabase PostgreSQL)
Menggunakan nama tabel dan field yang 100% identik dengan Modul 2 SKPL:

- **Nama Tabel:** `public.cash_transactions`

| Nama Field | Tipe Data PostgreSQL | Constraint | Keterangan |
|---|---|---|---|
| `id` | `BIGINT` GENERATED ALWAYS AS IDENTITY | `PRIMARY KEY` | Identitas unik transaksi kas |
| `tanggal` | `DATE` | `NOT NULL DEFAULT CURRENT_DATE` | Tanggal transaksi kas |
| `jenis_transaksi` | `VARCHAR(10)` | `NOT NULL CHECK (jenis_transaksi IN ('Masuk', 'Keluar'))` | Jenis mutasi kas |
| `nominal` | `NUMERIC(12,2)` | `NOT NULL CHECK (nominal > 0)` | Nominal mutasi kas (wajib > 0) |
| `keterangan` | `TEXT` | `NOT NULL` | Keterangan keperluan transaksi |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Waktu pencatatan data ke sistem |

---

### 4. Kontrak Pengujian Black Box & Keamanan (Acuan Mutlak QA)

| ID Test | Kategori | Skenario Pengujian | Input Data | Hasil yang Diharapkan | Status |
|---|---|---|---|---|---|
| **TC-01** | Functional Validation | Input Nominal Negatif / Tidak Valid | Nominal: `-50000` | Sistem menolak input, tidak menyimpan data ke database, dan menampilkan pesan peringatan:<br>“**Nominal harus lebih dari 0**”. | PASS |
| **TC-02** | Functional Happy Path | Tambah Pemasukan Valid | Tanggal: Hari ini<br>Jenis: `Masuk`<br>Nominal: `20000`<br>Keterangan: `Iuran Kas Mingguan` | Data tersimpan ke database, riwayat transaksi muncul di tabel, dan total saldo bertambah sebesar **20.000**. | PASS |
| **SEC-01** | Security (Anti-XSS) | Uji Injeksi Script pada Input Teks | Keterangan: `<img src=x onerror=alert(1)>` | Karakter HTML/script disanitasi atau dirender sebagai teks biasa (`textContent`). Tidak terjadi eksekusi alert box di browser. | PASS |
| **SEC-02** | Security (Credential) | Audit Ketiadaan Secret Key di Frontend | File `index.html` dan script client | Hanya `SUPABASE_URL` dan `SUPABASE_ANON_KEY` yang terekspos. Secret key (`service_role` key) dan token rahasia tidak ditemukan di client. | PASS |
