import { InitOptions } from 'i18next';

import { initTestI18n as coreInitTestI18n } from '@ovh-ux/manager-core-test-utils';

import { APP_NAME, TRANSLATION_NAMESPACES } from '@/utils/constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import common from '../../public/translations/common/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import publicIpRouting from '../../public/translations/publicIpRouting/Messages_fr_FR.json';
import { appName } from '../App.constants';

export const translations = {
  [TRANSLATION_NAMESPACES.common]: common,
  [TRANSLATION_NAMESPACES.dashboard]: dashboard,
  [TRANSLATION_NAMESPACES.publicIpRouting]: publicIpRouting,
};

export const labels = {
  common,
  dashboard,
  onboarding,
  publicIpRouting,
};

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

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

export const initTestI18n = () => coreInitTestI18n(APP_NAME, translations);
