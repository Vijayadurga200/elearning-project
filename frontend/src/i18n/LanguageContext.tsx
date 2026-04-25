import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./languages";

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: any) => {
  const [language, setLanguage] = useState("en");

  // load saved
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

  // save on change
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const t = (key: string) => {
    return translations[language]?.[key] ?? translations["en"]?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);