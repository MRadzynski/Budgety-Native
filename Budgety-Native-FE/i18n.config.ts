import { de, en, es, fr, it, pl, ru } from './src/data/translations';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

const resources = {
  de: {
    translation: de
  },
  en: {
    translation: en
  },
  es: {
    translation: es
  },
  fr: {
    translation: fr
  },
  it: {
    translation: it
  },
  pl: {
    translation: pl
  },
  ru: {
    translation: ru
  }
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources
});

export default i18n;
