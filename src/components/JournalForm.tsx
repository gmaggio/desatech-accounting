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
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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
      { accountCode: '', position: 'DEBIT' as Position, amount: 0 },
    ]);
  };

  const removeLine = (index: number) => {
    const updated = lines.filter((_, i) => i !== index);
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

  const validateEntry = (
    linesToCheck: JournalLine[],
    date: Date | undefined,
    description: string,
    differenceInTotal: number = 0
  ): boolean => {
    // Must have date and description
    if (!date || description.trim() === '') return false;

    // Must have at least one line
    if (linesToCheck.length === 0) return false;

    // Each line must be complete
    for (const line of linesToCheck) {
      if (!line.accountCode || !line.amount || line.amount <= 0) {
        return false;
      }
    }

    // Must balance
    if (differenceInTotal !== 0) return false;

    return true;
  };

  const calculateTotals = (linesToCheck: JournalLine[]) => {
    let totalDebit = 0;
    let totalCredit = 0;

    linesToCheck.forEach((line) => {
      if (line.position === 'DEBIT' && line.amount) {
        totalDebit += line.amount;
      } else if (line.position === 'CREDIT' && line.amount) {
        totalCredit += line.amount;
      }
    });

    return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
  };

  const { totalDebit, totalCredit, difference } = calculateTotals(lines);

  const isValid = validateEntry(lines, date, description, difference);

  const submit = () => {
    const entry: JournalEntry = {
      id: `J-${Date.now()}`,
      date: date!,
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
                  className={cn(
                    'w-full justify-between font-normal',
                    !date && 'text-primary/50'
                  )}
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

        {/* Line Entries */}
        <div className={cn('space-y-4', lines.length > 0 && 'pt-2')}>
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
                value={line.amount > 0 ? line.amount : ''}
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

        <div className="flex gap-20 pt-2">
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={addLine}
            >
              + Add Line
            </Button>
            <Button
              disabled={!isValid}
              onClick={submit}
            >
              Save
            </Button>
          </div>

          {/* Summary */}
          <div className="flex flex-col w-full items-start gap-0.5 text-sm">
            <h3 className="font-bold">Summary</h3>
            <div className="flex w-full justify-between gap-2">
              <h4>Total Debit</h4>
              <p>{totalDebit.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex w-full justify-between gap-2">
              <h4>Total Credit</h4>
              <p>{totalCredit.toLocaleString('id-ID')}</p>
            </div>
            <Separator />
            <div
              className={cn(
                'flex w-full justify-between gap-2',
                difference === 0
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'
              )}
            >
              <h4>Difference {difference !== 0 && '(must be 0)'}</h4>
              <p>{difference.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
