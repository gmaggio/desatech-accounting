import { useState } from 'react';
import { useAccountingStore } from '@/state/store';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { POSITIONS, type Position } from '@/core/models/accounts';
import type { JournalLine, JournalEntry } from '@/core/models/journal';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { CHART_OF_ACCOUNTS } from '@/shared/constants';

export function JournalForm() {
  const addJournal = useAccountingStore((s) => s.addJournal);

  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [lines, setLines] = useState<JournalLine[]>([]);

  const formatDate = (date: Date | undefined) => {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const addLine = () => {
    setLines([
      ...lines,
      { accountCode: '', position: 'DEBIT' as Position, amount: undefined },
    ]);
  };

  const removeLine = (index: number) => {
    const updated = lines.filter((_, i) => i !== index);

    console.log('updated', updated);

    setLines(updated);
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
      date: date || new Date(),
      description,
      lines,
    };
    addJournal(entry);
    setDescription('');
    setDate(undefined);
    setLines([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-2/6 max-w-44 space-y-2">
            <Label>Date</Label>
            <Popover
              open={open}
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-between font-normal"
                >
                  {date ? formatDate(date) : 'Select date'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-4/6 space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex gap-2"
            >
              <Select
                value={line.accountCode}
                onValueChange={(val) => updateLine(i, 'accountCode', val)}
              >
                <SelectTrigger className="w-full max-w-1/2">
                  <SelectValue placeholder="Account Code" />
                </SelectTrigger>
                <SelectContent>
                  {CHART_OF_ACCOUNTS.map((account) => (
                    <SelectItem
                      key={account.code}
                      value={account.code}
                    >
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {POSITIONS.map((pos) => (
                    <SelectItem
                      key={pos}
                      value={pos}
                    >
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                className="w-full text-right max-w-64"
                value={line.amount ?? ''}
                onChange={(e) =>
                  updateLine(i, 'amount', Number(e.target.value))
                }
              />
              <Button
                variant="secondary"
                className="text-primary/60 hover:text-primary"
                onClick={() => removeLine(i)}
              >
                <Trash2 />
              </Button>
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
