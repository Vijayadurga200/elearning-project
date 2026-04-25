import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import AccessibilitySettings from './pages/AccessibilitySettings';
import SignLanguage from './pages/SignLanguage';

import AIChatbot from './components/AIChatbot';
import AccessibilityToggle from './components/AccessibilityToggle';

// ✅ REMOVE OLD
// import { useTranslation } from './i18n/useTranslation';

// ✅ ADD NEW
import { useLang } from './i18n/LanguageContext';

function App() {
  const [userType, setUserType] = useState<'visual' | 'hearing' | 'none'>('none');
  const [highContrast, setHighContrast] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const [accessMode, setAccessMode] = useState('normal');

  // ✅ USE GLOBAL LANGUAGE
  const { language, setLanguage } = useLang();

  // ❌ REMOVE THIS
  // const t = useTranslation(language);

  // Load preferences
  useEffect(() => {
    try {
      const prefs = localStorage.getItem('eduaccess_prefs');

      if (prefs) {
        const parsed = JSON.parse(prefs);

        setAccessMode(parsed.accessMode || 'normal');
        setHighContrast(parsed.highContrast || false);
        setVoiceActive(parsed.voiceActive || false);
        setLanguage(parsed.language || 'en');
      }
    } catch (e) {
      console.log("Storage error:", e);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    const prefs = {
      accessMode,
      highContrast,
      voiceActive,
      language
    };

    localStorage.setItem('eduaccess_prefs', JSON.stringify(prefs));
  }, [accessMode, highContrast, voiceActive, language]);

  // User type mapping
  useEffect(() => {
    if (accessMode === 'visual') setUserType('visual');
    else if (accessMode === 'hearing') setUserType('hearing');
    else if (accessMode === 'both') setUserType('visual');
    else setUserType('none');
  }, [accessMode]);

  const updatePreferences = (prefs: any) => {
    const newPrefs = {
      accessMode: prefs.disability || 'normal',
      highContrast: prefs.highContrast,
      voiceActive,
      language
    };

    localStorage.setItem('eduaccess_prefs', JSON.stringify(newPrefs));

    setAccessMode(newPrefs.accessMode);
    setHighContrast(newPrefs.highContrast);
  };

  return (
    <Router>
      <div
        className={`min-h-screen transition-all duration-300
        ${accessMode === 'visual' ? 'visual-mode' : ''}
        ${accessMode === 'hearing' ? 'audio-mode' : ''}
        ${accessMode === 'both' ? 'visual-mode audio-mode' : ''}
        ${highContrast ? 'hc-mode' : ''}
        ${
          accessMode === 'normal'
            ? 'bg-gradient-to-br from-blue-500 to-purple-700 text-white'
            : ''
        }
        `}
      >

        {/* ✅ NO t, NO language props */}
        <Header
          userType={userType}
          highContrast={highContrast}
          setUserType={setUserType}
          voiceActive={voiceActive}
          setVoiceActive={setVoiceActive}
          setHighContrast={setHighContrast}
        />

        <main className="p-6 md:p-10">
          <Routes>

            {/* ✅ REMOVE t FROM ALL */}
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/courses" element={<Courses userType={userType} />} />
            <Route path="/courses/:id" element={<CourseDetail userType={userType} />} />

            <Route
              path="/profile"
              element={<Profile userType={userType} updatePreferences={updatePreferences} />}
            />

            <Route
              path="/accessibility"
              element={
                <AccessibilitySettings
                  accessMode={accessMode}
                  setAccessMode={setAccessMode}
                />
              }
            />

            <Route path="/sign-language" element={<SignLanguage />} />

          </Routes>
        </main>

        <AIChatbot userType={userType} />

        <AccessibilityToggle
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          userType={userType}
          setUserType={setUserType}
        />

      </div>
    </Router>
  );
}

export default App;