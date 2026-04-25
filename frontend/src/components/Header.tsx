import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext'; // ✅ ADD THIS

interface HeaderProps {
  userType: 'visual' | 'hearing' | 'none';
  setUserType: (type: 'visual' | 'hearing' | 'none') => void;
  voiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  userType,
  setUserType,
  voiceActive,
  setVoiceActive,
  highContrast,
  setHighContrast
}) => {
  const location = useLocation();

  // ✅ GLOBAL LANGUAGE
  const { t, language, setLanguage } = useLang();

  const navItems = [
    { path: '/', label: t("home") },
    { path: '/admin', label: t("admin") },
    { path: '/courses', label: t("courses") },
    { path: '/profile', label: t("profile") },
    { path: '/accessibility', label: t("accessibility") },
  ];

  return (
    <header className="bg-black border-b border-gray-700 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LEFT: LOGO */}
        <h1 className="text-xl font-bold text-purple-400">
          🎓 EduAccess
        </h1>

        {/* CENTER: NAV */}
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: CONTROLS */}
        <div className="flex items-center gap-3">

          {/* 🌐 LANGUAGE SELECTOR (VERY IMPORTANT) */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-black px-2 py-1 rounded"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="te">TE</option>
          </select>

        </div>

      </div>
    </header>
  );
};

export default Header;