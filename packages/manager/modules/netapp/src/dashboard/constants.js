export const MINIMUM_VOLUME_SIZE = 100;
export const SERVICE_TYPE = 'NETAPP';

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch1]',
  format: '[link]',
  generalPlacement: '[netapp]',
  detailedPlacement: '[commitment]',
};

export const COMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[commit]',
};

export const RECOMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[recommit]',
};

export const NETWORK_STATUS = {
  TO_CONFIGURE: 'to_configure',
  ASSOCIATING: 'associating',
  ASSOCIATED: 'associated',
  DISSOCIATING: 'dissociating',
};

export const VRACK_SERVICES_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  DISABLED: 'DISABLED',
};

export const POLLING_TYPE = {
  ASSOCIATING: 'associating',
  DISSOCIATING: 'dissociating',
};

export const FETCH_INTERVAL = 5000;

export const VRACK_ORDER_URLS = {
  CZ:
    "https://www.ovh.cz/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  DE:
    "https://www.ovh.de/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  ES:
    "https://www.ovh.es/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  FI:
    "https://www.ovh-hosting.fi/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  FR:
    "https://www.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  GB:
    "https://www.ovh.co.uk/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  IE:
    "https://www.ovh.ie/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  IT:
    "https://www.ovh.it/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  LT:
    "https://www.ovh.lt/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  MA:
    "https://www.ovh.ma/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  NL:
    "https://www.ovh.nl/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  PL:
    "https://www.ovh.pl/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  PT:
    "https://www.ovh.pt/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  SN:
    "https://www.ovh.sn/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  TN:
    "https://www.ovh.com/tn/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  US:
    "https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  ASIA:
    "https://ca.ovh.com/asia/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  IN:
    "https://ca.ovh.com/in/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  AU:
    "https://ca.ovh.com/au/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  CA:
    "https://ca.ovh.com/en/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  QC:
    "https://ca.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  SG:
    "https://ca.ovh.com/sg/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  WE:
    "https://us.ovh.com/us/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  WS:
    "https://us.ovh.com/es/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
  DEFAULT:
    "https://www.ovh.ie/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
};

export const LABELS = {
  VRACK: 'vRack',
  VRACK_SERVICE: 'vRack Services',
};

export default {
  MINIMUM_VOLUME_SIZE,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  NETWORK_STATUS,
  FETCH_INTERVAL,
  POLLING_TYPE,
  VRACK_SERVICES_STATUS,
  VRACK_ORDER_URLS,
  LABELS,
};
