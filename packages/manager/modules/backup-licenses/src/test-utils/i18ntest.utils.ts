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
import billingTab from '../../public/translations/billing/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import generalInformation from '../../public/translations/general-information/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import linkedServers from '../../public/translations/linked-servers/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import order from '../../public/translations/order/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];
/**
 * `addResources` ignore silencieusement toute valeur imbriquée (seules les chaînes/tableaux
 * de premier niveau sont pris en compte) : nos JSON de traduction ont des clés imbriquées
 * (`license.*`, `column.*`, `badge.*`, `usage.*`...), il faut `addResourceBundle` en fusion
 * profonde pour que les tests résolvent les vrais libellés plutôt que la clé brute.
 */
function addTranslations() {
  i18next
    .addResourceBundle(defaultLocale, BACKUP_LICENSES_NAMESPACES.COMMON, common, true)
    .addResourceBundle(defaultLocale, BACKUP_LICENSES_NAMESPACES.ONBOARDING, onboarding, true)
    .addResourceBundle(defaultLocale, BACKUP_LICENSES_NAMESPACES.ORDER, order, true)
    .addResourceBundle(defaultLocale, BACKUP_LICENSES_NAMESPACES.DASHBOARD, dashboard, true)
    .addResourceBundle(
      defaultLocale,
      BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS,
      linkedServers,
      true,
    )
    .addResourceBundle(
      defaultLocale,
      BACKUP_LICENSES_NAMESPACES.GENERAL_INFORMATION,
      generalInformation,
      true,
    )
    .addResourceBundle(defaultLocale, BACKUP_LICENSES_NAMESPACES.BILLING, billingTab, true)
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
export const initTestI18n = async (): Promise<i18n> => {
  if (!i18next.isInitialized) {
    // eslint-disable-next-line import/no-named-as-default-member
    await i18next.init(getTesti18nParams());
  }
  addTranslations();
  return i18next;
};

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
  dashboard,
  linkedServers,
  generalInformation,
  billingTab,
};
