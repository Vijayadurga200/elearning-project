import React, { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  video: string;
  content: string;
  quiz?: Array<{
    question: string;
    options: string[];
    answer: number;
  }>;
}

interface LessonPlayerProps {
  lesson: Lesson;
  userType: 'visual' | 'hearing' | 'none';
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, userType }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [result, setResult] = useState("");

  // 🎯 QUIZ STATES
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 🎥 YOUTUBE EMBED
  const getYouTubeEmbed = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // 📄 SUMMARY
  const handleSummarize = () => {
    const summary = lesson.content.slice(0, 150) + "...";
    setResult(summary);
    setActiveFeature("summary");
  };

  // 🔊 TEXT TO SPEECH
  const handleTTS = () => {
    const speech = new SpeechSynthesisUtterance(lesson.content);
    speech.rate = userType === 'visual' ? 0.8 : 1;
    speechSynthesis.speak(speech);

    setResult("🔊 Reading lesson aloud...");
    setActiveFeature("tts");
  };

  // ⬇️ DOWNLOAD
  const handleDownload = () => {
    const blob = new Blob([lesson.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${lesson.title}.txt`;
    a.click();

    setResult("⬇️ Lesson downloaded!");
    setActiveFeature("download");
  };

  // 🧠 QUIZ START
  const handleQuizStart = () => {
    if (!lesson.quiz || lesson.quiz.length === 0) {
      setResult("❌ No quiz available");
      return;
    }

    setActiveFeature("quiz");
    setQuizIndex(0);
    setScore(0);
    setShowScore(false);
  };

  // 🧠 QUIZ ANSWER
  const handleAnswerClick = (index: number) => {
    if (!lesson.quiz) return;

    setSelectedOption(index);

    if (index === lesson.quiz[quizIndex].answer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);

      if (quizIndex + 1 < lesson.quiz!.length) {
        setQuizIndex(prev => prev + 1);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">

      {/* 🎥 VIDEO */}
      <div className="course-card p-0 overflow-hidden rounded-2xl">
        <iframe
          className="w-full aspect-video"
          src={getYouTubeEmbed(lesson.video)}
          title="YouTube player"
          allowFullScreen
        ></iframe>
      </div>

      {/* 🔥 FEATURE CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT BUTTONS */}
        <div className="bg-white/10 p-6 rounded-2xl space-y-4">

          <button onClick={handleSummarize} className="w-full btn-primary py-2">
            📄 Summarize
          </button>

          <button onClick={handleQuizStart} className="w-full btn-secondary py-2">
            🧠 Take Quiz
          </button>

          <button onClick={handleTTS} className="w-full btn-primary py-2">
            🔊 Text to Speech
          </button>

          <button onClick={handleDownload} className="w-full btn-secondary py-2">
            ⬇️ Download
          </button>
        </div>

        {/* RIGHT OUTPUT */}
        <div className="bg-white/10 p-6 rounded-2xl min-h-[250px]">

          {/* QUIZ */}
          {activeFeature === "quiz" && lesson.quiz && !showScore && (
            <div>
              <h4 className="text-white mb-4">
                Q{quizIndex + 1}: {lesson.quiz[quizIndex].question}
              </h4>

              {lesson.quiz[quizIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerClick(i)}
                  className={`block w-full p-2 mb-2 rounded ${
                    selectedOption === i
                      ? i === lesson.quiz![quizIndex].answer
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-white/20"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* SCORE */}
          {activeFeature === "quiz" && showScore && (
            <div className="text-center">
              <h2 className="text-white text-xl mb-4">🎉 Quiz Completed</h2>
              <p className="text-white text-lg">
                Score: {score} / {lesson.quiz?.length}
              </p>
            </div>
          )}

          {/* OTHER RESULTS */}
          {activeFeature !== "quiz" && (
            <p className="text-white">
              {result || "Click a feature to see output..."}
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;