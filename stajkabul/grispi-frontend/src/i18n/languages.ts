export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

// Tüm desteklenen diller
const ALL_LANGUAGES: Language[] = [
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    dir: 'ltr'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    dir: 'ltr'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  }
];

// Şu anda aktif olan diller (çeviri dosyaları mevcut olanlar)
export const ACTIVE_LANGUAGES = ['tr', 'en', 'de'];

// Aktif dilleri filtrele
export const SUPPORTED_LANGUAGES: Language[] = ALL_LANGUAGES.filter(lang => 
  ACTIVE_LANGUAGES.includes(lang.code)
);

export const DEFAULT_LANGUAGE = 'tr';

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLanguageName = (code: string): string => {
  const language = getLanguageByCode(code);
  return language ? language.nativeName : code.toUpperCase();
};

export const getLanguageFlag = (code: string): string => {
  const language = getLanguageByCode(code);
  return language ? language.flag : '🌐';
};

export const isRTL = (code: string): boolean => {
  const language = getLanguageByCode(code);
  return language ? language.dir === 'rtl' : false;
};

// Tarayıcı dilini algıla
export const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const langCode = browserLang.split('-')[0];
  
  // Aktif diller arasında var mı kontrol et
  const supportedCode = ACTIVE_LANGUAGES.find(lang => 
    lang === langCode || lang === browserLang
  );
  
  return supportedCode || DEFAULT_LANGUAGE;
};

// Dil seçeneklerini alfabetik sıraya göre düzenle
export const getSortedLanguages = (): Language[] => {
  return [...SUPPORTED_LANGUAGES].sort((a, b) => a.nativeName.localeCompare(b.nativeName));
};
