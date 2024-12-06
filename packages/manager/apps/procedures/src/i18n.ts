import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const availableLocales: string[] = [
  'fr_FR',
  'fr_CA',
  'en_GB',
  'pt_PT',
  'pl_PL',
  'es_ES',
  'it_IT',
  'de_DE',
];

export default function initI18n(locale = 'fr_FR', sub: string) {
  const validLocale = availableLocales.includes(locale) ? locale : 'en_GB';
  i18n
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) =>
        value ? value.replace(/&amp;/g, '&') : value,
    })
    .init({
      lng: validLocale,
      fallbackLng: 'en_GB',
      supportedLngs: availableLocales,
      ns: [
        'account-disable-2fa',
        'account-disable-2fa/error',
        'account-disable-2fa-sub',
        'account-disable-2fa-documents',
        'rgdp',
      ], // namespaces to load by default
      backend: {
        loadPath: (lngs: string[], namespaces: string[], ...d: []) => {
          const namespace: string = namespaces[0];
          if (namespace.endsWith('sub')) {
            return `${import.meta.env.BASE_URL}translations/${
              namespaces[0]
            }/${sub}/Messages_${lngs[0]}.json`;
          }
          return `${import.meta.env.BASE_URL}translations/${
            namespaces[0]
          }/Messages_${lngs[0]}.json`;
        },
      },
      postProcess: 'normalize',
    });

  return i18n;
}
