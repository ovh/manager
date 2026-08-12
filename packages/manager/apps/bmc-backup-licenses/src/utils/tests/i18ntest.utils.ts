import i18next, { InitOptions, i18n } from 'i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import actions from '@ovh-ux/manager-common-translations/dist/@ovh-ux/manager-common-translations/actions/Messages_fr_FR.json';

import { appName } from '@/App.constants';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];
function addTranslations() {
  i18next.addResources(defaultLocale, NAMESPACES.ACTIONS, actions).use({
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
  actions,
};
