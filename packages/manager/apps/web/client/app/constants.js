export const SANITIZATION = {
  regex: /^\s*(https?|s?ftp|mailto|tel|file|data|ssh):/i,
};

export const HOSTING_ORDER_URL = {
  EU: {
    CA: 'https://www.ovh.com/ca/en/',
    CZ: 'https://www.ovh.cz/webhosting/',
    DE: 'https://www.ovh.de/hosting/',
    EN: 'https://www.ovh.co.uk/web-hosting/',
    ES: 'https://www.ovh.es/hosting/',
    FI: 'https://www.ovh-hosting.fi/webhotelli/',
    FR: 'https://www.ovh.com/fr/hebergement-web/',
    GB: 'https://www.ovh.co.uk/web-hosting/',
    IE: 'https://www.ovh.ie/web-hosting/',
    IT: 'https://www.ovh.it/hosting-web/',
    LT: 'https://www.ovh.lt/svetainiu-talpinimas/',
    MA: 'https://www.ovh.com/ma/hebergement-web/',
    NL: 'https://www.ovh.nl/shared-hosting/',
    PL: 'https://www.ovh.pl/hosting/',
    PT: 'https://www.ovh.pt/alojamento-partilhado/',
    QC: 'https://www.ovh.com/ca/fr/',
    RU: 'https://www.ovh.ie/web-hosting/',
    SN: 'https://www.ovh.sn/hebergement-web/',
    TN: 'https://www.ovh.com/tn/hebergement-web/',
    WE: 'https://www.ovh.com/us/',
  },
  CA: {
    ASIA: 'https://www.ovh.com/asia/web-hosting/',
    IN: 'https://www.ovhcloud.com/en-in/web-hosting/',
    AU: 'https://www.ovh.com.au/web-hosting/',
    CA: 'https://www.ovh.com/ca/en/web-hosting/',
    QC: 'https://www.ovh.com/ca/fr/hebergement-web/',
    SG: 'https://www.ovh.com/sg/web-hosting/',
    WE: 'https://www.ovh.com/world/web-hosting/',
    WS: 'https://www.ovh.com/world/es/hosting/',
  },
};

export const DOMAIN_ORDER_URL = {
  EU: {
    CZ: 'https://www.ovh.ie/order/webcloud/',
    DE: 'https://www.ovh.de/order/webcloud/',
    ES: 'https://www.ovh.es/order/webcloud/',
    FI: 'https://www.ovh.ie/order/webcloud/',
    FR: 'https://www.ovh.com/fr/order/webcloud/',
    GB: 'https://www.ovh.co.uk/order/webcloud',
    IE: 'https://www.ovh.ie/order/webcloud',
    IT: 'https://www.ovh.it/order/webcloud/',
    LT: 'https://www.ovh.lt/order/webcloud/',
    NL: 'https://www.ovh.nl/order/webcloud/',
    PL: 'https://www.ovh.pl/order/webcloud/',
    PT: 'https://www.ovh.pt/order/webcloud/',
    MA: 'https://www.ovh.com/ma/order/webcloud',
    SN: 'https://www.ovh.sn/order/webcloud',
    TN: 'https://www.ovh.com/tn/order/webcloud',
  },
  CA: {
    ASIA: 'https://ca.ovh.com/asia/order/webcloud',
    IN: 'https://ca.ovh.com/in/order/webcloud',
    AU: 'https://ca.ovh.com/au/order/webcloud',
    CA: 'https://ca.ovh.com/en/order/webcloud',
    QC: 'https://ca.ovh.com/fr/order/webcloud',
    SG: 'https://ca.ovh.com/sg/order/webcloud',
    WE: 'https://us.ovh.com/us/order/webcloud',
    WS: 'https://us.ovh.com/es/order/webcloud',
  },
};

export const STATUS_OVHCLOUD_URL =
  'https://web-cloud.status-ovhcloud.com/incidents/bklsmwkj01y8';

export default {
  DOMAIN_ORDER_URL,
  HOSTING_ORDER_URL,
  SANITIZATION,
  STATUS_OVHCLOUD_URL,
};
