const constants = {
  EU: {
    URLS: {
      CZ: {
        express_order: 'https://www.ovh.cz/order/express/#/express/',
        changeOwner:
          'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.cz/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      DE: {
        express_order: 'https://www.ovh.de/order/express/#/express/',
        changeOwner:
          'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.de/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      ES: {
        express_order: 'https://www.ovh.es/order/express/#/express/',
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
      },
      FR: {
        express_order: 'https://www.ovh.com/fr/order/express/#/express/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.com/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      GB: {
        express_order: 'https://www.ovh.co.uk/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      IT: {
        express_order: 'https://www.ovh.it/order/express/#/express/',
        changeOwner:
          'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.it/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      NL: {
        express_order: 'https://www.ovh.nl/order/express/#/express/',
        changeOwner:
          'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.nl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      PL: {
        express_order: 'https://www.ovh.pl/order/express/#/express/',
        changeOwner:
          'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.pl/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      PT: {
        express_order: 'https://www.ovh.pt/order/express/#/express/',
        changeOwner:
          'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.pt/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      IE: {
        express_order: 'https://www.ovh.ie/order/express/#/express/',
        changeOwner:
          'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.ie/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
    },
  },
  CA: {
    URLS: {
      ASIA: {
        express_order: 'https://ca.ovh.com/asia/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      IN: {
        express_order: 'https://ca.ovh.com/in/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      AU: {
        express_order: 'https://ca.ovh.com/au/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      CA: {
        // eq to en_CA
        express_order: 'https://ca.ovh.com/en/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://ca.ovh.com/en/order/domain/#/legacy/domain/trade/list?options=~~(domain~~'{domain})",
      },
      QC: {
        // eq to fr_CA
        express_order: 'https://ca.ovh.com/fr/order/express/#/express/',
        changeOwner:
          'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.com/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      SG: {
        express_order: 'https://ca.ovh.com/sg/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      WE: {
        express_order: 'https://us.ovh.com/us/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
      WS: {
        // eq to es_US
        express_order: 'https://us.ovh.com/es/order/express/#/express/',
        changeOwner:
          'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.es/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
    },
  },
  US: {
    URLS: {
      US: {
        express_order: 'https://us.ovhcloud.com/order/express/#/express/',
        changeOwner:
          'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
        domainOrderTrade:
          "https://www.ovh.co.uk/order/domain/#/legacy/domain/trade/informations?options=~~(domain~~'{domain})",
      },
    },
  },
};

// Since all languages are availables in both CA and UE worlPart,
// they must have access to all languages conf
/* eslint-disable no-restricted-syntax, vars-on-top, no-var, block-scoped-var,
no-prototype-builtins, no-redeclare */
for (var lang in constants.EU.URLS) {
  if (constants.EU.URLS.hasOwnProperty(lang)) {
    if (!constants.CA.URLS[lang]) {
      constants.CA.URLS[lang] = constants.EU.URLS[lang];
    }
    if (!constants.US.URLS[lang]) {
      constants.US.URLS[lang] = constants.EU.URLS[lang];
    }
  }
}
for (var lang in constants.CA.URLS) {
  if (constants.CA.URLS.hasOwnProperty(lang) && !constants.EU.URLS[lang]) {
    constants.EU.URLS[lang] = constants.CA.URLS[lang];
  }
}
for (var lang in constants.US.URLS) {
  if (constants.US.URLS.hasOwnProperty(lang) && !constants.EU.URLS[lang]) {
    constants.EU.URLS[lang] = constants.US.URLS[lang];
  }
}

export default constants;
