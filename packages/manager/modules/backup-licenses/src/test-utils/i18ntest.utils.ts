import i18next, { InitOptions, i18n } from 'i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import billing from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/billing/Messages_fr_FR.json';
import commonDashboard from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import region from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/region/Messages_fr_FR.json';
import status from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';
import system from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/system/Messages_fr_FR.json';

import { NAMESPACE_PREFIX } from '@/BackupLicenses.translations';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import billingTab from '../../public/translations/billing/Messages_fr_FR.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import common from '../../public/translations/common/Messages_fr_FR.json';
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vaults from '../../public/translations/vaults/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

/**
 * Le glob évite qu'un dossier de traduction ajouté soit oublié ici. Le namespace se déduit du nom
 * du dossier parce que les applis copient `public/translations/*` sous
 * `translations/<NAMESPACE_PREFIX>/` (staticCopy de leur vite.config).
 */
export const moduleResources: Record<string, unknown> = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../public/translations/*/Messages_fr_FR.json', {
      eager: true,
      import: 'default',
    }),
  ).map(([file, resources]) => [
    file.replace('../../public/translations', NAMESPACE_PREFIX).replace('/Messages_fr_FR.json', ''),
    resources,
  ]),
);

/**
 * Namespaces partagés : les composants les résolvent par `t('region:…')`, donc ils doivent être
 * enregistrés dans i18next, et pas seulement exposés dans `labels` pour les assertions.
 */
export const sharedResources: Record<string, unknown> = {
  [NAMESPACES.ACTIONS]: actions,
  [NAMESPACES.BILLING]: billing,
  [NAMESPACES.DASHBOARD]: commonDashboard,
  [NAMESPACES.REGION]: region,
  [NAMESPACES.STATUS]: status,
  [NAMESPACES.SYSTEM]: system,
};

/**
 * `addResources` ignore silencieusement toute valeur imbriquée (seules les chaînes/tableaux
 * de premier niveau sont pris en compte) : nos JSON de traduction ont des clés imbriquées
 * (`license.*`, `column.*`, `badge.*`, `usage.*`...), il faut `addResourceBundle` en fusion
 * profonde pour que les tests résolvent les vrais libellés plutôt que la clé brute.
 */
function addTranslations() {
  Object.entries({ ...moduleResources, ...sharedResources }).forEach(([namespace, resources]) => {
    i18next.addResourceBundle(defaultLocale, namespace, resources, true);
  });
  // eslint-disable-next-line import/no-named-as-default-member
  i18next.use({
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
  vaults,
};
