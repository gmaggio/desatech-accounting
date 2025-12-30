// Position types for accounting entries
export const POSITIONS = ["DEBIT", "CREDIT"] as const;
export type Position = typeof POSITIONS[number];


// High-level classification of accounts
export type AccountType = 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSE';

// Account structure
export interface Account {
  code: string;
  name: string;
  type: AccountType;
  normalSide: Position;
}
