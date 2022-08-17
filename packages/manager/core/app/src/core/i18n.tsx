import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export async function initI18n(locale: string) {
  return i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
      lng: locale?.replace('_', '-'),
      fallbackLng: 'fr-FR',
      ns: [],
      compatibilityJSON: 'v3', // see https://www.i18next.com/misc/json-format#i18next-json-v3
      backend: {
        loadPath: (lngs, namespaces) => {
          const [ns] = namespaces;
          const [lng] = lngs;
          return `${
            import.meta.env.BASE_URL
          }translations/${ns}/Messages_${lng.replace('-', '_')}.json`;
        },
        allowMultiLoading: false,
      },
    });
}

export default initI18n;
