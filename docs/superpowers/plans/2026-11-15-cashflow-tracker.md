# Sistem Manajemen Kas Kelas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive, and secure single-file web application (`index.html`) for "Sistem Manajemen Kas Kelas" (Classroom Cashflow Tracker) with dual-mode Supabase Cloud / LocalStorage fallback, strict black-box validation, and anti-XSS protection.

**Architecture:** A standalone modern frontend client using Tailwind CSS and Supabase JS v2 SDK. A unified data layer dynamically switches between Supabase PostgreSQL table `cash_transactions` and `localStorage` demo mode, providing full CRUD, automated financial balance calculations, safe textContent rendering, and a 1-click QA simulation panel.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Supabase JS SDK v2 (CDN), Google Fonts (Plus Jakarta Sans / Inter), Vanilla JavaScript (ES6+).

**Spec:** `/home/zura/code/workshopJKB/PRD.md`, `/home/zura/code/workshopJKB/DESIGN.md`, `/home/zura/code/workshopJKB/RULES.md`, and `/home/zura/Obsidian Vault/workshopJKB1/master prompt 2.md`.

## Global Constraints

- **Single File:** The entire application must reside within `/home/zura/code/workshopJKB/index.html`.
- **Database Schema:** Table name must be `cash_transactions` and column names must strictly be `id`, `tanggal`, `jenis_transaksi`, `nominal`, `keterangan`, `created_at`.
- **Validation Message:** Exact warning string on invalid nominal (`<= 0` or NaN): `"Nominal harus lebih dari 0"`.
- **No HTML min Attribute:** Do NOT add `min="1"` to the nominal input element, allowing negative inputs for QA black-box testing.
- **Strict Anti-XSS (`SEC-01`):** No raw insertion of user-provided strings into `.innerHTML`; render via `document.createElement` + `.textContent` or `escapeHtml()`.
- **Security Key Guardrail (`SEC-02`):** Only `SUPABASE_URL` and `SUPABASE_ANON_KEY` are exposed; never embed `SERVICE_ROLE_KEY`.
- **Locale & Currency:** Format all monetary amounts in Indonesian Rupiah (`id-ID`) using `Intl.NumberFormat` and dates using `Intl.DateTimeFormat`.

## Review Focus

1. **Negative / Zero Nominal Input (`TC-01`):** User submits `-50000`, `0`, or alphabetic characters; system blocks database request, keeps data intact in form, and displays red alert box with `"Nominal harus lebih dari 0"`.
2. **XSS Script Injection (`SEC-01`):** User inputs `<img src=x onerror=alert(1)>` in `keterangan`; table renders literal text safely without firing alert popup.
3. **Empty Storage / First Load:** When storage is empty and Supabase credentials are placeholder strings, automatically initialize with 3 realistic dummy transactions and display "Local Demo Mode" with informative setup guide banner.
4. **CRUD State Recalculation:** Creating, editing, or deleting a transaction updates both the table and all 3 KPI cards (Saldo Akhir, Kas Masuk, Kas Keluar) accurately in real-time.
5. **Edit Mode Cancellation:** User enters edit mode for row, changes fields, then clicks "Batal Edit"; form resets to blank create mode without modifying original transaction.

---

### Task 1: HTML Skeleton, CDN Dependencies, and Dual-Mode Data Layer

**Files:**
- Create: `/home/zura/code/workshopJKB/index.html`

**Interfaces:**
- Produces: `DataManager` abstraction supporting `isCloudMode()`, `getAllTransactions()`, `createTransaction()`, `updateTransaction()`, `deleteTransaction()`, `initDefaultData()`.

- [ ] **Step 1: Write HTML5 base with Tailwind, Supabase SDK, and Google Fonts**
  Include Tailwind CSS CDN, Supabase JS v2 CDN, Google Fonts (Plus Jakarta Sans), and responsive viewport meta tags.
