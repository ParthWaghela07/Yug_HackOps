import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '../api/client.js';

export function useMemora() {
  const [messages, setMessages] = useState([]);
  const [memories, setMemories] = useState([]);
  const [explainability, setExplainability] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // voice-specific state
  const [voiceStatus, setVoiceStatus] = useState({ sttAvailable: false, ttsAvailable: false });
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'text' — voice is primary

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioElRef = useRef(null);

  const refreshAll = useCallback(async () => {
    try {
      const [msgRes, memRes, evalRes] = await Promise.all([
        api.getMessages(),
        api.getMemories(),
        api.getLatestEvaluation(),
      ]);
      setMessages(msgRes.messages || []);
      setMemories(memRes.memories || []);
      setEvaluation(evalRes.evaluation || null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    refreshAll();
    api
      .getVoiceStatus()
      .then(setVoiceStatus)
      .catch(() => setVoiceStatus({ sttAvailable: false, ttsAvailable: false }));
  }, [refreshAll]);

  function applyTurnResult(result) {
    setMessages((prev) => [...prev, result.userMessage, result.assistantMessage]);
    if (result.newMemories?.length) {
      setMemories((prev) => [...prev, ...result.newMemories]);
    }
    setExplainability(result.explainability || null);
    setEvaluation(result.evaluation || null);
    if (result.audio?.base64) {
      playAudioBase64(result.audio.base64, result.audio.mime);
    }
  }

  const sendText = useCallback(async (text) => {
    if (!text?.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api.sendTextMessage(text.trim());
      applyTurnResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        await sendVoiceBlob(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access was denied or unavailable. You can type instead.');
      setInputMode('text');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  async function sendVoiceBlob(blob) {
    setIsTranscribing(true);
    setBusy(true);
    setError(null);
    try {
      const result = await api.sendVoiceMessage(blob, 'recording.webm');
      applyTurnResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTranscribing(false);
      setBusy(false);
    }
  }

  function playAudioBase64(base64, mime = 'audio/mpeg') {
    try {
      const src = `data:${mime};base64,${base64}`;
      if (!audioElRef.current) audioElRef.current = new Audio();
      const el = audioElRef.current;
      el.src = src;
      setIsSpeaking(true);
      el.onended = () => setIsSpeaking(false);
      el.onerror = () => setIsSpeaking(false);
      el.play().catch(() => setIsSpeaking(false));
    } catch {
      setIsSpeaking(false);
    }
  }

  const replayMessageAudio = useCallback(async (text) => {
    setError(null);
    try {
      const { audioBase64, mime } = await api.synthesizeSpeech(text);
      playAudioBase64(audioBase64, mime);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadDemo = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await api.loadDemoConversation();
      await refreshAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [refreshAll]);

  const loadMusic = useCallback(async () => {
    setBusy(true);
    try {
      await api.loadMusicProfile();
      await refreshAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [refreshAll]);

  const loadSocial = useCallback(async () => {
    setBusy(true);
    try {
      await api.loadSocialContext();
      await refreshAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [refreshAll]);

  const resetAll = useCallback(async () => {
    setBusy(true);
    try {
      await api.resetDemo();
      setExplainability(null);
      await refreshAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [refreshAll]);

  const deleteMemory = useCallback(async (id) => {
    try {
      await api.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  return {
    // state
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
    // actions
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
  };
}

export default useMemora;
