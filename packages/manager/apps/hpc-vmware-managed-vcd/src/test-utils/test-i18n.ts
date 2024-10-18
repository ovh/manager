import i18next, { i18n } from 'i18next';
import error from '@ovh-ux/manager-react-components/src/components/templates/error/translations/Messages_fr_FR.json';
import listing from '../../public/translations/listing/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import common from '../../public/translations/hpc-vmware-managed-vcd/Messages_fr_FR.json';
import datacentres from '../../public/translations/hpc-vmware-managed-vcd/datacentres/Messages_fr_FR.json';
import datacentresCompute from '../../public/translations/hpc-vmware-managed-vcd/datacentres/compute/Messages_fr_FR.json';
import datacentresOrder from '../../public/translations/hpc-vmware-managed-vcd/datacentres/order/Messages_fr_FR.json';
import datacentresStorage from '../../public/translations/hpc-vmware-managed-vcd/datacentres/storage/Messages_fr_FR.json';
import { APP_NAME } from '../tracking.constant';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, APP_NAME, common)
    .addResources(defaultLocale, 'listing', listing)
    .addResources(defaultLocale, 'dashboard', dashboard)
    .addResources(defaultLocale, 'onboarding', onboarding)
    .addResources(defaultLocale, `${APP_NAME}/datacentres`, datacentres)
    .addResources(
      defaultLocale,
      `${APP_NAME}/datacentres/compute`,
      datacentresCompute,
    )
    .addResources(
      defaultLocale,
      `${APP_NAME}/datacentres/order`,
      datacentresOrder,
    )
    .addResources(
      defaultLocale,
      `${APP_NAME}/datacentres/storage`,
      datacentresStorage,
    )
    .addResources(defaultLocale, 'error', error)
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
      defaultNS: APP_NAME,
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
  onboarding,
  dashboard,
  listing,
  error,
  datacentres,
  datacentresCompute,
  datacentresOrder,
  datacentresStorage,
};
