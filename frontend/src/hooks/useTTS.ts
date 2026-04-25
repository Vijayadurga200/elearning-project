import { useState, useCallback } from 'react';

export const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, options?: {
    rate?: number;
    pitch?: number;
    voice?: SpeechSynthesisVoice;
  }) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisVoice();
      utterance.text = text;
      utterance.rate = options?.rate || 1.0;
      utterance.pitch = options?.pitch || 1.0;
      if (options?.voice) {
        utterance.voice = options.voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.cancel(); // Stop any ongoing speech
      speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const getVoices = useCallback((): SpeechSynthesisVoice[] => {
    return speechSynthesis.getVoices();
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    getVoices,
  };
};