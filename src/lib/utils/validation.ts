import type { JournalEntry } from "@/core/models/journal";

export function validateJournal(entry: JournalEntry): void {
  // Get total debits
  const debit = entry.lines
    .filter(line => line.position === 'DEBIT')
    .reduce((sum, line) => sum + line.amount, 0);

  // Get total credits
  const credit = entry.lines
    .filter(line => line.position === 'CREDIT')
    .reduce((sum, line) => sum + line.amount, 0);

  if (debit !== credit) {
    throw new Error("Journal entry is not balanced");
  }
}
