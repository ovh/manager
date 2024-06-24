export const CONFIGURATION_TYPES = {
  EXTERNAL: 'EXTERNAL',
  MIXED: 'MIXED',
  EMPTY: 'EMPTY',
  /** hosting, anycast, hold, parking, dedicated */
  INTERNAL: 'INTERNAL',
};

export const COMPONENTS_PATH_PREFIX = 'domain/dns-modify/components/';

export const STATUS = {
  // DNSSEC status
  ENABLED: 'ENABLED',
  // APIv2 statuses
  ERROR: 'ERROR',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
};

export const ERRORS = {
  NOT_FOUND: 'Client::NotFound',
  UNKNOWN_ERROR_MESSAGE: 'Unknown error',
};

export const OPERATIONS = {
  DOMAIN_DNS_UPDATE: 'DomainDnsUpdate',
};
