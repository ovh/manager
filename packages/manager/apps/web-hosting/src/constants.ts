const SUFFIX_ORDER_URL =
  "/order/domain/#/legacy/domain/hosting/choose?options=~(~(flow~'hosting_existing_service~serviceName~'{serviceName}))&fqdn={domainName}";

export const DOMAIN_ORDER_OPTIONS_SERVICE = {
  CZ: `https://www.ovh.cz${SUFFIX_ORDER_URL}`,
  DE: `https://www.ovh.de${SUFFIX_ORDER_URL}`,
  EN: `https://www.ovh.co.uk${SUFFIX_ORDER_URL}`,
  ES: `https://www.ovh.es${SUFFIX_ORDER_URL}`,
  FI: `https://www.ovh-hosting.fi${SUFFIX_ORDER_URL}`,
  FR: `https://www.ovh.com/fr${SUFFIX_ORDER_URL}`,
  GB: `https://www.ovh.co.uk${SUFFIX_ORDER_URL}`,
  IE: `https://www.ovh.ie${SUFFIX_ORDER_URL}`,
  IT: `https://www.ovh.it${SUFFIX_ORDER_URL}`,
  LT: `https://www.ovh.lt${SUFFIX_ORDER_URL}`,
  MA: `https://www.ovh.com/ma${SUFFIX_ORDER_URL}`,
  NL: `https://www.ovh.nl${SUFFIX_ORDER_URL}`,
  PL: `https://www.ovh.pl${SUFFIX_ORDER_URL}`,
  PT: `https://www.ovh.pt${SUFFIX_ORDER_URL}`,
  RU: `https://www.ovh.ie${SUFFIX_ORDER_URL}`,
  SN: `https://www.ovh.sn${SUFFIX_ORDER_URL}`,
  TN: `https://www.ovh.com${SUFFIX_ORDER_URL}`,
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
  },
};

export enum REGION {
  EU = 'EU',
  CA = 'CA',
}

export enum ACTIONS {
  ORDER = 'ORDER',
  ATTACH = 'ATTACH',
}
