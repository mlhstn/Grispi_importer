import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, getLanguageByCode, detectBrowserLanguage, DEFAULT_LANGUAGE } from '../i18n/languages';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // Mevcut dili al
    const savedLanguage = localStorage.getItem('language');
    const detectedLanguage = savedLanguage || detectBrowserLanguage() || DEFAULT_LANGUAGE;
    
    if (detectedLanguage !== currentLanguage) {
      setCurrentLanguage(detectedLanguage);
      i18n.changeLanguage(detectedLanguage);
      
      // Document direction ayarla
      const language = getLanguageByCode(detectedLanguage);
      if (language) {
        document.documentElement.dir = language.dir || 'ltr';
        document.documentElement.lang = detectedLanguage;
      }
    }
  }, [i18n, currentLanguage]);

  const changeLanguage = (languageCode: string) => {
    const language = getLanguageByCode(languageCode);
    if (language) {
      setCurrentLanguage(languageCode);
      i18n.changeLanguage(languageCode);
      localStorage.setItem('language', languageCode);
      
      // Document direction ve lang ayarla
      document.documentElement.dir = language.dir || 'ltr';
      document.documentElement.lang = languageCode;
    }
  };

  const getCurrentLanguageInfo = () => {
    return getLanguageByCode(currentLanguage);
  };

  return {
    currentLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    supportedLanguages: SUPPORTED_LANGUAGES.sort((a, b) => a.nativeName.localeCompare(b.nativeName)),
    isRTL: getLanguageByCode(currentLanguage)?.dir === 'rtl'
  };
};
