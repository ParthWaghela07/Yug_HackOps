import { useState } from 'react';
import MemoryDashboard from './MemoryDashboard.jsx';
import ExplainabilityPanel from './ExplainabilityPanel.jsx';
import EvaluationDashboard from './EvaluationDashboard.jsx';

const TABS = [
  { key: 'memories', label: 'Memories' },
  { key: 'why', label: 'Why this reply' },
  { key: 'context', label: 'Context saved' },
];

export default function SidePanel({ memories, explainability, evaluation, onDeleteMemory }) {
  const [tab, setTab] = useState('memories');

  return (
    <div className="flex flex-col h-full border-l border-ink-700 bg-ink-900/40">
      <div className="flex border-b border-ink-700">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              'flex-1 text-xs font-mono py-3 border-b-2 transition-colors',
              tab === t.key
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-ink-600 hover:text-paper-200',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'memories' && <MemoryDashboard memories={memories} onDelete={onDeleteMemory} />}
        {tab === 'why' && <ExplainabilityPanel explainability={explainability} />}
        {tab === 'context' && <EvaluationDashboard evaluation={evaluation} />}
      </div>
    </div>
  );
}
