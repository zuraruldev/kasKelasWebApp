# DESIGN.md — Design System & UI Guidelines
## Sistem Manajemen Kas Kelas

Dokumen ini adalah acuan standar visual dan panduan antarmuka untuk pengembangan aplikasi Sistem Manajemen Kas Kelas menggunakan Tailwind CSS.

---

### 1. Palet Warna Tailwind CSS

| Kategori | Class Tailwind | Nilai HEX / Fungsi | Penggunaan |
|---|---|---|---|
| **Background Aplikasi** | `bg-slate-50` | `#F8FAFC` | Latar belakang kanvas utama aplikasi |
| **Card & Surface** | `bg-white` | `#FFFFFF` | Kontainer kartu, form, tabel, dan modal |
| **Card Border** | `border-slate-200` | `#E2E8F0` | Garis pembatas kartu, input, dan tabel |
| **Warna Primer** | `bg-indigo-600` | `#4F46E5` | Tombol utama, active state, indikator fokus |
| **Primer Hover** | `hover:bg-indigo-700` | `#4338CA` | Hover state tombol primer |
| **Primer Light** | `bg-indigo-50` / `text-indigo-700` | `#EEF2FF` / `#4338CA` | Highlight kartu Saldo Akhir |
| **Sukses / Kas Masuk** | `emerald-600` / `emerald-50` | `#059669` / `#ECFDF5` | Nilai kas masuk, badge 'Masuk', status online |
| **Bahaya / Kas Keluar / Error** | `rose-600` / `rose-50` | `#E11D48` / `#FFF1F2` | Nilai kas keluar, badge 'Keluar', tombol hapus, alert error |
| **Teks Primer** | `text-slate-900` | `#0F172A` | Judul, nominal utama, teks tebal |
| **Teks Sekunder** | `text-slate-600` / `text-slate-500` | `#475569` / `#64748B` | Label form, subjudul, placeholder |

---

### 2. Tipografi & Tata Letak

- **Font Family:** `font-sans` (`Inter`, `Plus Jakarta Sans`, atau `ui-sans-serif, system-ui`).
- **Skala Tipografi:**
  - `text-2xl font-bold tracking-tight`: Judul Header Utama.
  - `text-xl font-bold`: Angka nilai metrik pada KPI card.
  - `text-base font-semibold`: Header kartu (Form & Riwayat).
  - `text-sm font-medium`: Label input, th tabel, dan tombol.
  - `text-xs`: Badge status dan tanggal metadata.
- **Format Data Indonesia (`id-ID`):**
  - **Mata Uang:** Wajib menggunakan format Rupiah standar Indonesia:
    `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)`  
    *(Contoh: Rp 20.000)*
  - **Tanggal:** Format tanggal Indonesia standar:
    `new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))`  
    *(Contoh: 15 Nov 2026)*

---

### 3. Komponen Interaktif & State Standar

#### A. Alert Banner Validasi Error (`TC-01`)
- Kontainer error tampil dinamis di atas formulir saat validasi input gagal:
  ```html
  <div class="hidden bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-4" id="alert-error" role="alert">
    <svg class="w-5 h-5 flex-shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">...</svg>
    <span id="alert-message">Nominal harus lebih dari 0</span>
  </div>
  ```

#### B. Loading State pada Tombol
- Saat request Supabase berlangsung, tombol `Simpan` beralih ke mode disabled dan menampilkan spinner:
  - Class: `opacity-75 cursor-not-allowed pointer-events-none`
  - Konten teks: `<svg class="animate-spin ..."></svg> Menyimpan...`

#### C. Empty State pada Tabel
- Jika belum ada data transaksi atau pencarian tidak menghasilkan data:
  - Tampilkan ilustrasi atau ikon folder/dokumen kosong.
  - Pesan teks: `"Belum ada data transaksi"` dengan subteks `"Silakan tambahkan data melalui form di sebelah kiri."`
  - Padding luas: `py-12 text-center text-slate-400`.

#### D. Badges Status Mutasi
- **Badge Kas Masuk:** `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200`
- **Badge Kas Keluar:** `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200`
