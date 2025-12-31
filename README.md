# **📘 Accounting Demo App — README**

A lightweight, educational accounting demo built with **React**, **TypeScript**, **Zustand**, and **shadcn/ui**.
This project simulates a simple double‑entry bookkeeping workflow with journals, ledgers, and automatic posting logic.

It is intentionally minimal, fast to run, and easy to understand — perfect for demos.

---

## **📦 Features**

- ✍️ **Journal Entry Form**
  Create debit/credit journal entries with automatic validation.

- 📚 **Ledger Posting Engine**
  Every journal entry is posted into account‑specific ledgers with running balances.

- 🔄 **Automatic Recalculation**
  Journals are sorted by date, and ledgers are rebuilt from scratch for guaranteed correctness.

- 🧪 **Temporary Demo Data**
  The app seeds sample journals on first run to showcase functionality instantly.

- 💾 **Local Persistence**
  All data is stored in `localforage` using a custom Zustand persistence layer that supports:
  - `Map` serialization
  - `Date` serialization
  - Ledger post reconstruction

- 🧭 **Sidebar Navigation**
  Clean navigation with active‑route highlighting.

---

## **🧪 Temporary Demo Data**

This project includes **sample journals** that automatically populate on first run.

Why?

- To demonstrate the ledger posting engine immediately
- To show how balances evolve across multiple entries
- To make the UI meaningful without requiring manual input

The data is stored in the browser using `localforage`.

---

## **🚀 Getting Started**

### **1. Clone the repository**

```sh
git clone https://github.com/gmaggio/desatech-accounting.git
cd desatech-accounting
```

### **2. Install dependencies**

```sh
npm install
```

### **3. Run the development server**

```sh
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

---

## **📁 Project Structure (Simplified)**

```
src/
  components/           # App layout, sidebar, tables, forms, and UI primitives
    ui/                 # shadcn/ui component implementations
  core/
    models/             # Accounting domain models (accounts, journal, ledger)
  lib/
    utils/              # Posting engine + validation logic
  pages/                # Journal and Ledger pages
  shared/               # Constants and demo example data
  state/                # Zustand store with persistence
```

---

## **🧠 How the Posting Engine Works**

1. User creates a journal entry
2. Journals are sorted by date
3. Ledgers are rebuilt from scratch
4. Each line updates the account’s running balance
5. Ledger posts are stored chronologically

This ensures:

- Correct balances even with backdated entries
- No drift or cumulative errors
- Deterministic results every time

---
