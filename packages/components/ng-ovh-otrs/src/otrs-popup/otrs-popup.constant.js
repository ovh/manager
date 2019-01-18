export const ASSISTANCE_ENUM = {
  USAGE: 'usage',
  START: 'start',
  NEW: 'new',
  OTHER: 'other',
};
export const BILLING_ENUM = {
  INPROGRESS: 'inProgress',
  NEW: 'new',
  BILL: 'bill',
  AUTORENEW: 'autorenew',
  OTHER: 'other',
};
export const INCIDENT_ENUM = {
  PERFS: 'perfs',
  ALERTS: 'alerts',
  DOWN: 'down',
};
export const INTERVENTION_ENUM = {
  REPLACEMENTDISK: 'replacement-disk',
  OTHER: 'other',
};
export const CATEGORIES = {
  ASSISTANCE: 'assistance',
  BILLING: 'billing',
  INCIDENT: 'incident',
  INTERVENTION: 'intervention',
  SALES: 'sales',
};
export const SERVICES = {
  DOMAIN: 'DOMAIN',
  HOSTING: 'HOSTING',
  EMAIL: 'EMAIL_DOMAIN',
  ZONE: 'ZONE',
  SQL: 'PRIVATE_DATABASE',
  EXCHANGE: 'EXCHANGE',
  OFFICE_365: 'OFFICE_365',
  VPS: 'VPS',
  LOAD_BALANCER: 'LOAD_BALANCER',
  FAILOVER: 'FAILOVER',
  CLOUD: 'CLOUD',
  CDN: 'CDN_WEBSTORAGE',
  DEDICATED: 'DEDICATED',
  CDN_DEDICATED: 'CDN_DEDICATED',
};
export const UNIVERSES = {
  EU: ['CLOUD_DEDICATED', 'SUNRISE', 'TELECOM', 'WEB'],
  CA: ['CLOUD_DEDICATED', 'SUNRISE'],
  US: ['CLOUD_DEDICATED'],
};

export default {
  ASSISTANCE_ENUM,
  BILLING_ENUM,
  INCIDENT_ENUM,
  INTERVENTION_ENUM,
  CATEGORIES,
  SERVICES,
  UNIVERSES,
};
