import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export async function initI18n(locale) {
  return i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
      lng: locale,
      fallbackLng: 'fr_FR',
      ns: [],
      backend: {
        loadPath: '/translations/{{ns}}/Messages_{{lng}}.json',
      },
    });
}

export default initI18n;
