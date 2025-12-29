import type { Account } from "../../core/models/accounts";
import type { JournalEntry } from "../../core/models/journal";
import type { LedgerAccount } from "../../core/models/ledger";
import { CHART_OF_ACCOUNTS } from "../../shared/constants";
import { validateJournal } from "./validation";

// Create a map for quick account lookup by code
const accountMap = new Map<string, Account>(
  CHART_OF_ACCOUNTS.map((acc) => [acc.code, acc])
);

export function postEntry(entry: JournalEntry, ledgers: Map<string, LedgerAccount>): Map<string, LedgerAccount> {
  validateJournal(entry);

  for (const line of entry.lines) {
    const account = accountMap.get(line.accountCode);

    if (!account) throw new Error(`Unknown account code: ${line.accountCode}`);

    const ledger = ledgers.get(account.code) ?? {
      account,
      posts: [],
      endingBalance: 0,
    };

    const isDebit = line.position === 'DEBIT';

    const balanceChange = account.normalSide === 'DEBIT'
      ? (isDebit ? line.amount : -line.amount)
      : (isDebit ? -line.amount : line.amount);

    const nextBalance = ledger.endingBalance + balanceChange;

    const post = {
      journalId: entry.id,
      date: entry.date,
      description: entry.description,
      position: line.position,
      amount: line.amount,
      balanceAfter: nextBalance,
    };

    ledger.posts.push(post);
    ledger.endingBalance = nextBalance;

    // Update the ledger in the map
    ledgers.set(account.code, ledger);
  }

  return ledgers;
};
