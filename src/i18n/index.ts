import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import es from './locales/es.json';

const PAGE_TITLES: Record<string, string> = {
  'zh-CN': '有一个地方，你不需要表现给谁看',
  en: 'A place where you don\'t need to perform',
  es: 'Un lugar donde no necesitas demostrar nada',
};

/** Resolve a language code (e.g. 'en-US', 'zh') to a known PAGE_TITLES key */
function resolveTitle(lng: string): string {
  return PAGE_TITLES[lng] || PAGE_TITLES[lng.split('-')[0]] || PAGE_TITLES['zh-CN'];
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nicep_language',
    },
  });

// Sync document lang attribute and body data-lang on language change
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.body.setAttribute('data-lang', lng);
  document.title = resolveTitle(lng);
});

// Set initial values
document.documentElement.lang = i18n.language;
document.body.setAttribute('data-lang', i18n.language);
document.title = resolveTitle(i18n.language);

export default i18n;
