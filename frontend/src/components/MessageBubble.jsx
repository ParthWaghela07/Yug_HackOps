const SpeakerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M4 9v6h4l5 4V5L8 9H4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M16.5 9a5 5 0 0 1 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const MicDot = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M19 11a7 7 0 0 1-14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function MessageBubble({ message, onReplayAudio }) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={[
          'max-w-[75%] rounded-2xl px-4 py-3 font-display text-[15px] leading-relaxed',
          isAssistant
            ? 'bg-ink-800 text-paper-100 border border-ink-700'
            : 'bg-amber-500 text-ink-950',
        ].join(' ')}
      >
        <p>{message.text}</p>
        <div className="flex items-center gap-2 mt-2 opacity-70">
          {message.modality === 'voice' && (
            <MicDot className={`w-3 h-3 ${isAssistant ? 'text-teal-400' : 'text-ink-950'}`} />
          )}
          <span className="text-[10px] font-mono uppercase tracking-wide">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAssistant && (
            <button
              type="button"
              title="Play this reply"
              onClick={() => onReplayAudio(message.text)}
              className="ml-auto text-teal-400 hover:text-teal-300"
            >
              <SpeakerIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
