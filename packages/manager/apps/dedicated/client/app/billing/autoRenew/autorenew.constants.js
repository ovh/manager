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
};

export const AUTORENEW_EVENT = 'billing.autorenew.changed';

export const COLUMNS_CONFIG = [{
  property: 'serviceId',
},
{
  property: 'serviceType',
},
{
  property: 'state',
},
{
  property: 'status',
},
{
  property: 'expiration',
}];

export const CONTRACTS_IDS = {
  CA: 1752,
  QC: 1753,
  WE: 1754,
  WS: 1755,
};

export const MIN_DOMAIN_LENGTH = 50;

export const NIC_ALL = 'billing_autorenew_nic_all';

export const RENEW_URL = {
  default: '/cgi-bin/order/renew.cgi?domainChooser=',
  CA: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  CZ: 'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser=',
  DE: 'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser=',
  EN: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser=',
  ES: 'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser=',
  FI: 'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser=',
  FR: 'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  GB: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser=',
  IE: 'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser=',
  IT: 'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser=',
  LT: 'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser=',
  MA: 'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser=',
  NL: 'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser=',
  PL: 'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser=',
  PT: 'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser=',
  QC: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
  RU: 'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser=',
  SN: 'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser=',
  TN: 'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser=',
  WE: 'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser=',
};

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

export default {
  AUTORENEW_EVENT,
  CONTRACTS_IDS,
  MIN_DOMAIN_LENGTH,
  NIC_ALL,
  RENEW_URL,
  SERVICE_EXPIRATION,
  SERVICE_STATES,
  SERVICE_STATUS,
  URL_PARAMETER_SEPARATOR,
};
