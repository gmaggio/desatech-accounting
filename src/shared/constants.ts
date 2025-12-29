import { BookOpen, NotebookTabs } from "lucide-react";
import { type Account } from "../core/models/accounts";


// Routes and Menu Items
export const ITEMS = [
  {
    title: 'Journal',
    url: '/journal',
    icon: NotebookTabs,
  },
  {
    title: 'Ledgers',
    url: '/ledgers',
    icon: BookOpen,
  },
];

export const CHART_OF_ACCOUNTS: Account[] = [
  {
    code: '101',
    name: 'Kas',
    type: 'ASSET',
    normalSide: 'DEBIT'
  }, {
    code: '102',
    name: 'Piutang Anggota',
    type: 'ASSET',
    normalSide: 'DEBIT'
  }, {
    code: '401',
    name: 'Pendapatan Bunga Pinjaman',
    type: 'REVENUE',
    normalSide: 'CREDIT'
  },
];
