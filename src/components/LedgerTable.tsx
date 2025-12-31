import { useAccountingStore } from '@/state/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

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
            <Card className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="max-w-sm">Description</TableHead>
                    <TableHead>Ref. ID</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-left [&>tr>td]:align-top [&>tr>td]:text-wrap">
                  {ledger.posts.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell className="max-w-sm">
                        {p.description}
                      </TableCell>
                      <TableCell>{p.journalId}</TableCell>
                      <TableCell className="text-green-600">
                        {p.position === 'DEBIT'
                          ? p.amount.toLocaleString()
                          : ''}
                      </TableCell>
                      <TableCell className="text-red-600">
                        {p.position === 'CREDIT'
                          ? p.amount.toLocaleString()
                          : ''}
                      </TableCell>
                      <TableCell>{p.balanceAfter.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <div className="mt-2 font-bold">
              Ending Balance: {ledger.endingBalance.toLocaleString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
