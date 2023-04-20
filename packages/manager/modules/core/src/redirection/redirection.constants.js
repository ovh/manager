const guidesRoot = 'https://docs.ovh.com';
const helpRoot = 'https://help.ovhcloud.com';

export default {
  EU: {
    guides: {
      home: {
        CZ: `${guidesRoot}/cz/cs/`,
        DE: `${guidesRoot}/de/`,
        ES: `${guidesRoot}/es/`,
        FI: `${guidesRoot}/fi/`,
        FR: `${guidesRoot}/fr/`,
        GB: `${guidesRoot}/gb/en/`,
        IE: `${guidesRoot}/ie/en/`,
        IT: `${guidesRoot}/it/`,
        LT: `${guidesRoot}/lt/`,
        MA: `${guidesRoot}/gb/en/`,
        NL: `${guidesRoot}/nl/`,
        PL: `${guidesRoot}/pl/`,
        PT: `${guidesRoot}/pt/`,
        SN: `${guidesRoot}/gb/en/`,
        TN: `${guidesRoot}/gb/en/`,
      },
    },
    help: {
      DE: `${helpRoot}/de`,
      ES: `${helpRoot}/es-es`,
      FR: `${helpRoot}/fr`,
      GB: `${helpRoot}/en-gb`,
      IE: `${helpRoot}/en-ie`,
      IT: `${helpRoot}/it`,
      MA: `${helpRoot}/fr-ma`,
      NL: `${helpRoot}/nl`,
      PL: `${helpRoot}/pl`,
      PT: `${helpRoot}/pt`,
      SN: `${helpRoot}/fr-sn`,
      TN: `${helpRoot}/fr-tn`,
    },
    tasks: 'https://www.status-ovhcloud.com/',
    expressOrder: {
      DE: 'https://www.ovh.de/order/express/#/express/review',
      EN: 'https://www.ovh.co.uk/order/express/#/express/review',
      ES: 'https://www.ovh.es/order/express/#/express/review',
      FR: 'https://www.ovh.com/fr/order/express/#/express/review',
      GB: 'https://www.ovh.co.uk/order/express/#/express/review',
      IE: 'https://www.ovh.ie/order/express/#/express/review',
      IT: 'https://www.ovh.it/order/express/#/express/review',
      MA: 'https://www.ovh.com/ma/order/express/#/express/review',
      NL: 'https://www.ovh.nl/order/express/#/express/review',
      PL: 'https://www.ovh.pl/order/express/#/express/review',
      PT: 'https://www.ovh.pt/order/express/#/express/review',
      SN: 'https://www.ovh.sn/order/express/#/express/review',
      TN: 'https://www.ovh.com/tn/order/express/#/express/review',
      DEFAULT: 'https://www.ovh.ie/order/express/#/express/review',
    },
  },
  CA: {
    guides: {
      home: {
        ASIA: `${guidesRoot}/asia/en/`,
        AU: `${guidesRoot}/au/en/`,
        CA: `${guidesRoot}/ca/en/`,
        QC: `${guidesRoot}/ca/fr/`,
        SG: `${guidesRoot}/sg/en/`,
        WE: `${guidesRoot}/us/en/`,
        WS: `${guidesRoot}/us/es/`,
      },
    },
    help: {
      ASIA: `${helpRoot}/asia`,
      AU: `${helpRoot}/en-au`,
      CA: `${helpRoot}/en-ca`,
      QC: `${helpRoot}/fr-ca`,
      SG: `${helpRoot}/en-sg`,
      WE: `${helpRoot}/en`,
      WS: `${helpRoot}/es`,
      IN: `${helpRoot}/asia`,
    },
    tasks: 'https://www.status-ovhcloud.com/',
    expressOrder: {
      ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review',
      AU: 'https://ca.ovh.com/au/order/express/#/express/review',
      CA: 'https://ca.ovh.com/en/order/express/#/express/review',
      QC: 'https://ca.ovh.com/fr/order/express/#/express/review',
      SG: 'https://ca.ovh.com/sg/order/express/#/express/review',
      WE: 'https://us.ovh.com/us/order/express/#/express/review',
      WS: 'https://us.ovh.com/es/order/express/#/express/review',
      IN: 'https://ca.ovh.com/asia/order/express/#/express/review',
      DEFAULT: 'https://us.ovh.com/us/order/express/#/express/review',
    },
  },
  US: {
    guides: {
      home: {
        US: 'https://support.us.ovhcloud.com',
      },
    },
    help: {
      US: 'https://us.ovhcloud.com/support',
    },
    tasks: '',
    expressOrder: 'https://us.ovhcloud.com/order/express/#/express/review',
  },
};
