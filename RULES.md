# RULES.md — AI Coding & Security Guardrails
## Sistem Manajemen Kas Kelas

Dokumen ini berisi instruksi dan batasan teknis hukum wajib bagi AI Coding Assistant dan pengembang dalam mengimplementasikan kode aplikasi di repository ini.

---

### 1. Kepatuhan Skema & Spesifikasi (Schema & Spec Compliance)
- **Nama Tabel Database:** Wajib `cash_transactions` (huruf kecil, snake_case).
- **Nama Kolom:** Wajib 100% identik dengan SKPL Modul 2 dan `PRD.md`:
  - `id`
  - `tanggal`
  - `jenis_transaksi` (hanya nilai: `'Masuk'` atau `'Keluar'`)
  - `nominal` (angka desimal/numerik positif)
  - `keterangan` (teks deskripsi)
  - `created_at` (timestamp)
- **Larangan Modifikasi:** DILARANG mengubah nama kolom menjadi Bahasa Inggris (misal: mengganti `tanggal` menjadi `date` atau `nominal` menjadi `amount`) karena akan merusak kontrak pengujian dan query database.

---

### 2. Aturan Mutlak Anti-XSS (`SEC-01`)
- **DILARANG KERAS** menyisipkan data dari pengguna atau database secara mentah ke dalam DOM menggunakan properti berikut tanpa sanitasi ketat:
  - `element.innerHTML = ...` (DILARANG untuk untrusted input)
  - `element.outerHTML = ...` (DILARANG)
  - `document.write(...)` (DILARANG)
- **STANDAR AMAN WAJIB:**
  1. Gunakan `.textContent` atau `.innerText` saat menampilkan teks dinamis seperti nominal, keterangan, atau tanggal:
     ```javascript
     const tdKet = document.createElement('td');
     tdKet.textContent = item.keterangan; // Aman dari XSS
     ```
  2. Apabila harus merender template string HTML, seluruh input wajib melewati fungsi helper sanitasi `escapeHtml()`:
     ```javascript
     function escapeHtml(str) {
       if (str === null || str === undefined) return '';
       return String(str)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;');
     }
     ```
  3. Uji ketahanan dengan payload: `<img src=x onerror=alert(1)>`. Payload tersebut TIDAK BOLEH mengeksekusi alert.

---

### 3. Aturan Mutlak Validasi Input (`TC-01` & `TC-02`)
- **Validasi Frontend Mandiri:** Jangan hanya mengandalkan atribut HTML5 seperti `min="1"` atau `required`, karena atribut tersebut dapat dimanipulasi melalui browser DevTools.
- **Logika Validasi JavaScript Wajib:** Sebelum memanggil client Supabase (`supabase.from('cash_transactions').insert(...)`), lakukan pengecekan nilai:
  ```javascript
  const nominalNum = parseFloat(nominalInput.value);
  if (isNaN(nominalNum) || nominalNum <= 0) {
    showErrorAlert('Nominal harus lebih dari 0');
    return; // Hentikan eksekusi, cegah request ke database
  }
  ```
- **Kalimat Pesan Error:** Pesan peringatan kesalahan nominal negatif/nol WAJIB PERSIS:
  > **"Nominal harus lebih dari 0"**
  (Tidak boleh diganti menjadi "Harap isi nominal valid" atau teks lainnya agar lulus uji `TC-01`).

---

### 4. Aturan Keamanan Kredensial (`SEC-02`)
- Hanya gunakan variabel publik berikut pada client-side frontend (`index.html` atau file `.js`):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY` (Public Anon Key)
- **DILARANG KERAS:**
  - Menyimpan `SUPABASE_SERVICE_ROLE_KEY` di repository frontend.
  - Menyimpan API Key Google Stitch atau token akses berhak administrator.
  - Membocorkan kredensial pribadi atau token database ke riwayat commit git.
