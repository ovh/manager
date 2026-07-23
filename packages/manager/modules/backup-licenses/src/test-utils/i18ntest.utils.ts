import i18next, { InitOptions, i18n } from 'i18next';

import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import billing from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/billing/Messages_fr_FR.json';
import commonDashboard from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import region from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/region/Messages_fr_FR.json';
import status from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';
import system from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/system/Messages_fr_FR.json';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import common from '../../public/translations/common/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import order from '../../public/translations/order/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];
function addTranslations() {
  i18next
    .addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.COMMON, common)
    .addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.ONBOARDING, onboarding)
    .addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.ORDER, order)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) => (value ? value.replace(/&amp;/g, '&') : value),
    });
}
export const getTesti18nParams = (): InitOptions<unknown> => ({
  lng: defaultLocale,
  defaultNS: 'no-app',
  ns: [],
  supportedLngs: defaultAvailableLocales,
  postProcess: 'normalize',
  interpolation: {
    escapeValue: false,
  },
});
export const initTestI18n = () =>
  new Promise<i18n>((resolve) => {
    // eslint-disable-next-line import/no-named-as-default-member
    void i18next.init(getTesti18nParams());
    if (i18next.isInitialized) {
      addTranslations();
      resolve(i18next);
    } else {
      i18next.on('initialized', () => {
        addTranslations();
        resolve(i18next);
      });
    }
  });

export const labels = {
  common,
  onboarding,
  order,
  actions,
  status,
  commonDashboard,
  billing,
  region,
  system,
};
