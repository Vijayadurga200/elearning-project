import React from 'react';
import { useSpeechRecognitionHook } from '../hooks/useSpeechRecognition';

const VoiceControls: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening,
  } = useSpeechRecognitionHook();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-xl text-yellow-100">
        <p>Your browser does not support speech recognition. Try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl">
      {/* Voice Status */}
      <div className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl">
        <div className={`w-4 h-4 rounded-full ${listening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
        <span className="font-semibold text-white">
          {listening ? '🎤 Listening...' : '🔇 Ready to listen'}
        </span>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-h-32 overflow-y-auto">
          <p className="text-white text-sm whitespace-pre-wrap">{transcript}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 pt-4 border-t border-white/20">
        <button
          onClick={listening ? stopListening : startListening}
          className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform ${
            listening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
              : 'btn-primary hover:shadow-xl hover:scale-105'
          }`}
          aria-label={listening ? "Stop listening" : "Start listening"}
        >
          {listening ? '🛑 Stop' : '🎤 Start Listening'}
        </button>
        <button
          onClick={resetTranscript}
          className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-200"
          aria-label="Clear transcript"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default VoiceControls;