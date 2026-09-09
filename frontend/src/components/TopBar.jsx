export default function TopBar({ voiceStatus, busy, onLoadDemo, onLoadMusic, onLoadSocial, onReset }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-ink-700 bg-ink-900/60">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <h1 className="font-display text-xl text-paper-100 tracking-tight">Memora</h1>
        <span className="hidden sm:inline text-[11px] font-mono text-ink-600 ml-2">
          voice-first · structured memory
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill label="STT" live={voiceStatus.sttAvailable} />
        <StatusPill label="TTS" live={voiceStatus.ttsAvailable} />

        <button
          type="button"
          disabled={busy}
          onClick={onLoadDemo}
          className="text-xs font-mono px-3 py-1.5 rounded-full border border-ink-600 text-paper-200 hover:border-amber-400 hover:text-amber-400 disabled:opacity-40"
        >
          Load demo conversation
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onLoadMusic}
          className="text-xs font-mono px-3 py-1.5 rounded-full border border-ink-600 text-paper-200 hover:border-teal-400 hover:text-teal-400 disabled:opacity-40"
        >
          Load music profile
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onLoadSocial}
          className="text-xs font-mono px-3 py-1.5 rounded-full border border-ink-600 text-paper-200 hover:border-teal-400 hover:text-teal-400 disabled:opacity-40"
        >
          Load social context
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={onReset}
          className="text-xs font-mono px-3 py-1.5 rounded-full border border-rose-500/60 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
        >
          Reset
        </button>
      </div>
    </header>
  );
}

function StatusPill({ label, live }) {
  return (
    <span
      className={[
        'text-[10px] font-mono px-2 py-1 rounded-full border',
        live ? 'border-teal-400 text-teal-400' : 'border-ink-600 text-ink-600',
      ].join(' ')}
      title={live ? `${label} is live` : `${label} unavailable — check backend .env`}
    >
      {label} {live ? '●' : '○'}
    </span>
  );
}
