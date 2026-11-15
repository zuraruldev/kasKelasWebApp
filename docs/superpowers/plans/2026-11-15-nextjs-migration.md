# Next.js & TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the single-file HTML application to a modern Next.js 15+ App Router application with TypeScript, Tailwind CSS, modular components, and separated environment variables (`.env.local` and `.env.example`).

**Architecture:** Next.js App Router with client components for interactive state management. Environment variables are loaded securely via `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Clean component decomposition separates the Header, KPI Summary, Input Form (with TC-01 validation), Data Table (with search/filter), and 1-Click QA Simulation Panel.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, `@supabase/supabase-js`.

**Spec:** `/home/zura/code/workshopJKB/PRD.md`, `/home/zura/code/workshopJKB/DESIGN.md`, `/home/zura/code/workshopJKB/RULES.md`, and `/home/zura/code/workshopJKB/AUDIT_REPORT.md`.

## Global Constraints

- **App Router:** Use `src/app` directory layout with standard Next.js App Router.
- **Environment Isolation:** Place real credentials exclusively in `.env.local` (ignored by `.gitignore`). Provide `.env.example` with placeholders.
- **Secret Key Prevention (`SEC-02`):** Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are exposed to the client. Never include `SUPABASE_SECRET_KEY`.
- **Validation Contract (`TC-01`):** Nominal input must not have `min="1"` attribute; JS validation must verify `nominal <= 0 || isNaN(nominal)` and display the exact string `"Nominal harus lebih dari 0"`.
- **Anti-XSS (`SEC-01`):** Use React JSX native string binding (`{item.keterangan}`) which natively compiles to safe textContent; never use `dangerouslySetInnerHTML`.
- **TypeScript Strictness:** Strict typing for all database models, form states, and API responses in `src/types/database.ts`.

## Review Focus

1. **Build & Typecheck:** `npm run build` succeeds with zero TypeScript errors or linter warnings.
2. **Environment Fallback:** If `.env.local` is missing or variables are empty, gracefully fall back to local demo mode (`localStorage`) without runtime crash.
3. **Form Negative Nominal (`TC-01`):** Submitting `-50000` halts database call and shows `"Nominal harus lebih dari 0"`.
4. **Anti-XSS (`SEC-01`):** Submitting `<img src=x onerror=alert(1)>` renders literal text in the table.
5. **Full CRUD Interactivity:** Adding, editing, and deleting records updates both the table and KPI balance calculations.

---

### Task 1: Next.js, TypeScript, and Tailwind Configuration & Environment Files

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `.env.local`, `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create package.json and install dependencies**
  Configure scripts: `dev`, `build`, `start`, `lint`, and install `next`, `react`, `react-dom`, `@supabase/supabase-js`, `typescript`, `@types/react`, `@types/node`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`.
- [ ] **Step 2: Configure TypeScript, Tailwind, and PostCSS**
  Create standard `tsconfig.json` with path alias `@/*` to `./src/*`, `tailwind.config.ts`, and `postcss.config.mjs`.
- [ ] **Step 3: Create .env.local and .env.example**
  Write `.env.local` with user's Supabase URL and Publishable Anon Key. Write `.env.example` with placeholder strings. Ensure `.env.local` is matched by `.gitignore`.

---

### Task 2: Type Definitions and Data Layer with Dual-Mode Fallback

**Files:**
- Create: `src/types/database.ts`
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Define TypeScript Types**
  Define `CashTransaction` interface matching table `cash_transactions` (`id`, `tanggal`, `jenis_transaksi`, `nominal`, `keterangan`, `created_at`). Define `TransactionFormData` and `SummaryMetrics`.
- [ ] **Step 2: Implement Data Layer Abstraction**
  Implement `createSupabaseClient()` reading `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. Provide dual-mode CRUD methods: `fetchTransactions()`, `insertTransaction()`, `updateTransaction()`, `deleteTransaction()`, with automatic `localStorage` fallback and initial dummy records.

---

### Task 3: Root Layout and Design System Styles

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Set up Tailwind Directives in globals.css**
  Include `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`.
- [ ] **Step 2: Configure Root Layout**
  Configure metadata (title: "Sistem Manajemen Kas Kelas", description) and font styling.

---

### Task 4: Modular UI Components (Header, KPI Cards, Form, Table, QA Panel)

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/SummaryCards.tsx`
- Create: `src/components/TransactionForm.tsx`
- Create: `src/components/TransactionTable.tsx`
- Create: `src/components/QAPanel.tsx`

- [ ] **Step 1: Implement Header.tsx**
  App icon, title, subtitle, and dynamic connection badge ("Cloud Supabase Active" / "Local Demo Mode").
- [ ] **Step 2: Implement SummaryCards.tsx**
  3 KPI cards (Total Saldo Akhir, Total Kas Masuk, Total Kas Keluar) with Indonesian Rupiah formatting.
- [ ] **Step 3: Implement TransactionForm.tsx**
  Input form with `tanggal`, `jenis_transaksi` toggle, `nominal` (without `min="1"` attribute), and `keterangan`. Include dynamic red alert box showing `"Nominal harus lebih dari 0"` on invalid submission. Support edit mode and cancel button.
- [ ] **Step 4: Implement TransactionTable.tsx**
  Table with real-time search, category dropdown filter, status badges, Edit & Delete actions with confirmation, and empty state. Native JSX string rendering guarantees SEC-01 anti-XSS immunity.
- [ ] **Step 5: Implement QAPanel.tsx**
  1-Click QA helper buttons for TC-01 (-50000), TC-02 (+20000), and SEC-01 (`<img src=x onerror=alert('Jebol XSS!')>`).

---

### Task 5: Dashboard Page Integration and End-to-End Verification

**Files:**
- Create: `src/app/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Integrate all components in src/app/page.tsx**
  Wire state management for transactions list, active edit transaction, search keyword, category filter, and error notifications.
- [ ] **Step 2: Run npm run build and typecheck**
  Ensure production build compiles cleanly without TypeScript or React errors.
- [ ] **Step 3: Update README.md with Next.js development and deployment commands**
  Document `npm run dev`, `npm run build`, and environment variable configuration for Vercel.
