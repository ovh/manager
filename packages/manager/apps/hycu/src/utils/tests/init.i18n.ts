import i18next, { i18n, InitOptions } from 'i18next';
import error from '@ovh-ux/manager-react-components/src/components/templates/error/translations/Messages_fr_FR.json';
import common from '../../../public/translations/hycu/Messages_fr_FR.json';
import dashboard from '../../../public/translations/hycu/dashboard/Messages_fr_FR.json';
import listing from '../../../public/translations/hycu/listing/Messages_fr_FR.json';
import onboarding from '../../../public/translations/hycu/onboarding/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'hycu', common)
    .addResources(defaultLocale, 'hycu/dashboard', dashboard)
    .addResources(defaultLocale, 'hycu/listing', listing)
    .addResources(defaultLocale, 'hycu/onboarding', onboarding)
    .addResources(defaultLocale, 'error', error)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) =>
        value ? value.replace(/&amp;/g, '&') : value,
    });
}

export const getTesti18nParams = (): InitOptions<unknown> => ({
  lng: defaultLocale,
  defaultNS: 'hycu',
  ns: [],
  supportedLngs: defaultAvailableLocales,
  postProcess: 'normalize',
  interpolation: {
    escapeValue: false,
  },
});

export const initTestI18n = () =>
  new Promise<i18n>((resolve) => {
    i18next.init(getTesti18nParams());

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
  error,
};
