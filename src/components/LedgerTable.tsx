import { useAccountingStore } from '@/state/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Table } from 'lucide-react';

export function LedgerTable() {
  const ledgers = useAccountingStore((s) => s.ledgers);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Ledger Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        {[...ledgers.values()].map((ledger) => (
          <div
            key={ledger.account.code}
            className="mb-6"
          >
            <h3 className="font-semibold mb-2">
              {ledger.account.code} - {ledger.account.name} (
              {ledger.account.type})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Debit</TableHead>
                  <TableHead>Credit</TableHead>
                  <TableHead>Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.posts.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>
                      {p.position === 'DEBIT' ? p.amount.toLocaleString() : ''}
                    </TableCell>
                    <TableCell>
                      {p.position === 'CREDIT' ? p.amount.toLocaleString() : ''}
                    </TableCell>
                    <TableCell>{p.balanceAfter.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-2 font-bold">
              Ending Balance: {ledger.endingBalance.toLocaleString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
