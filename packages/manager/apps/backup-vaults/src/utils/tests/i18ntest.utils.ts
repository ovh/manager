import i18next, { InitOptions, i18n } from 'i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import status from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';

import { appName } from '@/App.constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dashboard from '../../../public/translations/dashboard/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import listing from '../../../public/translations/listing/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import onboarding from '../../../public/translations/onboarding/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];
function addTranslations() {
  i18next
    .addResources(defaultLocale, 'listing', listing)
    .addResources(defaultLocale, 'dashboard', dashboard)
    .addResources(defaultLocale, 'onboarding', onboarding)
    .addResources(defaultLocale, NAMESPACES.STATUS, status)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) => (value ? value.replace(/&amp;/g, '&') : value),
    });
}
export const getTesti18nParams = (): InitOptions<unknown> => ({
  lng: defaultLocale,
  defaultNS: appName,
  ns: [],
  supportedLngs: defaultAvailableLocales,
  postProcess: 'normalize',
  interpolation: {
    escapeValue: false,
  },
});
export const initTestI18n = () =>
  new Promise<i18n>((resolve) => {
    void i18next.init(getTesti18nParams());
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
  listing,
  dashboard,
  onboarding,
  status,
};
