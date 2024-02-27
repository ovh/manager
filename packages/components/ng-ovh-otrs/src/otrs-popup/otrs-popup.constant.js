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

// @todo : expose an API
export const API_EXCLUDED = {
  ALL: [
    '/abuse',
    '/analytics',
    '/auth',
    '/connectivity',
    '/contact',
    '/coworking',
    '/dedicated/installationTemplate',
    '/distribution/image',
    '/email/redirection',
    '/freefax',
    '/me',
    '/msServices',
    '/newAccount',
    '/order',
    '/pack/siptrunk',
    '/partner',
    '/partners',
    '/price',
    '/search',
    '/secret',
    '/service',
    '/services',
    '/session',
    '/status',
    '/store',
    '/supply/mondialRelay',
    '/support',
    '/telephony',
    '/vip',
    '/vpn',
  ],
  CA: [],
  EU: [],
  US: [
    '/dbaas/logs',
    '/dbaas/queue',
    '/dbaas/timeseries',
    '/metrics',
    '/dedicated/ceph',
    '/dedicated/housing',
    '/dedicated/nasha',
    '/ip/loadbalancing',
    '/license/office',
    '/license/virtuozzo',
  ],
};

export const API_ALIASES = {
  '/cloud': '/cloud/project',
};
export const API_EXTRAS_ENDPOINTS = [
  {
    region: ['EU'],
    path: '/domain/zone',
  },
  {
    path: '/ip/service',
  },
  {
    region: ['EU'],
    path: '/msServices/sharepoint',
  },
  {
    region: ['EU'],
    path: '/telephony/*/fax',
  },
  {
    region: ['EU'],
    path: '/telephony/*/line',
  },
  {
    region: ['EU'],
    path: '/telephony/*/number',
  },
];
export const US_TERMS_LINKS = {
  terms: 'https://us.ovhcloud.com/legal/terms-of-service',
  privacy_policy: 'https://us.ovhcloud.com/legal/privacy-policy',
};

export default {
  API_EXCLUDED,
  API_EXTRAS_ENDPOINTS,
  ASSISTANCE_ENUM,
  BILLING_ENUM,
  INCIDENT_ENUM,
  INTERVENTION_ENUM,
  CATEGORIES,
  SERVICES,
  UNIVERSES,
  API_ALIASES,
  US_TERMS_LINKS,
};
