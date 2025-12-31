import type { JournalEntry } from "../core/models/journal";

export const JOURNAL_1: JournalEntry = {
  id: "JE-001",
  date: new Date("2025-05-15"),
  description: "Pencairan pembiayaan tenor 5 bulan, bunga 2.5%/bulan",
  lines: [
    {
      accountCode: "102",
      position: "DEBIT",
      amount: 30000000,
    },
    {
      accountCode: "101",
      position: "CREDIT",
      amount: 30000000,
    },
  ],
};

export const JOURNAL_2: JournalEntry = {
  id: "JE-002",
  date: new Date("2025-06-14"),
  description: "Angsuran bulan pertama anggota A",
  lines: [
    {
      accountCode: "101",
      position: "DEBIT",
      amount: 6750000,
    },
    {
      accountCode: "102",
      position: "CREDIT",
      amount: 6000000,
    },
    {
      accountCode: "401",
      position: "CREDIT",
      amount: 750000,
    },
  ],
};

export const SAMPLE_JOURNALS: JournalEntry[] = [JOURNAL_1, JOURNAL_2];
