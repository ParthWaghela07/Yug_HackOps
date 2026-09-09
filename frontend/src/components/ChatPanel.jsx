import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';
import VoiceControls from './VoiceControls.jsx';

export default function ChatPanel({
  messages,
  busy,
  inputMode,
  setInputMode,
  isRecording,
  isTranscribing,
  isSpeaking,
  sttAvailable,
  onStartRecording,
  onStopRecording,
  onSendText,
  onReplayAudio,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-ink-600">
            <p className="font-display text-lg text-paper-200">Talk to Memora</p>
            <p className="text-sm max-w-xs">
              Tap the mic and say hello — or switch to typing. Memora remembers what matters and
              explains why.
            </p>
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onReplayAudio={onReplayAudio} />
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="bg-ink-800 border border-ink-700 rounded-2xl px-4 py-3 text-ink-600 text-sm font-mono">
              thinking...
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-ink-700 bg-ink-900/60 px-5 py-4">
        <VoiceControls
          inputMode={inputMode}
          setInputMode={setInputMode}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          isSpeaking={isSpeaking}
          busy={busy}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onSendText={onSendText}
          sttAvailable={sttAvailable}
        />
      </div>
    </div>
  );
}
