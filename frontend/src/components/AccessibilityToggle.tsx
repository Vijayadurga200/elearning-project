import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS

interface AccessibilityToggleProps {
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  userType: 'visual' | 'hearing' | 'none';
  setUserType: React.Dispatch<React.SetStateAction<'visual' | 'hearing' | 'none'>>;
}

const AccessibilityToggle: React.FC<AccessibilityToggleProps> = ({
  highContrast,
  setHighContrast,
  userType,
  setUserType
}) => {

  const navigate = useNavigate(); // ✅ ADD THIS

  return (
    <div className="fixed top-0 right-0 h-16 flex items-center pr-6 z-50 space-x-3 bg-transparent">
      
      {/* HC Toggle */}
      <button
        onClick={() => setHighContrast(!highContrast)}
        className={`px-4 py-1 rounded-lg border transition-all ${
          highContrast
            ? 'bg-red-500 text-white'
            : 'bg-gray-900 text-white'
        }`}
      >
        {highContrast ? 'HC-OFF' : 'HC-ON'}
      </button>

      {/* Mode Selector */}
      <select
        value={userType}
        onChange={(e) => setUserType(e.target.value as 'visual' | 'hearing' | 'none')}
        className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
      >
        <option value="none">Standard</option>
        <option value="visual">👁️ Visual</option>
        <option value="hearing">👂 Hearing</option>
      </select>

      {/* Voice */}
      <button className="px-4 py-1 bg-purple-500 text-white rounded-lg">
        🎤 Voice
      </button>

      {/* 🤟 Sign Language ICON (NEW) */}
      <button
        onClick={() => navigate('/sign-language')}
        className="p-2 bg-green-500 text-white rounded-full hover:scale-110 transition"
        title="Sign Language"
      >
        🤟
      </button>

    </div>
  );
};

export default AccessibilityToggle;