import { create } from "zustand";
import { persist, type PersistStorage, type StorageValue } from "zustand/middleware";
import localforage from "localforage";

import type { JournalEntry } from "@/core/models/journal";
import type { LedgerAccount, LedgerPost } from "@/core/models/ledger";
import { postEntry } from "@/lib/utils/posting";
import { SAMPLE_JOURNALS } from "@/shared/examples";

// Runtime (in-memory) types
interface AccountingState {
  journals: JournalEntry[];
  ledgers: Map<string, LedgerAccount>;
  addJournal: (entry: JournalEntry) => void;
  reset: () => void;
}

// Persisted form of JournalEntry
type PersistedJournalEntry = Omit<JournalEntry, "date"> & { date: string; };

// Persisted form of LedgerPost
type PersistedLedgerEntry = Omit<LedgerPost, "date"> & { date: string; };

// Persisted form of LedgerAccount
type PersistedLedgerAccount = Omit<LedgerAccount, "posts"> & {
  posts: PersistedLedgerEntry[];
};

// Persisted form of AccountingState
type PersistedAccountingState = Omit<AccountingState, "ledgers" | "journals"> & {
  ledgers: Record<string, PersistedLedgerAccount>;
  journals: PersistedJournalEntry[];
};

// Custom storage adapter for zustand using localforage
const forageStorage: PersistStorage<AccountingState> = {
  getItem: async (name) => {
    const raw = await localforage.getItem<string>(name);
    if (!raw) return null;

    // Parse as persisted form
    const parsed = JSON.parse(raw) as StorageValue<PersistedAccountingState>;

    // Convert ledgers back to runtime form
    const ledgersMap = new Map<string, LedgerAccount>();
    for (const [code, acc] of Object.entries(parsed.state.ledgers)) {
      ledgersMap.set(code, {
        ...acc,
        posts: acc.posts.map((p) => ({
          ...p,
          date: new Date(p.date),
        })),
      });
    }

    // Convert journals back to runtime form
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
    // Convert ledger runtime form to persisted form
    const ledgersObj: Record<string, PersistedLedgerAccount> = {};
    for (const [code, acc] of value.state.ledgers.entries()) {
      ledgersObj[code] = {
        ...acc,
        posts: acc.posts.map((p) => ({
          ...p,
          date: p.date.toISOString(),
        })),
      };
    }

    // Convert journal runtime form to persisted form
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

// Zustand Store
export const useAccountingStore = create<AccountingState>()(
  persist(
    (set, get) => ({
      journals: [],
      ledgers: new Map<string, LedgerAccount>(),

      addJournal: (entry) => {
        const updated = [...get().journals, entry];

        // Sort by date ascending
        updated.sort((a, b) => a.date.getTime() - b.date.getTime());

        // Recompute ledgers from scratch
        let newLedgers = new Map<string, LedgerAccount>();
        for (const j of updated) {
          newLedgers = postEntry(j, newLedgers);
        }

        set({
          journals: updated,
          ledgers: newLedgers,
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
        if (!state) return;

        // Initialize with sample data if empty for demo purposes
        if (state.journals.length === 0) {
          let ledgers = new Map<string, LedgerAccount>();
          for (const entry of SAMPLE_JOURNALS) {
            ledgers = postEntry(entry, ledgers);
          }

          useAccountingStore.setState({
            journals: SAMPLE_JOURNALS,
            ledgers
          });
        }
      },
    }
  )
);
