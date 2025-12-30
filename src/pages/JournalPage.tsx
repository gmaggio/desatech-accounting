import { JournalForm } from '@/components/JournalForm';
import { JournalTable } from '@/components/JournalTable';

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Journal Entries</h2>
      <JournalForm />
      <JournalTable />
    </div>
  );
}
