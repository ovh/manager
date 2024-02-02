import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const ovhLocaleToI18next = (ovhLocale = '') => ovhLocale.replace('_', '-');
const i18nextLocaleToOvh = (i18nextLocale = '') =>
  i18nextLocale.replace('-', '_');

export default function initI18n(
  locale = 'fr-FR',
  availableLocales = ['fr-FR'],
) {
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
      lng: ovhLocaleToI18next(locale),
      fallbackLng: 'fr-FR',
      defaultNS: 'vrack-services',
      supportedLngs: availableLocales.map(ovhLocaleToI18next),
      ns: ['vrack-services', 'vrack-services/listing'],
      postProcess: 'normalize',
      backend: {
        allowMultiLoading: false,
        loadPath: (lngs: string[], namespaces: string[]) =>
          `${import.meta.env.BASE_URL}translations/${
            namespaces[0]
          }/Messages_${i18nextLocaleToOvh(lngs[0])}.json`,
      },
    });

  return i18n;
}
