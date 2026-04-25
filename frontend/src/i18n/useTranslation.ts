import { translations } from "./languages";

export const useTranslation = (lang: string) => {
  return (key: string) => {
    return translations?.[lang]?.[key] || translations.en[key] || key;
  };
};