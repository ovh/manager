import i18next, { i18n } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import commonActions from '../../../../../modules/common-translations/public/translations/actions/Messages_fr_FR.json';
import commonDashboard from '../../../../../modules/common-translations/public/translations/dashboard/Messages_fr_FR.json';
import commonForm from '../../../../../modules/common-translations/public/translations/form/Messages_fr_FR.json';
import commonStatus from '../../../../../modules/common-translations/public/translations/status/Messages_fr_FR.json';
import commonError from '../../../../../modules/common-translations/public/translations/error/Messages_fr_FR.json';
import kmsCommon from '../../../public/translations/key-management-service/common/Messages_fr_FR.json';
import create from '../../../public/translations/key-management-service/create/Messages_fr_FR.json';
import dashboard from '../../../public/translations/key-management-service/dashboard/Messages_fr_FR.json';
import error from '../../../public/translations/key-management-service/error/Messages_fr_FR.json';
import guide from '../../../public/translations/key-management-service/guide/Messages_fr_FR.json';
import listing from '../../../public/translations/key-management-service/listing/Messages_fr_FR.json';
import onboarding from '../../../public/translations/key-management-service/onboarding/Messages_fr_FR.json';
import serviceKeys from '../../../public/translations/key-management-service/serviceKeys/Messages_fr_FR.json';
import credentials from '../../../public/translations/key-management-service/credential/Messages_fr_FR.json';
import terminate from '../../../public/translations/key-management-service/terminate/Messages_fr_FR.json';
import secretCommon from '../../../public/translations/secret-manager/common/Messages_fr_FR.json';
import secretOnboarding from '../../../public/translations/secret-manager/onboarding/Messages_fr_FR.json';
import secretDashboard from '../../../public/translations/secret-manager/dashboard/Messages_fr_FR.json';
import secretCreate from '../../../public/translations/secret-manager/create/Messages_fr_FR.json';
import secretDomains from '../../../public/translations/secret-manager/domains/Messages_fr_FR.json';

export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'key-management-service/common', kmsCommon)
    .addResources(defaultLocale, 'key-management-service/create', create)
    .addResources(defaultLocale, 'key-management-service/dashboard', dashboard)
    .addResources(defaultLocale, 'key-management-service/error', error)
    .addResources(defaultLocale, 'key-management-service/guide', guide)
    .addResources(defaultLocale, 'key-management-service/listing', listing)
    .addResources(defaultLocale, 'key-management-service/terminate', terminate)
    .addResources(
      defaultLocale,
      'key-management-service/onboarding',
      onboarding,
    )
    .addResources(
      defaultLocale,
      'key-management-service/serviceKeys',
      serviceKeys,
    )
    .addResources(
      defaultLocale,
      'key-management-service/credential',
      credentials,
    )
    .addResources(defaultLocale, NAMESPACES.ACTIONS, commonActions)
    .addResources(defaultLocale, NAMESPACES.DASHBOARD, commonDashboard)
    .addResources(defaultLocale, NAMESPACES.FORM, commonForm)
    .addResources(defaultLocale, NAMESPACES.STATUS, commonStatus)
    .addResources(defaultLocale, NAMESPACES.ERROR, commonError)
    .addResources(defaultLocale, 'secret-manager/common', secretCommon)
    .addResources(defaultLocale, 'secret-manager/onboarding', secretOnboarding)
    .addResources(defaultLocale, 'secret-manager/dashboard', secretDashboard)
    .addResources(defaultLocale, 'secret-manager/create', secretCreate)
    .addResources(defaultLocale, 'secret-manager/domains', secretDomains)
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
      defaultNS: 'key-management-service',
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

const commonLabels = {
  actions: commonActions,
  dashboard: commonDashboard,
  form: commonForm,
  status: commonStatus,
  error: commonError,
};

const secretManagerLabels = {
  common: secretCommon,
  onboarding: secretOnboarding,
  dashboard: secretDashboard,
  create: secretCreate,
  domains: secretDomains,
};

export const labels = {
  kmsCommon,
  create,
  dashboard,
  error,
  guide,
  listing,
  onboarding,
  serviceKeys,
  credentials,
  terminate,
  common: commonLabels,
  secretManager: secretManagerLabels,
};
