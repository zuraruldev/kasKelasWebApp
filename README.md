# Sistem Manajemen Kas Kelas (Cashflow Tracker)

[![Application Status](https://img.shields.io/badge/Status-Production%20Ready-emerald.svg)](#)
[![Security Audit](https://img.shields.io/badge/Security%20Audit-PASSED%20(SEC--01%20%7C%20SEC--02)-indigo.svg)](#)
[![Black Box Testing](https://img.shields.io/badge/Black%20Box%20Testing-PASSED%20(TC--01%20%7C%20TC--02)-emerald.svg)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-Tailwind%20CSS%20%7C%20Supabase-blue.svg)](#)

Aplikasi web manajemen keuangan kas kelas berbasis cloud yang dirancang untuk mencatat, mengelola, serta menyajikan transparansi arus kas masuk (pemasukan/iuran) dan kas keluar (pengeluaran) kelas secara akurat dan real-time.

---

## 🏛️ Arsitektur Spec-Driven Vibe Coding

Proyek ini dibangun menggunakan metodologi **Spec-Driven Vibe Coding**, di mana setiap baris kode dikendalikan secara ketat oleh dokumen spesifikasi formal sebelum proses penulisan kode dimulai:

```
SKPL_Manajemen_Kas_Kelas.md (Kebutuhan Awal)
   ├── PRD.md (Product Requirements Document & Spesifikasi Skema Data)
   ├── DESIGN.md (Design System, Tokens, & Panduan UI Tailwind CSS)
   ├── RULES.md (Hukum Mutlak Keamanan Anti-XSS & Validasi Bisnis)
   ├── supabase_schema.sql (PostgreSQL Schema, Constraint, & RLS Policies)
   └── index.html (Aplikasi Web Single-File Siap Produksi)
```

Arsitektur ini menjamin tidak adanya deviasi antara spesifikasi bisnis, skema basis data PostgreSQL di Supabase, dan implementasi antarmuka di sisi klien.

---

## ✨ Fitur Utama Aplikasi

- **REQ-01: Catat Transaksi Kas (Create)**  
  Formulir input mutasi kas baru untuk transaksi kas masuk (emerald) maupun kas keluar (rose) yang dilengkapi validasi sisi klien.
- **REQ-02: Kalkulasi Saldo Otomatis (Read - KPI Summary Cards)**  
  Tiga kartu ringkasan keuangan dinamis di bagian atas (*Total Saldo Akhir*, *Total Kas Masuk*, *Total Kas Keluar*) dengan kalkulasi otomatis dalam format mata uang Rupiah Indonesia (`id-ID`).
- **REQ-03: Riwayat Transaksi & Filter Interaktif (Read - Interactive Table)**  
  Tabel riwayat mutasi kas lengkap dengan pencarian kata kunci (*search by description*) dan filter dropdown (*Semua*, *Kas Masuk*, *Kas Keluar*).
- **REQ-04: Edit Transaksi Kas (Update)**  
  Fitur pengeditan baris data transaksi yang langsung menaikkan nilai ke formulir input, dilengkapi opsi "Batal Edit" untuk mereset status form.
- **REQ-05: Hapus Transaksi Kas (Delete)**  
  Fitur penghapusan transaksi salah input dengan dialog konfirmasi keamanan serta rekalkulasi saldo seketika.
- **Dual-Mode Data Engine:**  
  Dukungan koneksi langsung ke **Cloud Supabase PostgreSQL** dengan fallback otomatis ke **Local Demo Mode (`localStorage`)** jika kredensial belum dikonfigurasi.

---

## 🧪 Hasil Pengujian Black Box & Security Assessment

Aplikasi telah diaudit secara ketat dan dinyatakan **LULUS (100% PASS)** seluruh skenario pengujian:

| ID Test | Kategori Pengujian | Skenario Uji | Input Data | Hasil Aktual | Status |
|---|---|---|---|---|---|
| **TC-01** | Black Box Validation | Input Nominal Negatif / Nol | `nominal: -50000` | Input ditolak, request database dibatalkan, dan memunculkan pesan peringatan exact match: **"Nominal harus lebih dari 0"**. | **PASS** |
| **TC-02** | Black Box Functional | Tambah Pemasukan Valid | `nominal: 20000`, `jenis: Masuk` | Transaksi berhasil tersimpan, riwayat transaksi muncul, dan total saldo bertambah sebesar **Rp 20.000**. | **PASS** |
| **SEC-01** | Security (Anti-XSS) | Injeksi Payload Script pada Input Teks | `<img src=x onerror=alert('Jebol XSS!')>` | Karakter teks disanitasi menggunakan DOM API `.textContent`. Tidak terjadi eksekusi alert box di peramban. | **PASS** |
| **SEC-02** | Security (Credentials) | Audit Pencegahan Kebocoran Secret Key | Inspeksi Berkas Frontend | Hanya `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` yang digunakan di klien. `SUPABASE_SECRET_KEY` tidak diekspos. | **PASS** |

> *Catatan Penguji:* Aplikasi dilengkapi panel **"Panel Uji Cepat SKPL (QA & Security Mode)"** di bawah form untuk memicu skenario `TC-01`, `TC-02`, dan `SEC-01` dalam 1 kali klik.

---

## 🚀 Panduan Setup & Database Supabase

### 1. Inisialisasi Database Supabase
1. Masuk ke dashboard proyek Supabase Anda di [supabase.com](https://supabase.com).
2. Buka menu **SQL Editor**, buat kueri baru, lalu salin dan jalankan seluruh isi berkas [`supabase_schema.sql`](./supabase_schema.sql).
3. Skrip ini akan membuat tabel `cash_transactions`, constraint `CHECK (nominal > 0)`, mengaktifkan Row Level Security (RLS), serta memasang kebijakan akses CRUD.

### 2. Konfigurasi Environment (`.env.local`)
Salin file template `.env.example` ke `.env.local` dan isi kredensial publik Supabase Anda:
```bash
cp .env.example .env.local
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://vokdywovcatrjxsggzml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KJAkaq8neCR50R9NP_6SDQ_vPK687Up
```

### 3. Menjalankan di Lingkungan Lokal
```bash
npm install
npm run dev
```
Buka browser pada `http://localhost:3000`.

---

## 🌐 Panduan Deployment ke Vercel

Aplikasi ini menggunakan **Next.js 15 App Router** dengan deteksi otomatis di Vercel:

### Opsi A: Deployment via GitHub (Direkomendasikan)
1. Push repositori ini ke GitHub:
   ```bash
   git add .
   git commit -m "feat: migrate to Next.js 15 App Router with TypeScript"
   git push -u origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori `zuraruldev/kasKelasWebApp`.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Publishable Anon Key Supabase Anda
5. Klik tombol **Deploy**. Vercel akan otomatis menjalankan `next build`.

---

## 📂 Struktur Repositori

```
├── .env.example           # Template environment variable aman (publik)
├── .env.local             # Kredensial lokal Supabase (diabaikan oleh .gitignore)
├── .gitignore             # Aturan proteksi file sensitif & kredensial
├── src/
│   ├── app/               # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/        # Komponen modular (Header, SummaryCards, Form, Table, QAPanel)
│   ├── lib/               # Supabase client & dual-mode data layer fallback
│   └── types/             # Definisi tipe data TypeScript database & form
├── PRD.md                 # Product Requirements Document
├── DESIGN.md              # Design system & pedoman UI Tailwind
├── RULES.md               # Aturan keamanan & panduan coding AI
├── supabase_schema.sql    # Skrip DDL & DML basis data Supabase
├── AUDIT_REPORT.md        # Laporan pengujian Black Box & Security
└── README.md              # Dokumentasi teknis repositori
```

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk keperluan Workshop JKB &copy; 2026. Bebas digunakan untuk keperluan edukasi dan pengelolaan kas organisasi.
