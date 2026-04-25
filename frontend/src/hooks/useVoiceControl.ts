import { useEffect, useRef } from "react";

export const useVoiceControl = (enabled: boolean, navigate: any) => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("🎤 Voice recognition started");
    };

    recognition.onend = () => {
      console.log("🎤 Voice recognition stopped");
      // auto restart if still enabled
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Voice error:", event.error);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      console.log("VOICE:", transcript);

      // 🔥 NAVIGATION
      if (transcript.includes("open home")) navigate("/");
      else if (transcript.includes("open courses")) navigate("/courses");
      else if (transcript.includes("open admin")) navigate("/admin");
      else if (transcript.includes("open profile")) navigate("/profile");
      else if (transcript.includes("open accessibility")) navigate("/accessibility");

      // 🔊 READ PAGE
      else if (transcript.includes("read this")) {
        const text = document.body.innerText;

        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1;
        speech.pitch = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);
      }
    };

    if (enabled) {
      recognition.start();
      recognitionRef.current = recognition;
    }

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [enabled, navigate]);
};