function ScoreBar({ label, value, colorClass }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className="flex items-center gap-2 text-[10px] font-mono text-ink-600">
      <span className="w-20 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-ink-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right">{pct}%</span>
    </div>
  );
}

function ScoredMemoryCard({ item, dim }) {
  const isEmotional = item.memory.layer === 'emotional';
  return (
    <div
      className={`rounded-xl border px-3.5 py-3 bg-ink-800/70 ${
        isEmotional ? 'border-rose-500/30' : 'border-teal-500/30'
      } ${dim ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
            isEmotional ? 'bg-rose-500/15 text-rose-400' : 'bg-teal-500/15 text-teal-400'
          }`}
        >
          {item.memory.layer}
        </span>
        <span className="text-[10px] font-mono text-ink-600">score {Math.round(item.score * 100)}%</span>
      </div>
      <p className="font-display text-sm text-paper-100 mt-2 mb-2.5 leading-snug">{item.memory.text}</p>
      <div className="space-y-1">
        <ScoreBar label="similarity" value={item.breakdown.similarity} colorClass="bg-amber-400" />
        <ScoreBar label="importance" value={item.breakdown.importance} colorClass="bg-teal-400" />
        <ScoreBar label="recency" value={item.breakdown.recency} colorClass="bg-rose-400" />
        <ScoreBar label="emotional" value={item.breakdown.emotionalMatch} colorClass="bg-paper-200" />
      </div>
    </div>
  );
}

export default function ExplainabilityPanel({ explainability }) {
  if (!explainability) {
    return (
      <div className="px-4 py-8 text-center text-sm text-ink-600">
        Send a message to see which memories Memora chose, and why.
      </div>
    );
  }

  const { selected = [], excludedExample, selectionReason } = explainability;

  return (
    <div className="px-4 py-4 space-y-4 overflow-y-auto h-full">
      <p className="text-sm text-paper-200 font-display leading-snug">{selectionReason}</p>

      <div className="space-y-2.5">
        {selected.map((item) => (
          <ScoredMemoryCard key={item.memory.id} item={item} />
        ))}
      </div>

      {excludedExample && (
        <div>
          <p className="text-[11px] font-mono text-ink-600 uppercase tracking-wide mb-2">
            Not selected (for contrast)
          </p>
          <ScoredMemoryCard item={excludedExample} dim />
        </div>
      )}
    </div>
  );
}
