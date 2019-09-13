const CA = {
  supportLevel: 'https://ca.ovh.com/manager/index.html#/useraccount/support/level',
  ticket: 'https://ca.ovh.com/manager/index.html#/ticket',
  support: {
    ASIA: 'https://www.ovh.com/asia/support/',
    AU: 'https://www.ovh.com.au/support/',
    CA: 'https://www.ovh.co.uk/support/',
    QC: 'https://www.ovh.com/fr/support/',
    SG: 'https://www.ovh.com/sg/support/',
    WE: 'https://www.ovh.co.uk/support/',
    WS: 'https://www.ovh.com/fr/support/',
  },
  support_contact: {
    ASIA: 'https://www.ovh.com/asia/support/',
    AU: 'https://www.ovh.com.au/support/',
    CA: 'https://www.ovh.com/ca/en/support/',
    QC: 'https://www.ovh.com/ca/fr/support/',
    SG: 'https://www.ovh.com/sg/support/',
    WE: 'https://www.ovh.com/ca/en/support/',
    WS: 'https://www.ovh.com/ca/en/support/',
  },
  guides: {
    home: {
      ASIA: 'https://docs.ovh.com/ca/en/',
      AU: 'https://docs.ovh.com/ca/en/',
      CA: 'https://docs.ovh.com/ca/en/',
      QC: 'https://docs.ovh.com/ca/fr/',
      SG: 'https://docs.ovh.com/ca/en/',
      WE: 'https://docs.ovh.com/ca/en/',
      WS: 'https://docs.ovh.com/ca/en/',
    },
  },
};

const EU = {
  supportLevel: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/support/level',
  ticket: 'https://www.ovh.com/manager/dedicated/index.html#/ticket',
  support: {
    CZ: 'http://www.ovh.cz/podpora/',
    DE: 'http://www.ovh.de/support/',
    ES: 'http://www.ovh.es/soporte/',
    FI: 'http://www.ovh-hosting.fi/tuki/',
    FR: 'https://www.ovh.com/fr/support/',
    GB: 'http://www.ovh.co.uk/support/',
    IE: 'http://www.ovh.ie/support/',
    IT: 'http://www.ovh.it/supporto/',
    LT: 'http://www.ovh.lt/pagalba/',
    MA: 'https://www.ovh.ma/support/',
    NL: 'http://www.ovh.nl/support/',
    PL: 'https://www.ovh.pl/pomoc/',
    PT: 'https://www.ovh.pt/suporte/',
    SN: 'https://www.ovh.sn/support/',
    TN: 'https://www.ovh.com/tn/support/',
  },
  support_contact: {
    CZ: 'http://www.ovh.cz/podpora/',
    DE: 'http://www.ovh.de/support/',
    ES: 'http://www.ovh.es/soporte/',
    FI: 'http://www.ovh-hosting.fi/tuki/',
    FR: 'https://www.ovh.com/fr/support/nous-contacter/',
    GB: 'http://www.ovh.co.uk/support/',
    IE: 'http://www.ovh.ie/support/',
    IT: 'http://www.ovh.it/supporto/',
    LT: 'http://www.ovh.lt/pagalba/',
    MA: 'https://www.ovh.ma/support/',
    NL: 'http://www.ovh.nl/support/',
    PL: 'https://www.ovh.pl/pomoc/',
    PT: 'https://www.ovh.pt/suporte/',
    SN: 'https://www.ovh.sn/support/',
    TN: 'https://www.ovh.com/tn/support/',
  },
  guides: {
    home: {
      CZ: 'https://docs.ovh.com/cz/cs/',
      DE: 'https://docs.ovh.com/de/',
      ES: 'https://docs.ovh.com/es/',
      FI: 'https://docs.ovh.com/fi/',
      FR: 'https://docs.ovh.com/fr/',
      GB: 'https://docs.ovh.com/gb/en/',
      IE: 'https://docs.ovh.com/ie/en/',
      IT: 'https://docs.ovh.com/it/',
      LT: 'https://docs.ovh.com/lt/',
      MA: 'https://docs.ovh.com/gb/en/',
      NL: 'https://docs.ovh.com/nl/',
      PL: 'https://docs.ovh.com/pl/',
      PT: 'https://docs.ovh.com/pt/',
      SN: 'https://docs.ovh.com/gb/en/',
      TN: 'https://docs.ovh.com/gb/en/',
    },
  },
};

const US = {
  supportLevel: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/support/level',
  ticket: 'https://us.ovhcloud.com/manager/dedicated/index.html#/ticket',
  support: {
    US: 'https://us.ovhcloud.com/support/',
  },
  support_contact: {
    US: 'https://us.ovhcloud.com/support/',
  },
  guides: {
    home: {
      US: 'https://support.us.ovhcloud.com',
    },
  },
};

export const ASSISTANCE_URLS = {
  CA,
  EU,
  US,
};

export const HELP_CENTER_SUBSIDIARIES = [
  'FR',
];

export const CHATBOT_SUBSIDIARIES = [
  'FR',
];

export const AVAILABLE_SUPPORT_LEVEL = ['business', 'enterprise'];

export default {
  AVAILABLE_SUPPORT_LEVEL,
  CHATBOT_SUBSIDIARIES,
  HELP_CENTER_SUBSIDIARIES,
  ASSISTANCE_URLS,
};
