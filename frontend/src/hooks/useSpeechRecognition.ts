import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseSpeechRecognitionHook {
  transcript: string;
  listening: boolean;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export const useSpeechRecognitionHook = (): UseSpeechRecognitionHook => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    ...speechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  };
};