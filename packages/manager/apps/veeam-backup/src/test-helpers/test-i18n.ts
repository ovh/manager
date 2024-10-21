import i18next, { i18n } from 'i18next';
import error from '@ovh-ux/manager-react-components/src/components/templates/error/translations/Messages_fr_FR.json';
import deleteModal from '@ovh-ux/manager-react-components/src/components/templates/delete-modal/translations/Messages_fr_FR.json';
import common from '../../public/translations/veeam-backup/Messages_fr_FR.json';
import orderVeeam from '../../public/translations/order-veeam/Messages_fr_FR.json';
import listing from '../../public/translations/listing/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import deleteVeeam from '../../public/translations/delete-veeam/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import { appName } from '../../src/veeam-backup.config';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, appName, common)
    .addResources(defaultLocale, 'order-veeam', orderVeeam)
    .addResources(defaultLocale, 'listing', listing)
    .addResources(defaultLocale, 'dashboard', dashboard)
    .addResources(defaultLocale, 'onboarding', onboarding)
    .addResources(defaultLocale, 'delete-veeam', deleteVeeam)
    .addResources(defaultLocale, 'error', error)
    .addResources(defaultLocale, 'delete-modal', deleteModal)
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
      defaultNS: appName,
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
  orderVeeam,
  dashboard,
  deleteVeeam,
  listing,
  error,
  deleteModal,
};
