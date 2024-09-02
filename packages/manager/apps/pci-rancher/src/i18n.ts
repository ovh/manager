import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const ns = [
  'listing',
  'dashboard',
  'updateSoftware',
  'onboarding',
  'order-price',
];

export default async function initI18n(
  locale = 'fr_FR',
  availablesLocales = ['fr_FR'],
) {
  await i18n
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) =>
        value ? value.replace(/&amp;/g, '&') : value,
    })
    .init({
      lng: locale,
      fallbackLng: 'fr_FR',
      supportedLngs: availablesLocales,
      fallbackNS: ns,
      ns, // namespaces to load by default
      backend: {
        loadPath: (lngs: string[], namespaces: string[]) =>
          `${import.meta.env.BASE_URL}translations/${namespaces[0]}/Messages_${
            lngs[0]
          }.json`,
      },
      postProcess: 'normalize',
      debug: true,
    });

  return i18n;
}
