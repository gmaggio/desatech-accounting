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

export function JournalTable() {
  const journals = useAccountingStore((s) => s.journals);

  console.log('Journals:', journals);

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
              <TableHead>Description</TableHead>
              <TableHead>Lines</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {journals.map((j) => (
              <TableRow key={j.id}>
                <TableCell>{j.date.toLocaleDateString()}</TableCell>
                <TableCell>{j.description}</TableCell>
                <TableCell>
                  {j.lines.map((l, i) => (
                    <div key={i}>
                      {l.accountCode} {l.position} {l.amount.toLocaleString()}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
