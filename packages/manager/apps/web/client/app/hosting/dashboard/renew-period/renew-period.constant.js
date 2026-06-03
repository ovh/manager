export const BILLING_RENEW_URLS = {
  CA:
    'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  CZ: 'https://www.ovh.cz/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  DE: 'https://www.ovh.de/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  EN:
    'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  ES: 'https://www.ovh.es/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  FI:
    'https://www.ovh-hosting.fi/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  FR:
    'https://eu.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  GB:
    'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  IE: 'https://www.ovh.ie/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  IT: 'https://www.ovh.it/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  LT: 'https://www.ovh.lt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  MA:
    'https://www.ovh.com/ma/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  NL: 'https://www.ovh.nl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  PL: 'https://www.ovh.pl/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  PT: 'https://www.ovh.pt/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  QC:
    'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  RU:
    'https://www.ovh.co.uk/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  SN: 'https://www.ovh.sn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  TN:
    'https://www.ovh.com/tn/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  WE:
    'https://ca.ovh.com/fr/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
};

// Fallback subsidiary used when the customer's subsidiary has no dedicated URL.
export const DEFAULT_BILLING_RENEW_SUBSIDIARY = 'FR';

export default {
  BILLING_RENEW_URLS,
  DEFAULT_BILLING_RENEW_SUBSIDIARY,
};
