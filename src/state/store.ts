import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";
import localforage from "localforage";

import type { JournalEntry } from "@/core/models/journal";
import type { LedgerAccount } from "@/core/models/ledger";
import { postEntry } from "@/lib/utils/posting";
import { SAMPLE_JOURNALS } from "@/shared/examples";

interface AccountingState {
  journals: JournalEntry[];
  ledgers: Map<string, LedgerAccount>;
  addJournal: (entry: JournalEntry) => void;
  reset: () => void;
}

// Persisted form of JournalEntry
type PersistedJournalEntry = Omit<JournalEntry, "date"> & { date: string; };

// Persisted form of AccountingState
type PersistedAccountingState = Omit<AccountingState, "ledgers" | "journals"> & {
  ledgers: Record<string, LedgerAccount>;
  journals: PersistedJournalEntry[];
};

// Custom storage adapter for zustand using localforage
const forageStorage: PersistStorage<AccountingState> = {
  getItem: async (name) => {
    const data = await localforage.getItem<string>(name);
    if (!data) return null;

    // Parse as persisted form
    const parsed = JSON.parse(data) as StorageValue<PersistedAccountingState>;

    // Convert back to runtime form
    const ledgersMap = new Map(Object.entries(parsed.state.ledgers));
    const journalsWithDates: JournalEntry[] = parsed.state.journals.map((j) => ({
      ...j,
      date: new Date(j.date),
    }));

    const runtime: StorageValue<AccountingState> = {
      ...parsed,
      state: {
        ...parsed.state,
        ledgers: ledgersMap,
        journals: journalsWithDates,
      },
    };

    return runtime;
  },

  setItem: async (name, value) => {
    // Convert runtime form to persisted form
    const ledgersObj = Object.fromEntries(value.state.ledgers);
    const journalsWithStrings: PersistedJournalEntry[] = value.state.journals.map((j) => ({
      ...j,
      date: j.date.toISOString(),
    }));

    const toSave: StorageValue<PersistedAccountingState> = {
      ...value,
      state: {
        ...value.state,
        ledgers: ledgersObj,
        journals: journalsWithStrings,
      },
    };

    await localforage.setItem(name, JSON.stringify(toSave));
  },

  removeItem: async (name) => {
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
      onRehydrateStorage: () => (state) => {
        // Initialize with sample data if empty for demo purposes
        if (state && state.journals.length === 0) {
          useAccountingStore.setState(() => {
            let ledgers = new Map<string, LedgerAccount>();
            for (const entry of SAMPLE_JOURNALS) {
              ledgers = postEntry(entry, ledgers);
            }
            return {
              journals: SAMPLE_JOURNALS,
              ledgers
            };
          });
        }
      },
    }
  )
);
