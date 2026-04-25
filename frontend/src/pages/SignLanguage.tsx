import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignLanguage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  // 🎥 Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera not accessible ❌");
    }
  };

  // 🛑 Stop Camera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  // 🤟 Simulated Gesture Detection
  const startGestureMode = () => {
    setActive(true);

    alert("Gesture Mode Started!\n\nShow hand for 3 seconds...");

    setTimeout(() => {
      // simulate detection
      const actions = ["/", "/courses", "/profile", "/admin", "/accessibility"];
      const random = actions[Math.floor(Math.random() * actions.length)];

      alert("Gesture detected! Navigating...");

      navigate(random);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl mb-6">🤟 Sign Language Control</h1>

      {/* Camera */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-96 h-72 border rounded"
      />

      {/* Instructions */}
      <p className="mt-4 text-gray-400 text-center">
        Click below and show gesture 👇 <br />
        System will detect automatically
      </p>

      {/* Start Button */}
      <button
        onClick={startGestureMode}
        className="mt-6 px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700"
      >
        🤟 Start Gesture Detection
      </button>

      {/* Stop Button */}
      <button
        onClick={stopCamera}
        className="mt-3 px-6 py-2 bg-red-500 rounded-lg"
      >
        Stop Camera
      </button>
    </div>
  );
};

export default SignLanguage;