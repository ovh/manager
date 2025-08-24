import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const ovhLocaleToI18next = (ovhLocale = '') => ovhLocale.replace('_', '-');
const i18nextLocaleToOvh = (i18nextLocale = '') => i18nextLocale.replace('-', '_');

export async function initI18n(locale: string, availableLocales: string[]) {
  return i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
      lng: ovhLocaleToI18next(locale),
      fallbackLng: 'fr-FR',
      ns: ['common'],
      defaultNS: 'common',
      supportedLngs: availableLocales.map(ovhLocaleToI18next),
      backend: {
        loadPath: (lngs, namespaces) => {
          const [ns] = namespaces;
          const [lng] = lngs;
          return `${
            import.meta.env.BASE_URL
          }translations/${ns}/Messages_${i18nextLocaleToOvh(lng)}.json`;
        },
        allowMultiLoading: false,
      },
    });
}

export default initI18n;
