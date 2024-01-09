/* eslint-disable import/no-extraneous-dependencies */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from '../../src/public/translations/vrack-services/Messages_fr_FR.json';
import onboarding from '../../src/public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import create from '../../src/public/translations/vrack-services/create/Messages_fr_FR.json';
import dashboard from '../../src/public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import subnets from '../../src/public/translations/vrack-services/subnets/Messages_fr_FR.json';
import endpoints from '../../src/public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import error from '../../src/public/translations/vrack-services/error/Messages_fr_FR.json';
import listing from '../../src/public/translations/vrack-services/listing/Messages_fr_FR.json';

export const labels = {
  common,
  onboarding,
  create,
  dashboard,
  subnets,
  endpoints,
  error,
  listing,
};

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  ns: [
    'vrack-services',
    'vrack-services/onboarding',
    'vrack-services/create',
    'vrack-services/dashboard',
    'vrack-services/subnets',
    'vrack-services/endpoints',
    'vrack-services/error',
    'vrack-services/listing',
  ],
  defaultNS: 'vrack-services',
  resources: {
    fr: {
      'vrack-services': common,
      'vrack-services/onboarding': onboarding,
      'vrack-services/create': create,
      'vrack-services/dashboard': dashboard,
      'vrack-services/subnets': subnets,
      'vrack-services/endpoints': endpoints,
      'vrack-services/error': error,
      'vrack-services/listing': listing,
    },
  },
});

export default i18n;
