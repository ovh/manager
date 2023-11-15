import i18n from 'i18next';
import Backend from 'i18next-http-backend';

i18n.init({
  fallbackLng: 'en-GB',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
