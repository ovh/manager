import i18next, { i18n, InitOptions } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';
import form from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/form/Messages_fr_FR.json';
import resources from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/resources/Messages_fr_FR.json';
import system from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/system/Messages_fr_FR.json';
import time from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/time/Messages_fr_FR.json';
import upload from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/upload/Messages_fr_FR.json';
import commonDashboard from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/dashboard/Messages_fr_FR.json';
import common from '../../public/translations/sap-features-hub/Messages_fr_FR.json';
import listing from '../../public/translations/listing/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import installation from '../../public/translations/installation/Messages_fr_FR.json';
import { appName } from '@/sap-features-hub.config';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'common', common)
    .addResources(defaultLocale, 'listing', listing)
    .addResources(defaultLocale, 'dashboard', dashboard)
    .addResources(defaultLocale, 'onboarding', onboarding)
    .addResources(defaultLocale, 'installation', installation)
    .addResources(defaultLocale, NAMESPACES.ACTIONS, actions)
    .addResources(defaultLocale, NAMESPACES.DASHBOARD, commonDashboard)
    .addResources(defaultLocale, NAMESPACES.FORM, form)
    .addResources(defaultLocale, NAMESPACES.RESOURCES, resources)
    .addResources(defaultLocale, NAMESPACES.SYSTEM, system)
    .addResources(defaultLocale, NAMESPACES.TIME, time)
    .addResources(defaultLocale, NAMESPACES.UPLOAD, upload)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) =>
        value ? value.replace(/&amp;/g, '&') : value,
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
  listing,
  dashboard,
  onboarding,
  installation,
  actions,
  form,
  resources,
  system,
  time,
  upload,
  commonDashboard,
};
