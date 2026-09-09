export default function MemoryCard({ memory, onDelete }) {
  const isEmotional = memory.layer === 'emotional';
  return (
    <div
      className={[
        'rounded-xl border px-3.5 py-3 bg-ink-800/70',
        isEmotional ? 'border-rose-500/30' : 'border-teal-500/30',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={[
            'text-[10px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded',
            isEmotional ? 'bg-rose-500/15 text-rose-400' : 'bg-teal-500/15 text-teal-400',
          ].join(' ')}
        >
          {memory.layer} · {memory.category}
        </span>
        <button
          type="button"
          onClick={() => onDelete(memory.id)}
          className="text-ink-600 hover:text-rose-400 text-xs"
          title="Forget this memory"
        >
          ✕
        </button>
      </div>

      <p className="font-display text-sm text-paper-100 mt-2 leading-snug">{memory.text}</p>

      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-ink-600">
        <span>src: {memory.source}</span>
        <span>{memory.source_type}</span>
        <span>importance {Math.round((memory.importance ?? 0) * 100)}%</span>
      </div>
    </div>
  );
}
