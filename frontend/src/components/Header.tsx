import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">

        {/* LOGO */}
        <h1 className="text-lg sm:text-xl font-bold text-purple-400">
          🎓 EduAccess
        </h1>

        {/* NAV (scrollable on mobile) */}
        <nav className="flex gap-4 overflow-x-auto text-sm sm:text-base w-full sm:w-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap ${
                location.pathname === item.path
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

          {/* 🌐 LANGUAGE */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-black px-2 py-1 rounded text-sm"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="te">TE</option>
          </select>

          {/* ✅ DESKTOP CONTROLS */}
          <div className="hidden md:flex items-center gap-2">

            <button
              onClick={() => setUserType('none')}
              className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Standard
            </button>

            <button
              onClick={() => setHighContrast(!highContrast)}
              className="px-2 py-1 bg-yellow-600 text-white rounded text-sm"
            >
              HC
            </button>

            <button
              onClick={() => setVoiceActive(!voiceActive)}
              className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Voice
            </button>

          </div>

          {/* ✅ MOBILE DROPDOWN (YOUR REQUIREMENT) */}
          <div className="md:hidden">
            <select
              className="text-black px-2 py-1 rounded text-sm"
              onChange={(e) => {
                const value = e.target.value;

                if (value === "standard") setUserType('none');
                if (value === "hc") setHighContrast(!highContrast);
                if (value === "voice") setVoiceActive(!voiceActive);
              }}
            >
              <option>⚙️</option>
              <option value="standard">Standard</option>
              <option value="hc">High Contrast</option>
              <option value="voice">Voice</option>
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
