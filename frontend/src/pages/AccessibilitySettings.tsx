import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../i18n/LanguageContext"; // ✅ ADD THIS

interface Props {
  accessMode: string;
  setAccessMode: (mode: string) => void;
}

const AccessibilitySettings: React.FC<Props> = ({
  accessMode,
  setAccessMode,
}) => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  // ✅ USE GLOBAL LANGUAGE
  const { language, setLanguage, t } = useLang();

  // 🎤 Voice Recognition
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript.toLowerCase();

      if (text.includes("home")) navigate("/");
      else if (text.includes("courses")) navigate("/courses");
      else if (text.includes("admin")) navigate("/admin");
      else if (text.includes("profile")) navigate("/profile");
      else if (text.includes("accessibility")) navigate("/accessibility");
      else alert("Command not recognized");
    };
  };

  return (
    <div className="space-y-8">

      {/* 🌐 Language */}
      <div>
        <h2 className="text-xl font-bold">🌐 {t("language")}</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-2 p-2 border rounded"
        >
          <option value="en">🇺🇸 English</option>
          <option value="te">🇮🇳 Telugu</option>
          <option value="hi">🇮🇳 Hindi</option>
        </select>
      </div>

      {/* ♿ Accessibility Mode */}
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-bold">
          ♿ {t("accessibility_mode")}
        </h2>

        <div className="flex gap-3 mt-4 flex-wrap">
          <button onClick={() => setAccessMode("normal")} className="btn-primary">
            👤 {t("normal")}
          </button>

          <button onClick={() => setAccessMode("visual")} className="btn-primary">
            👁️ {t("visual")}
          </button>

          <button onClick={() => setAccessMode("hearing")} className="btn-primary">
            👂 {t("hearing")}
          </button>

          <button onClick={() => setAccessMode("both")} className="btn-primary">
            🖐️ {t("motor")}
          </button>
        </div>
      </div>

      {/* 🎤 Voice */}
      <div className="p-4 border rounded shadow">
        <h2 className="text-xl font-bold">
          🎤 {t("voice_control")}
        </h2>

        <button
          onClick={startVoice}
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded"
        >
          {t("activate_voice")}
        </button>
      </div>

      {/* ❓ Help */}
      <div className="p-4 border rounded shadow">
        <button
          onClick={() => setShowHelp(true)}
          className="font-bold text-purple-600"
        >
          ❓ {t("help")}
        </button>
      </div>

      {/* 🔥 HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 max-w-2xl w-full shadow-xl relative">

            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-3 right-4 text-xl font-bold"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold mb-4">
              💡 {t("help")}
            </h2>

            <p>{t("feedback_question")}</p>

          </div>
        </div>
      )}

    </div>
  );
};

export default AccessibilitySettings;