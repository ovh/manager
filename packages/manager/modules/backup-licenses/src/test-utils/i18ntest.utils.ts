import i18next, { InitOptions, i18n } from 'i18next';

import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
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

function addTranslations() {
  i18next.addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.ONBOARDING, onboarding);
  i18next.addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.ORDER, order);
  i18next.addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.DASHBOARD, dashboard);
  i18next.addResources(defaultLocale, BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS, linkedServers);
}

export const getTestI18nParams = (): InitOptions<unknown> => ({
  lng: defaultLocale,
  defaultNS: 'no-app',
  ns: [],
  supportedLngs: defaultAvailableLocales,
  interpolation: { escapeValue: false },
});

export const initTestI18n = () =>
  new Promise<i18n>((resolve) => {
    // eslint-disable-next-line import/no-named-as-default-member
    void i18next.init(getTestI18nParams());
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

export const labels = { onboarding, order, dashboard, linkedServers };
