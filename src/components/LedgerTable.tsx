import { useAccountingStore } from '@/state/store';
import { Card, CardContent } from '@/components/ui/card';
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
      <CardContent>
        {[...ledgers.values()].map((ledger) => (
          <div
            key={ledger.account.code}
            className="mb-12"
          >
            <div className="flex items-end justify-between w-full pb-2">
              <h3 className="font-bold">
                <span className="text-xs text-primary/75">
                  {ledger.account.code} -{' '}
                </span>
                {ledger.account.name}
                {'  '}
                <span className="text-xs text-primary/50">
                  ({ledger.account.type})
                </span>
              </h3>
              <div className="flex flex-col text-right">
                <p className="text-xs text-primary/75">Current Balance</p>
                <p className="text-lg font-bold">
                  {ledger.endingBalance.toLocaleString()}
                </p>
              </div>
            </div>
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
                <TableBody className="text-left [&>tr>td]:text-wrap">
                  {ledger.posts.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell>{formatDate(p.date)}</TableCell>
                      <TableCell className="max-w-sm">
                        {p.description}
                      </TableCell>
                      <TableCell>{p.journalId}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {p.position === 'DEBIT'
                          ? p.amount.toLocaleString()
                          : ''}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {p.position === 'CREDIT'
                          ? p.amount.toLocaleString()
                          : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.balanceAfter.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
