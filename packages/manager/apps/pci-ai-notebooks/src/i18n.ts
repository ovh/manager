import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export default function initI18n(
  locale = 'fr_FR',
  availablesLocales = ['fr_FR'],
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
      lng: locale,
      debug: false,
      fallbackLng: 'fr_FR',
      supportedLngs: availablesLocales,
      ns: ['pci-ai-notebooks', 'bytes'], // namespaces to load by default
      backend: {
        loadPath: (lngs: string[], namespaces: string[]) =>
          `${import.meta.env.BASE_URL}translations/${namespaces[0]}/Messages_${
            lngs[0]
          }.json`,
      },
      postProcess: 'normalize',
    })
    .then(() => {
      // plurals are set for locales like this: en-GB, so our locale en_GB is not found.
      // We copy the rules for each available locale
      availablesLocales.forEach((l) => {
        i18n.services.pluralResolver.addRule(
          l,
          i18n.services.pluralResolver.getRule(l.replace('_', '-')),
        );
      });
    });

  return i18n;
}
