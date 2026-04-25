import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext'; // ✅ ADD THIS


const Home = () => {
  const navigate = useNavigate();

  const { t } = useLang(); // ✅ USE GLOBAL TRANSLATION

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');

  // 🔊 Voice message
  const speakMessage = () => {
    const message = `${t("title")}. ${t("subtitle")}`;

    const speech = new SpeechSynthesisUtterance(message);
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    speakMessage();
  }, []);

  // Submit feedback
  const handleSubmit = () => {
    alert("✅ " + t("feedback_success") || "Feedback submitted!");
    setShowFeedback(false);
    setFeedbackText('');
    setSelectedEmoji('');
  };

  return (
    <div className="flex flex-col items-center text-center min-h-[80vh] space-y-10 px-4">

      {/* Title */}
      <h1 className="text-5xl font-bold text-white">
        {t("title")}
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-white/80 max-w-2xl">
        {t("subtitle")}
      </p>

      {/* 🔊 Welcome Button */}
      <button
        onClick={speakMessage}
        className="bg-blue-500 px-10 py-4 text-lg font-semibold rounded-lg text-white shadow-lg hover:scale-105 transition"
      >
        🔊 {t("welcome")}
      </button>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">

        <button
          onClick={() => navigate('/profile')}
          className="bg-green-500 px-6 py-3 rounded-lg text-white shadow-lg hover:scale-105 transition"
        >
          📝 {t("signup")}
        </button>

        <button
          onClick={() => navigate('/profile')}
          className="bg-orange-500 px-6 py-3 rounded-lg text-white shadow-lg hover:scale-105 transition"
        >
          🔑 {t("login")}
        </button>

        <button
          onClick={() => navigate('/courses')}
          className="bg-purple-500 px-6 py-3 rounded-lg text-white shadow-lg hover:scale-105 transition"
        >
          🚀 {t("explore")}
        </button>

      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <div className="text-4xl mb-3">👁️</div>
          <h3 className="text-xl font-bold text-white mb-2">{t("visual")}</h3>
          <p className="text-white/80 text-sm">
            {t("visual_desc")}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <div className="text-4xl mb-3">👂</div>
          <h3 className="text-xl font-bold text-white mb-2">{t("hearing")}</h3>
          <p className="text-white/80 text-sm">
            {t("hearing_desc")}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <div className="text-4xl mb-3">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">{t("ai")}</h3>
          <p className="text-white/80 text-sm">
            {t("ai_desc")}
          </p>
        </div>

      </div>

      {/* Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="bg-pink-500 px-6 py-3 rounded-lg text-white shadow-lg hover:scale-105"
      >
        💬 {t("feedback")}
      </button>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md text-center space-y-4">

            <h2 className="text-xl font-bold text-gray-800">
              💬 {t("feedback_title")}
            </h2>

            <p className="text-gray-600">
              {t("feedback_question")}
            </p>

            {/* Emojis */}
            <div className="flex justify-center gap-4 text-3xl">
              {["😢","😐","😊","😍"].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`hover:scale-125 ${
                    selectedEmoji === emoji ? 'scale-125' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Text */}
            <textarea
              placeholder={t("feedback_placeholder")}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                {t("cancel")}
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {t("submit")}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Home;