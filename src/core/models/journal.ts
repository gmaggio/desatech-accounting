import type { Position } from "./accounts";

// Journal line entry structure
export interface JournalLine {
  accountCode: string;
  position: Position;
  amount: number;
}

// Full journal entry (transaction)
export interface JournalEntry {
  id: string;
  date: string; // ISO date string
  description: string;
  lines: JournalLine[];
}
