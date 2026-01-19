import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'fr_FR',
    fallbackLng: 'fr_FR',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/translations/{{ns}}/Messages_{{lng}}.json',
    },
    ns: [],
    react: {
      useSuspense: false,
    },
  })
  .catch((err) => {
    console.warn('i18n initialization error:', err);
  });

export default i18n;
