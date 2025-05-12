import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'fr_FR',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {},
  },
});

export default i18n;
