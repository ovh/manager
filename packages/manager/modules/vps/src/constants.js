export const CHANGE_OWNER_URL = {
  EU: {
    CZ: 'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
    DE: 'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
    ES: 'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
    FI: 'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
    FR: 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
    GB: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
    IE: 'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
    IT: 'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
    LT: 'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
    MA: 'https://www.ovh.ma/cgi-bin/procedure/procedureChangeOwner.cgi',
    NL: 'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PL: 'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PT: 'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
    SN: 'https://www.ovh.sn/cgi-bin/procedure/procedureChangeOwner.cgi',
    TN: 'https://www.ovh.com/tn/cgi-bin/procedure/procedureChangeOwner.cgi',
  },
};

export const CONTACTS_URL = {
  EU: '#/useraccount/contacts?tab=SERVICES&serviceName={serviceName}',
  CA: null, // not yet available to CA users
  US: null, // not yet available to US users
};

export const FEATURE_CLOUDDATABASE = 'cloudDatabase';

export const IP_URL = {
  EU: '#/configuration/ip?landingTo=ip&serviceName={serviceName}',
  CA: '#/configuration/ip?landingTo=ip&serviceName={serviceName}',
  US: '#/configuration/ip?landingTo=ip&serviceName={serviceName}',
};

export const ORDER_EXPRESS_BASE_URL = {
  EU: {
    CZ: 'https://www.ovh.cz/order/express/#/new/express/resume',
    DE: 'https://www.ovh.de/order/express/#/new/express/resume',
    ES: 'https://www.ovh.es/order/express/#/new/express/resume',
    FI: 'https://www.ovh-hosting.fi/order/express/#/new/express/resume',
    FR: 'https://www.ovh.com/fr/order/express/#/new/express/resume',
    GB: 'https://www.ovh.co.uk/order/express/#/new/express/resume',
    IE: 'https://www.ovh.ie/order/express/#/new/express/resume',
    IT: 'https://www.ovh.it/order/express/#/new/express/resume',
    LT: 'https://www.ovh.lt/order/express/#/new/express/resume',
    MA: 'https://www.ovh.ma/order/express/#/new/express/resume',
    NL: 'https://www.ovh.nl/order/express/#/new/express/resume',
    PL: 'https://www.ovh.pl/order/express/#/new/express/resume',
    PT: 'https://www.ovh.pt/order/express/#/new/express/resume',
    SN: 'https://www.ovh.sn/order/express/#/new/express/resume',
    TN: 'https://www.ovh.com/tn/order/express/#/new/express/resume',
  },
  CA: {
    ASIA: 'https://ca.ovh.com/asia/order/express/#/new/express/resume',
    AU: 'https://ca.ovh.com/au/order/express/#/new/express/resume',
    CA: 'https://ca.ovh.com/en/order/express/#/new/express/resume',
    QC: 'https://ca.ovh.com/fr/order/express/#/new/express/resume',
    SG: 'https://ca.ovh.com/sg/order/express/#/new/express/resume',
    WE: 'https://us.ovh.com/us/order/express/#/new/express/resume',
    WS: 'https://us.ovh.com/es/order/express/#/new/express/resume',
  },
  US: {
    US: 'https://us.ovhcloud.com/order/express/#/express/review',
  },
};

export const PRIVATE_DATABASE_URL = {
  EU:
    'https://www.ovh.com/manager/web/#/configuration/private_database/{serviceName}',
};

export const PRODUCT_NAME = 'VPS';

export const RENEW_URL = {
  EU: '#/billing/autoRenew?selectedType={serviceType}&searchText={serviceName}',
  CA: 'https://ca.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  US:
    'https://us.ovhcloud.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
};

export default {
  CHANGE_OWNER_URL,
  CONTACTS_URL,
  FEATURE_CLOUDDATABASE,
  IP_URL,
  ORDER_EXPRESS_BASE_URL,
  PRIVATE_DATABASE_URL,
  PRODUCT_NAME,
  RENEW_URL,
};
