import useMemora from './hooks/useMemora.js';
import TopBar from './components/TopBar.jsx';
import ChatPanel from './components/ChatPanel.jsx';
import SidePanel from './components/SidePanel.jsx';

export default function App() {
  const {
    messages,
    memories,
    explainability,
    evaluation,
    busy,
    error,
    voiceStatus,
    isRecording,
    isTranscribing,
    isSpeaking,
    inputMode,
    setInputMode,
    sendText,
    startRecording,
    stopRecording,
    replayMessageAudio,
    loadDemo,
    loadMusic,
    loadSocial,
    resetAll,
    deleteMemory,
  } = useMemora();

  return (
    <div className="h-screen w-screen flex flex-col text-paper-100">
      <TopBar
        voiceStatus={voiceStatus}
        busy={busy}
        onLoadDemo={loadDemo}
        onLoadMusic={loadMusic}
        onLoadSocial={loadSocial}
        onReset={resetAll}
      />

      {error && (
        <div className="px-5 py-2 bg-rose-500/10 border-b border-rose-500/30 text-rose-400 text-xs font-mono">
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_360px] overflow-hidden">
        <ChatPanel
          messages={messages}
          busy={busy}
          inputMode={inputMode}
          setInputMode={setInputMode}
          isRecording={isRecording}
          isTranscribing={isTranscribing}
          isSpeaking={isSpeaking}
          sttAvailable={voiceStatus.sttAvailable}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSendText={sendText}
          onReplayAudio={replayMessageAudio}
        />
        <SidePanel
          memories={memories}
          explainability={explainability}
          evaluation={evaluation}
          onDeleteMemory={deleteMemory}
        />
      </div>
    </div>
  );
}
