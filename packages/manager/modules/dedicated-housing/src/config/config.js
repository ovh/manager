const constantsConfig = {
  EU: {
    URLS: {
      CZ: {
        changeOwner:
          'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      DE: {
        changeOwner:
          'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      ES: {
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      FI: {
        changeOwner:
          'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
      },
      FR: {
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
      },
      GB: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      IT: {
        changeOwner:
          'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      LT: {
        changeOwner:
          'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
      },
      NL: {
        changeOwner:
          'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      PL: {
        changeOwner:
          'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      PT: {
        changeOwner:
          'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      IE: {
        changeOwner:
          'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
    },
  },
  CA: {
    URLS: {
      ASIA: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      AU: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      CA: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      QC: {
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
      },
      SG: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      WE: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      WS: {
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
    },
  },
  US: {
    URLS: {
      US: {
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
    },
  },
};

/* in urls, all keys represents the two first letter of the language list in uppercase, except GB */
constantsConfig.EU.URLS.EN = constantsConfig.EU.URLS.GB;

export const getConstants = (region) => {
  return constantsConfig[region];
};

export default {
  getConstants,
};
