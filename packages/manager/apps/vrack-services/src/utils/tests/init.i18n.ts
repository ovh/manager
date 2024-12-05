import i18next, { i18n } from 'i18next';
import common from '../../../public/translations/vrack-services/Messages_fr_FR.json';
import create from '../../../public/translations/vrack-services/create/Messages_fr_FR.json';
import dashboard from '../../../public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import error from '../../../public/translations/vrack-services/error/Messages_fr_FR.json';
import associate from '../../../public/translations/vrack-services/associate/Messages_fr_FR.json';
import listing from '../../../public/translations/vrack-services/listing/Messages_fr_FR.json';
import dissociate from '../../../public/translations/vrack-services/dissociate/Messages_fr_FR.json';
import onboarding from '../../../public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import createVrack from '../../../public/translations/vrack-services/create-vrack/Messages_fr_FR.json';
import endpoints from '../../../public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import subnets from '../../../public/translations/vrack-services/subnets/Messages_fr_FR.json';


export const defaultLocale = 'fr_FR';
export const defaultAvailableLocales = [defaultLocale];

function addTranslations() {
  i18next
    .addResources(defaultLocale, 'vrack-services/common', common)
    .addResources(defaultLocale, 'vrack-services/create', create)
    .addResources(defaultLocale, 'vrack-services/dashboard', dashboard)
    .addResources(defaultLocale, 'vrack-services/error', error)
    .addResources(defaultLocale, 'vrack-services/associate', associate)
    .addResources(defaultLocale, 'vrack-services/listing', listing)
    .addResources(defaultLocale, 'vrack-services/dissociate', dissociate)
    .addResources(
      defaultLocale,
      'vrack-services/onboarding',
      onboarding,
    )
    .addResources(
      defaultLocale,
      'vrack-services/createVrack',
      createVrack,
    )
    .addResources(
      defaultLocale,
      'vrack-services/endpoints',
      endpoints,
    )
    .addResources(
      defaultLocale,
      'vrack-services/subnets',
      subnets,
    )
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
      defaultNS: 'vrack-services',
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
  create,
  dashboard,
  error,
  associate,
  listing,
  onboarding,
  dissociate,
  createVrack,
  endpoints,
  subnets
};
