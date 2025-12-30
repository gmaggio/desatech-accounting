import type { Account, Position } from "./accounts";

// Ledger single post structure
export interface LedgerPost {
  journalId: string;
  date: Date;
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
