import { useState } from 'react';

const MicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M19 11a7 7 0 0 1-14 0M12 18v3"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const KeyboardIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
    <path
      d="M7 10h.01M11 10h.01M15 10h.01M17 10h.01M7 14h10"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export default function VoiceControls({
  inputMode,
  setInputMode,
  isRecording,
  isTranscribing,
  isSpeaking,
  busy,
  onStartRecording,
  onStopRecording,
  onSendText,
  sttAvailable,
}) {
  const [draft, setDraft] = useState('');

  function submitText(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendText(draft);
    setDraft('');
  }

  if (inputMode === 'text') {
    return (
      <form onSubmit={submitText} className="flex items-center gap-2 w-full">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-ink-800 border border-ink-600 rounded-full px-4 py-3 text-paper-100 placeholder-ink-600 font-sans text-sm focus:border-amber-500 outline-none"
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className="rounded-full bg-amber-500 text-ink-950 font-medium px-5 py-3 text-sm disabled:opacity-40"
        >
          Send
        </button>
        {sttAvailable && (
          <button
            type="button"
            title="Switch to voice"
            onClick={() => setInputMode('voice')}
            className="rounded-full p-3 text-ink-600 hover:text-amber-400 border border-ink-600"
          >
            <MicIcon className="w-5 h-5" />
          </button>
        )}
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full py-2">
      <button
        type="button"
        disabled={busy || !sttAvailable}
        onClick={isRecording ? onStopRecording : onStartRecording}
        className={[
          'relative flex items-center justify-center w-16 h-16 rounded-full transition-colors',
          isRecording ? 'bg-rose-500 text-ink-950 mic-pulse' : 'bg-amber-500 text-ink-950',
          !sttAvailable ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110',
        ].join(' ')}
      >
        <MicIcon className="w-7 h-7" />
      </button>

      <div className="text-xs font-mono text-ink-600 h-4 text-center">
        {!sttAvailable && 'Voice input unavailable — add GROQ_API_KEY on the backend'}
        {sttAvailable && isRecording && 'Listening... tap to send'}
        {sttAvailable && isTranscribing && 'Transcribing...'}
        {sttAvailable && isSpeaking && !isRecording && !isTranscribing && 'Memora is speaking...'}
        {sttAvailable && !isRecording && !isTranscribing && !isSpeaking && 'Tap to talk'}
      </div>

      <button
        type="button"
        onClick={() => setInputMode('text')}
        className="flex items-center gap-1.5 text-xs font-mono text-ink-600 hover:text-amber-400"
      >
        <KeyboardIcon className="w-3.5 h-3.5" />
        Type instead
      </button>
    </div>
  );
}
