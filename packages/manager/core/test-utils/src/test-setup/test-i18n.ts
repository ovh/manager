import i18next, { i18n } from 'i18next';

export type TranslationObject = {
  [translationKey: string]: Record<string, string>;
};

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations(translations: TranslationObject) {
  Object.entries(translations).forEach(([key, values]) =>
    i18next.addResources(defaultLocale, key, values),
  );
  i18next.use({
    type: 'postProcessor',
    name: 'normalize',
    process: (value: string) => (value ? value.replace(/&amp;/g, '&') : value),
  });
}

export const initTestI18n = (
  appName: string,
  translations: TranslationObject,
) =>
  new Promise<i18n>((resolve) => {
    i18next.init({
      lng: defaultLocale,
      defaultNS: appName,
      ns: [],
      supportedLngs: defaultAvailableLocales,
      postProcess: 'normalize',
      interpolation: {
        escapeValue: false,
      },
    });

    if (i18next.isInitialized) {
      addTranslations(translations);
    } else {
      i18next.on('initialized', () => {
        addTranslations(translations);
        resolve(i18next);
      });
    }

    return translations;
  });
