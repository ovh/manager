import i18next, { i18n } from 'i18next';
import common from '../../../public/translations/key-management-service/common/Messages_fr_FR.json';
import create from '../../../public/translations/key-management-service/create/Messages_fr_FR.json';
import dashboard from '../../../public/translations/key-management-service/dashboard/Messages_fr_FR.json';
import error from '../../../public/translations/key-management-service/error/Messages_fr_FR.json';
import guide from '../../../public/translations/key-management-service/guide/Messages_fr_FR.json';
import listing from '../../../public/translations/key-management-service/listing/Messages_fr_FR.json';
import onboarding from '../../../public/translations/key-management-service/onboarding/Messages_fr_FR.json';
import serviceKeys from '../../../public/translations/key-management-service/serviceKeys/Messages_fr_FR.json';
import terminate from '../../../public/translations/key-management-service/terminate/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'key-management-service/common', common)
    .addResources(defaultLocale, 'key-management-service/create', create)
    .addResources(defaultLocale, 'key-management-service/dashboard', dashboard)
    .addResources(defaultLocale, 'key-management-service/error', error)
    .addResources(defaultLocale, 'key-management-service/guide', guide)
    .addResources(defaultLocale, 'key-management-service/listing', listing)
    .addResources(defaultLocale, 'key-management-service/terminate', terminate)
    .addResources(
      defaultLocale,
      'key-management-service/onboarding',
      onboarding,
    )
    .addResources(
      defaultLocale,
      'key-management-service/serviceKeys',
      serviceKeys,
    )
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
      defaultNS: 'key-management-service',
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
  create,
  dashboard,
  error,
  guide,
  listing,
  onboarding,
  serviceKeys,
  terminate,
};
