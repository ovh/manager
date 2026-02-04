import { InitOptions } from 'i18next';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import actions from '@ovh-ux/manager-common-translations/public/translations/actions/Messages_fr_FR.json';
import { initTestI18n as coreInitTestI18n } from '@ovh-ux/manager-core-test-utils';

import { APP_NAME, TRANSLATION_NAMESPACES } from '@/utils/constants';

import common from '../../public/translations/common/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import error from '../../public/translations/error/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import publicIpRouting from '../../public/translations/publicIpRouting/Messages_fr_FR.json';
import { appName } from '../App.constants';

export const translations = {
  [TRANSLATION_NAMESPACES.common]: common,
  [TRANSLATION_NAMESPACES.dashboard]: dashboard,
  [TRANSLATION_NAMESPACES.publicIpRouting]: publicIpRouting,
  [TRANSLATION_NAMESPACES.error]: error,
  [TRANSLATION_NAMESPACES.onboarding]: onboarding,
};

export const labels = {
  common,
  actions,
  dashboard,
  onboarding,
  publicIpRouting,
  error,
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const initTestI18n = () => coreInitTestI18n(APP_NAME, translations);
