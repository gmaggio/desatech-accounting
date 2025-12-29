import type { Account, Position } from "./accounts";

// Ledger single post structure
export interface LedgerPost {
  journalId: string;
  date: string; // ISO date string
  description: string;
  position: Position;
  amount: number;
  balanceAfter: number;
}

// Full ledger structure for an account
export interface LedgerAccount {
  account: Account;
  posts: LedgerPost[];
  endingBalance: number;
}
