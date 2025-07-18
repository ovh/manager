import i18next, { i18n, InitOptions } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import billing from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/billing/Messages_fr_FR.json';
import contact from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/contact/Messages_fr_FR.json';
import status from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/status/Messages_fr_FR.json';
import commonDashboard from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import common from '../../../public/translations/hycu/Messages_fr_FR.json';
import dashboard from '../../../public/translations/hycu/dashboard/Messages_fr_FR.json';
import listing from '../../../public/translations/hycu/listing/Messages_fr_FR.json';
import onboarding from '../../../public/translations/hycu/onboarding/Messages_fr_FR.json';
import order from '../../../public/translations/hycu/order/Messages_fr_FR.json';
import terminate from '../../../public/translations/hycu/terminate/Messages_fr_FR.json';
import editPack from '../../../public/translations/hycu/edit-pack/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'hycu', common)
    .addResources(defaultLocale, 'hycu/dashboard', dashboard)
    .addResources(defaultLocale, 'hycu/listing', listing)
    .addResources(defaultLocale, 'hycu/onboarding', onboarding)
    .addResources(defaultLocale, 'hycu/order', order)
    .addResources(defaultLocale, 'hycu/terminate', terminate)
    .addResources(defaultLocale, 'hycu/edit-pack', editPack)
    .addResources(defaultLocale, NAMESPACES.ACTIONS, actions)
    .addResources(defaultLocale, NAMESPACES.BILLING, billing)
    .addResources(defaultLocale, NAMESPACES.CONTACT, contact)
    .addResources(defaultLocale, NAMESPACES.STATUS, status)
    .addResources(defaultLocale, NAMESPACES.DASHBOARD, commonDashboard)
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
  order,
  terminate,
  editPack,
  actions,
  billing,
  contact,
  status,
  commonDashboard,
};
