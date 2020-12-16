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
    tasks: 'http://travaux.ovh.net/',
  },
  CA: {
    guides: {
      home: {
        ASIA: `${guidesRoot}/ca/en/`,
        AU: `${guidesRoot}/ca/en/`,
        CA: `${guidesRoot}/ca/en/`,
        QC: `${guidesRoot}/ca/fr/`,
        SG: `${guidesRoot}/ca/en/`,
        WE: `${guidesRoot}/ca/en/`,
        WS: `${guidesRoot}/ca/en/`,
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
    },
    tasks: 'http://travaux.ovh.net/',
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
  },
};