- [ ] **Step 2: Implement Config & DataManager Engine**
  Define `SUPABASE_URL` and `SUPABASE_ANON_KEY` placeholder constants. Implement smart detection: if URL is valid `https://*.supabase.co`, initialize `supabase.createClient()`; otherwise, fallback to `localStorage` with initial seed data (3 dummy transactions matching `supabase_schema.sql`).
- [ ] **Step 3: Verify DataManager dual-mode in browser/console**
  Ensure fallback to localStorage works cleanly when placeholders are set.

---

### Task 2: Application Header, KPI Metric Summary Cards, and Setup Banner

**Files:**
- Modify: `/home/zura/code/workshopJKB/index.html`

**Interfaces:**
- Consumes: `DataManager.isCloudMode()`, `DataManager.getAllTransactions()`
- Produces: `renderSummaryCards(transactions)`, `updateConnectionBadge()`

- [ ] **Step 1: Build Top Navigation Header**
  Create header bar with app icon, title "Sistem Manajemen Kas Kelas", subtitle "Pencatatan Arus Keuangan & Transparansi Saldo", and dynamic badge ("Cloud Supabase Active" in green or "Local Demo Mode" in amber with pulsing indicator).
- [ ] **Step 2: Build Dismissible Local Mode Banner**
  Add informative dismissible banner explaining how to connect Supabase (`SUPABASE_URL` & `SUPABASE_ANON_KEY`) while clarifying that demo mode is fully active.
- [ ] **Step 3: Build 3 KPI Cards Section**
  Implement top responsive grid for:
  1. Total Saldo Akhir (`Total Masuk - Total Keluar`) in bold typography with indigo accent.
  2. Total Kas Masuk in emerald-600 with incoming arrow icon.
  3. Total Kas Keluar in rose-600 with outgoing arrow icon.
  Format values using `new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })`.
- [ ] **Step 4: Verify balance calculation logic**
  Verify that summary cards correctly reflect seeded dummy data (e.g. Masuk: Rp 250.000, Keluar: Rp 35.000, Saldo: Rp 215.000).

---

### Task 3: Input Form with Black-Box Validation (`TC-01` & `TC-02`)

**Files:**
- Modify: `/home/zura/code/workshopJKB/index.html`

**Interfaces:**
- Produces: `handleSubmit(event)`, `showErrorAlert(msg)`, `hideErrorAlert()`, `resetForm()`

- [ ] **Step 1: Build Left Column Form UI**
  Construct "Catat Transaksi" card with fields:
  - `tanggal` (date input, default to today `YYYY-MM-DD`).
  - `jenis_transaksi` (segmented pill buttons or select for "Masuk" and "Keluar").
  - `nominal` (number input **without `min="1"` attribute** to permit negative numbers for QA).
  - `keterangan` (text input/textarea).
  - Action buttons: "Simpan Transaksi" (primary) and hidden "Batal Edit" (secondary).
- [ ] **Step 2: Build Red Error Alert Box**
  Place hidden dismissible alert container (`bg-rose-50 border-rose-200 text-rose-700`) inside the form.
- [ ] **Step 3: Implement Strict Validation Logic**
  On submit, parse `nominal`. If `isNaN(nominal) || nominal <= 0`, show alert with exact text: `"Nominal harus lebih dari 0"`, scroll to alert, and abort submission.
  If valid, hide alert and invoke DataManager.

---

### Task 4: Transaction History Table with Search, Filter, and Anti-XSS (`SEC-01`)

**Files:**
- Modify: `/home/zura/code/workshopJKB/index.html`

**Interfaces:**
- Consumes: `DataManager.getAllTransactions()`
- Produces: `renderTable(transactions)`, `createSafeTransactionRow(item)`

- [ ] **Step 1: Build Right Column Header & Toolbar**
  Construct "Riwayat Transaksi Kas" panel with:
  - Search input with search icon (`keterangan` filter).
  - Category dropdown filter (`Semua Transaksi`, `Kas Masuk`, `Kas Keluar`).
