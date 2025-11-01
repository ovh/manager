import i18next, { i18n } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import commonActions from '../../../../../modules/common-translations/public/translations/actions/Messages_fr_FR.json';
import commonDashboard from '../../../../../modules/common-translations/public/translations/dashboard/Messages_fr_FR.json';
import commonForm from '../../../../../modules/common-translations/public/translations/form/Messages_fr_FR.json';
import commonStatus from '../../../../../modules/common-translations/public/translations/status/Messages_fr_FR.json';
import commonError from '../../../../../modules/common-translations/public/translations/error/Messages_fr_FR.json';
import commonRegion from '../../../../../modules/common-translations/public/translations/region/Messages_fr_FR.json';
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
import secretManager from '../../../public/translations/secret-manager/Messages_fr_FR.json';

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
    .addResources(defaultLocale, NAMESPACES.REGION, commonRegion)
    .addResources(defaultLocale, 'secret-manager', secretManager)
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
  region: commonRegion,
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
  secretManager,
};
