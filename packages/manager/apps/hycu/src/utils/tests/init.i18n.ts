import i18next, { i18n } from 'i18next';
import common from '../../../public/translations/common/Messages_fr_FR.json';
import dashboard from '../../../public/translations/dashboard/Messages_fr_FR.json';
import listing from '../../../public/translations/listing/Messages_fr_FR.json';
import onboarding from '../../../public/translations/onboarding/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'hycu/common', common)
    .addResources(defaultLocale, 'hycu/dashboard', dashboard)
    .addResources(defaultLocale, 'hycu/listing', listing)
    .addResources(defaultLocale, 'hycu/onboarding', onboarding)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) =>
        value ? value.replace(/&amp;/g, '&') : value,
    });
}

export const initTestI18n = () =>
  new Promise<i18n>((resolve) => {
    i18next.init({
      lng: defaultLocale,
      defaultNS: 'hycu',
      ns: [],
      supportedLngs: defaultAvailableLocales,
      postProcess: 'normalize',
      interpolation: {
        escapeValue: false,
      },
    });

    if (i18next.isInitialized) {
      addTranslations();
    } else {
      i18next.on('initialized', () => {
        addTranslations();
        resolve(i18next);
      });
    }
  });

export const labels = {
  common,
  dashboard,
  listing,
  onboarding,
};
