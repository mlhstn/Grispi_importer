import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectBrowserLanguage, DEFAULT_LANGUAGE, ACTIVE_LANGUAGES } from './languages';

// Çeviri dosyalarını dinamik olarak import et
const translations = {
  tr: () => import('./tr.json'),
  en: () => import('./en.json'),
  de: () => import('./de.json')
};

// Aktif diller için resources objesi oluştur
const resources: any = {};

// Aktif diller için çeviri dosyalarını yükle
ACTIVE_LANGUAGES.forEach(lang => {
  if (translations[lang as keyof typeof translations]) {
    try {
      // Synchronous import for active languages
      const translation = require(`./${lang}.json`);
      resources[lang] = { translation };
    } catch (error) {
      console.warn(`Translation file for ${lang} not found`);
    }
  }
});

// Dil algılama: önce localStorage, sonra tarayıcı dili, son olarak varsayılan dil
const savedLanguage = localStorage.getItem('language') || detectBrowserLanguage() || DEFAULT_LANGUAGE;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
