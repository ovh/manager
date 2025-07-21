export const ALIGNMENT_URLS = {
  ASIA: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  AU: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  CA: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  CZ: 'https://www.ovh.cz/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  DE: 'https://www.ovh.de/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  ES: 'https://www.ovh.es/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  FI: 'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  FR: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?alignDate=1',
  GB: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  IE: 'https://www.ovh.ie/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  IT: 'https://www.ovh.it/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  LT: 'https://www.ovh.lt/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  NL: 'https://www.ovh.nl/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  PL: 'https://www.ovh.pl/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  PT: 'https://www.ovh.pt/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  QC: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?alignDate=1',
  SG: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  US: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  WE: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  WS: 'https://www.ovh.es/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
  IN: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?alignDate=1&csid=0',
};

export const AUTORENEW_EVENT = 'billing.autorenew.changed';

export const COLUMNS_CONFIG = [
  {
    property: 'serviceId',
  },
  {
    property: 'serviceType',
  },
  {
    property: 'status',
  },
  {
    property: 'renewPeriod',
  },
  {
    property: 'expiration',
  },
];

export const CONTRACTS_IDS = {
  CA: 1752,
  QC: 1753,
  WE: 1754,
  WS: 1755,
};

export const MIN_DOMAIN_LENGTH = 50;

export const NIC_ALL = 'billing_autorenew_nic_all';

export const SERVICE_EXPIRATION = {
  EXPIRES_IN_A_WEEK: 'weeks',
  EXPIRES_IN_A_MONTH: 'months',
  RENEWED_IN_AMONTH: 'renew_month',
};

export const SERVICE_STATES = {
  UP: 'UP',
  EXPIRED: 'EXPIRED',
};

export const SERVICE_STATUS = {
  AUTOMATIC: 'auto',
  MANUAL: 'manual',
  PENDING_DEBT: 'pending_debt',
  PENDING_RESILIATION: 'delete_at_expiration',
  RESILIATED: 'expired',
};

export const URL_PARAMETER_SEPARATOR = '%20';

export const SERVICE_RENEW_MODES = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
};

export const SERVICE_TYPES = {
  ZIMBRA_SLOT: 'ZIMBRA_SLOT',
};

// This list represent what service types uses apiv6 `/services` routes to
// handle retrieving informations about the service and updating it
export const SERVICE_TYPES_USING_V6_SERVICES = [SERVICE_TYPES.ZIMBRA_SLOT];

const TRACKING_CHAPTER_1 = 'Hub';
const TRACKING_CHAPTER_2 = 'billing';
const TRACKING_CHAPTER_3 = 'services';

const TRACKING_PAGE_SUFFIX = 'services::listing::autorenew';
export const TRACKING_PAGE_CATEGORY = 'listing';
export const TRACKING_PAGE = `${TRACKING_CHAPTER_1}::${TRACKING_CHAPTER_2}::${TRACKING_CHAPTER_3}::${TRACKING_PAGE_SUFFIX}`;
export const TRACKING_FILTER_NAME_PREFIX =
  'Hub::billing::services::listing::button::filter_services';

export const TRACKING_AUTORENEW_PAGE_NAME = `Hub::billing::services::services::listing::autorenew`;
export const TRACKING_SSH_PAGE_NAME = `${TRACKING_AUTORENEW_PAGE_NAME}::ssh`;
export const TRACKING_AGREEMENTS_PAGE_NAME = `${TRACKING_AUTORENEW_PAGE_NAME}::agreements`;

export const TRACKING_ACTIONS_PREFIX = `${TRACKING_CHAPTER_1}::${TRACKING_CHAPTER_2}::${TRACKING_CHAPTER_3}::${TRACKING_PAGE_CATEGORY}`;

export default {
  AUTORENEW_EVENT,
  CONTRACTS_IDS,
  MIN_DOMAIN_LENGTH,
  NIC_ALL,
  SERVICE_EXPIRATION,
  SERVICE_STATES,
  SERVICE_STATUS,
  URL_PARAMETER_SEPARATOR,
};
