import { useState } from 'react';
import { useAccountingStore } from '@/state/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Position } from '@/core/models/accounts';
import type { JournalLine, JournalEntry } from '@/core/models/journal';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function JournalForm() {
  const addJournal = useAccountingStore((s) => s.addJournal);

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [lines, setLines] = useState<JournalLine[]>([]);

  const addLine = () => {
    setLines([
      ...lines,
      { accountCode: '', position: 'DEBIT' as Position, amount: 0 },
    ]);
  };

  const updateLine = (
    index: number,
    field: keyof JournalLine,
    value: unknown
  ) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const submit = () => {
    const entry: JournalEntry = {
      id: `J-${Date.now()}`,
      date,
      description,
      lines,
    };
    addJournal(entry);
    setDescription('');
    setDate('');
    setLines([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex gap-2"
            >
              <Input
                placeholder="Account Code"
                value={line.accountCode}
                onChange={(e) => updateLine(i, 'accountCode', e.target.value)}
              />
              <Select
                value={line.position}
                onValueChange={(val) =>
                  updateLine(i, 'position', val as Position)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">DEBIT</SelectItem>
                  <SelectItem value="CREDIT">CREDIT</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={line.amount}
                onChange={(e) =>
                  updateLine(i, 'amount', Number(e.target.value))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={addLine}
          >
            + Line
          </Button>
          <Button onClick={submit}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
