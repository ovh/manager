import { Node } from '../node';

const sunriseUniverse: Node = {
  id: 'sunrise',
  translation: 'sidebar_sunrise',
  shortTranslation: 'sidebar_sunrise_short',
  routing: {
    application: 'sunrise',
  },
  count: false,
  features: ['sunrise'],
};

sunriseUniverse.children = [
  {
    id: 'horizon-view',
    universe: sunriseUniverse.id,
    translation: 'sidebar_sunrise_infra',
    routing: {
      application: 'sunrise',
      hash: '#/horizon-view',
    },
  },
  {
    id: 'telephony',
    universe: sunriseUniverse.id,
    translation: 'sidebar_sunrise_contact_center',
    routing: {
      application: 'sunrise',
      hash: '#/telephony',
    },
  },
  {
    id: 'csp2',
    universe: sunriseUniverse.id,
    translation: 'sidebar_sunrise_office',
    routing: {
      application: 'sunrise',
      hash: '#/csp2',
    },
  },
  {
    id: 'sslGateway',
    universe: sunriseUniverse.id,
    translation: 'sidebar_sunrise_ssl_gateway',
    routing: {
      application: 'sunrise',
      hash: '#/sslGateway',
    },
  },
];

export default sunriseUniverse;
