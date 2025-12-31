import { useAccountingStore } from '@/state/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table';
import { Fragment } from 'react/jsx-runtime';
import { accountMap } from '@/lib/utils/posting';
import { formatDate } from '@/lib/utils';

export function JournalTable() {
  const journals = useAccountingStore((s) => s.journals);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Journal Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>ID</TableHead>
              <TableHead className="max-w-sm">Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Acc. ID</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-left [&>tr>td]:align-top [&>tr>td]:text-wrap">
            {journals.map((j) => {
              const rowSpan = j.lines.length;

              return (
                <Fragment key={j.id}>
                  <TableRow>
                    <TableCell rowSpan={rowSpan}>
                      {formatDate(j.date)}
                    </TableCell>
                    <TableCell rowSpan={rowSpan}>{j.id}</TableCell>
                    <TableCell
                      rowSpan={rowSpan}
                      className="max-w-sm"
                    >
                      {j.description}
                    </TableCell>

                    {/* Journal lines - first line */}
                    <TableCell>
                      {accountMap.get(j.lines[0].accountCode)?.name}
                    </TableCell>
                    <TableCell>{j.lines[0].accountCode}</TableCell>
                    <TableCell className="text-right">
                      {j.lines[0].position === 'DEBIT'
                        ? j.lines[0].amount.toLocaleString()
                        : ''}
                    </TableCell>
                    <TableCell className="text-right">
                      {j.lines[0].position === 'CREDIT'
                        ? j.lines[0].amount.toLocaleString()
                        : ''}
                    </TableCell>
                  </TableRow>

                  {/* Journal line - remaining lines */}
                  {j.lines.slice(1).map((l, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {accountMap.get(l.accountCode)?.name}
                      </TableCell>
                      <TableCell>{l.accountCode}</TableCell>
                      <TableCell className="text-right">
                        {l.position === 'DEBIT'
                          ? l.amount.toLocaleString()
                          : ''}
                      </TableCell>
                      <TableCell className="text-right">
                        {l.position === 'CREDIT'
                          ? l.amount.toLocaleString()
                          : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
