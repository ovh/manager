/// <reference types="vite/client" />
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18NextHttpBackend from 'i18next-http-backend';

i18n
.use(initReactI18next)
.use(I18NextHttpBackend)
.use({
  type: 'postProcessor',
  name: 'normalize',
  process: (value: string) => (value ? value.replace(/&amp;/g, '&') : value),
})
.init({
  fallbackLng: 'fr_FR',
  interpolation: {
    escapeValue: false,
  },
  defaultNS: 'common',
  ns: ['common'],
  backend: {
    loadPath: (lngs: string[], namespaces: string[]) => {
      const [lng] = lngs;
      const [ns] = namespaces;
      return `${import.meta.env.BASE_URL}translations/${ns}/Messages_${lng}.json`;
    },
  },
  postProcess: 'normalize',
});

export default i18n;
