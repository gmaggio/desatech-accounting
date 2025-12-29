// Position types for accounting entries
export type Position = 'DEBIT' | 'CREDIT';

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
