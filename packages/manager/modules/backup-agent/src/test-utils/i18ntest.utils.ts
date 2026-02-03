import i18next, { InitOptions, i18n } from 'i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import billing from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/billing/Messages_fr_FR.json';
import commonDashboard from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import region from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/region/Messages_fr_FR.json';
import status from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';
import system from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/system/Messages_fr_FR.json';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import common from '../../public/translations/common/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import servicesAgent from '../../public/translations/services/agent/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultDashboard from '../../public/translations/vaults/dashboard/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultDelete from '../../public/translations/vaults/delete/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaultListing from '../../public/translations/vaults/listing/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];
function addTranslations() {
  i18next
    .addResources(defaultLocale, BACKUP_AGENT_NAMESPACES.VAULT_LISTING, vaultListing)
    .addResources(defaultLocale, BACKUP_AGENT_NAMESPACES.VAULT_DASHBOARD, vaultDashboard)
    .addResources(defaultLocale, BACKUP_AGENT_NAMESPACES.VAULT_DELETE, vaultDelete)
    .addResources(defaultLocale, BACKUP_AGENT_NAMESPACES.AGENT, servicesAgent)
    .addResources(defaultLocale, BACKUP_AGENT_NAMESPACES.COMMON, common)
    .addResources(defaultLocale, NAMESPACES.ACTIONS, actions)
    .addResources(defaultLocale, NAMESPACES.STATUS, status)
    .addResources(defaultLocale, NAMESPACES.DASHBOARD, commonDashboard)
    .addResources(defaultLocale, NAMESPACES.BILLING, billing)
    .addResources(defaultLocale, NAMESPACES.REGION, region)
    .addResources(defaultLocale, NAMESPACES.SYSTEM, system)
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
    } else {
      i18next.on('initialized', () => {
        addTranslations();
        resolve(i18next);
      });
    }
  });

export const labels = {
  common,
  vaultListing,
  vaultDashboard,
  vaultDelete,
  actions,
  status,
  commonDashboard,
  billing,
  region,
  servicesAgent,
  system,
};
