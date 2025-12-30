import { create } from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";

import type { JournalEntry } from "@/core/models/journal";
import type { LedgerAccount } from "@/core/models/ledger";
import { postEntry } from "@/lib/utils/posting";


interface AccountingState {
  journals: JournalEntry[];
  ledgers: Map<string, LedgerAccount>;
  addJournal: (entry: JournalEntry) => void;
  reset: () => void;
}

// Custom storage adapter for zustand using localforage
const forageStorage = {
  getItem: async (name: string) => {
    const data = await localforage.getItem<string>(name);
    return data ? JSON.parse(data) : null;
  },
  setItem: async (name: string, value: unknown) => {
    await localforage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await localforage.removeItem(name);
  },
};

export const useAccountingStore = create<AccountingState>()(
  persist(
    (set, get) => ({
      journals: [],
      ledgers: new Map<string, LedgerAccount>(),

      addJournal: (entry: JournalEntry) => {
        const currentLedgers = new Map(get().ledgers);
        const updatedLedgers = postEntry(entry, currentLedgers);

        set({
          journals: [...get().journals, entry],
          ledgers: updatedLedgers,
        });
      },

      reset: () => set({
        journals: [],
        ledgers: new Map(),
      }),
    }),
    {
      name: "accounting-store",
      storage: forageStorage,
    }
  )
);
