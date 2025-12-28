export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

// 101: Kasa
// 102: Piutang Anggota
// 401: Pendapatan Bunga Pinjaman
export type AccountCode = '101' | '102' | '401';

export interface Account {
  code: AccountCode;
  name: string;
  normalBalance: 'DEBIT' | 'CREDIT';
}
