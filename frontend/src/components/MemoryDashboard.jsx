import { useMemo, useState } from 'react';
import MemoryCard from './MemoryCard.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'factual', label: 'Factual' },
  { key: 'emotional', label: 'Emotional' },
];

export default function MemoryDashboard({ memories, onDelete }) {
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return memories;
    return memories.filter((m) => m.layer === filter);
  }, [memories, filter]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 px-4 pt-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={[
              'text-xs font-mono px-3 py-1 rounded-full border',
              filter === f.key
                ? 'border-amber-400 text-amber-400'
                : 'border-ink-600 text-ink-600 hover:text-paper-200',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-ink-600 self-center">{filtered.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
        {filtered.length === 0 && (
          <p className="text-sm text-ink-600 text-center mt-8">
            No memories yet — talk to Memora and they'll appear here.
          </p>
        )}
        {filtered.map((m) => (
          <MemoryCard key={m.id} memory={m} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