- [ ] **Step 2: Build Responsive Data Table**
  Create table with columns: Tanggal, Jenis, Nominal, Keterangan, and Aksi.
  Create empty state placeholder when no records match filter.
- [ ] **Step 3: Implement Safe DOM Rendering (`SEC-01`)**
  Write `createSafeTransactionRow(item)` using `document.createElement` and `.textContent` for dynamic text (`keterangan`, `nominal`, `tanggal`) to guarantee full immunity from script execution. Add badges (`emerald` for Masuk, `rose` for Keluar) and Edit/Hapus action buttons.
- [ ] **Step 4: Implement Real-Time Search & Category Filter**
  Wire `input` event on search box and `change` event on category select to dynamically filter displayed transactions.

---

### Task 5: Full CRUD Engine & State Management

**Files:**
- Modify: `/home/zura/code/workshopJKB/index.html`

**Interfaces:**
- Produces: `handleEdit(id)`, `handleDelete(id)`, `refreshUI()`

- [ ] **Step 1: Implement Create (Insert)**
  Save new transaction via `DataManager`, clear form, refresh table and summary cards.
- [ ] **Step 2: Implement Edit Mode (Update)**
  Clicking "Edit" populates form with transaction values, sets hidden `edit-id`, changes card title to "Edit Transaksi", changes submit button to "Perbarui Transaksi", and reveals "Batal Edit" button.
- [ ] **Step 3: Implement Cancel Edit**
  Clicking "Batal Edit" reverts form to initial blank create state.
- [ ] **Step 4: Implement Delete with Confirmation**
  Clicking "Hapus" triggers browser `confirm("Apakah Anda yakin ingin menghapus transaksi ini?")`. If confirmed, removes record and recalculates state.

---

### Task 6: 1-Click QA & Security Simulation Helper Bar

**Files:**
- Modify: `/home/zura/code/workshopJKB/index.html`

**Interfaces:**
- Produces: `runTestTC01()`, `runTestTC02()`, `runTestSEC01()`

- [ ] **Step 1: Build "Panel Uji Cepat SKPL (QA & Security Mode)" Bar**
  Add dedicated testing helper card under the transaction form with 3 styled action buttons:
  - Button `[Uji TC-01 (Input -50000)]`: Sets `nominal = -50000`, `jenis = 'Keluar'`, `keterangan = 'Pengujian TC-01 Nominal Negatif'`, and triggers submit to prove system displays "Nominal harus lebih dari 0".
  - Button `[Uji TC-02 (Input +20000)]`: Sets `nominal = 20000`, `jenis = 'Masuk'`, `keterangan = 'Iuran Kas Mingguan (TC-02)'`, and submits to prove balance increases by 20.000.
  - Button `[Uji SEC-01 (Payload XSS)]`: Sets `nominal = 15000`, `jenis = 'Masuk'`, `keterangan = '<img src=x onerror=alert("Jebol XSS!")>'`, submits, and verifies it renders as safe plain text in the table without firing an alert.

---

### Task 7: Verification and Quality Assurance

**Files:**
- Verify: `/home/zura/code/workshopJKB/index.html`

- [ ] **Step 1: Verify TC-01 Black Box Test**
  Execute negative nominal test and confirm `"Nominal harus lebih dari 0"` alert appears and no data is saved.
- [ ] **Step 2: Verify TC-02 Functional Happy Path**
  Execute valid income test and confirm data appears in table and balance increments by 20.000.
- [ ] **Step 3: Verify SEC-01 Anti-XSS Protection**
  Submit payload `<img src=x onerror=alert(1)>` and confirm text is safely escaped in DOM.
- [ ] **Step 4: Verify SEC-02 Credential Audit**
  Inspect code to ensure no secret keys or sensitive tokens exist.
