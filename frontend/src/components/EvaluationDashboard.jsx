export default function EvaluationDashboard({ evaluation }) {
  if (!evaluation) {
    return (
      <div className="px-4 py-8 text-center text-sm text-ink-600">
        Send a message to see how much context Memora saves versus a naive full-transcript
        approach.
      </div>
    );
  }

  const { naiveWordCount, structuredWordCount, reductionPct, memoriesUsed } = evaluation;

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="text-center">
        <div className="font-display text-5xl text-amber-400 leading-none">{reductionPct}%</div>
        <p className="text-xs font-mono text-ink-600 mt-2">smaller context than sending the full transcript</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-ink-600 bg-ink-800/70 px-3.5 py-3 text-center">
          <p className="text-[10px] font-mono text-ink-600 uppercase">Naive (full transcript)</p>
          <p className="font-display text-2xl text-paper-100 mt-1">{naiveWordCount}</p>
          <p className="text-[10px] font-mono text-ink-600">words</p>
        </div>
        <div className="rounded-xl border border-teal-500/40 bg-teal-500/5 px-3.5 py-3 text-center">
          <p className="text-[10px] font-mono text-teal-400 uppercase">Memora (structured)</p>
          <p className="font-display text-2xl text-teal-400 mt-1">{structuredWordCount}</p>
          <p className="text-[10px] font-mono text-ink-600">words</p>
        </div>
      </div>

      <p className="text-xs font-mono text-ink-600 text-center">
        {memoriesUsed} memor{memoriesUsed === 1 ? 'y' : 'ies'} sent instead of the entire history.
      </p>
    </div>
  );
}
