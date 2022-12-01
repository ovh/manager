export const BOOT_MODE = {
  RESCUE: 'RESCUE',
};

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

export const FEATURE_CLOUDDATABASE = 'cloudDatabase';

export const PRODUCT_NAME = 'VPS';

export const RENEW_URL = {
  CA: 'https://ca.ovh.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  US:
    'https://us.ovhcloud.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
};

export const VPS = {
  OPTIONS: {
    AUTOMATED_BACKUP: 'automatedBackup',
  },
  OPTION_STATES: {
    SUBSCRIBED: 'subscribed',
    RELEASED: 'released',
  },
};

export default {
  BOOT_MODE,
  CHANGE_OWNER_URL,
  FEATURE_CLOUDDATABASE,
  PRODUCT_NAME,
  RENEW_URL,
  VPS,
};
