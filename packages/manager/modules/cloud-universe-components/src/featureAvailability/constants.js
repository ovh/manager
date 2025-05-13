const ALL_EUROPEAN_SUBSIDIARIES = [
  'CZ',
  'DE',
  'ES',
  'FI',
  'FR',
  'GB',
  'IE',
  'IT',
  'LT',
  'MA',
  'NL',
  'PL',
  'PT',
  'SN',
  'TN',
];
const ALL_CANADIAN_SUBSIDIARIES = [
  'ASIA',
  'AU',
  'CA',
  'QC',
  'SG',
  'WE',
  'WS',
  'IN',
];

export const FEATURE_AVAILABILITY = {
  VPS: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    guides: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    cloudDatabase: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: [],
    },
  },
  SERVER: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
  },
  PROJECT: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
    expressOrder: {
      US: ['US'],
    },
    guides: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
  },
  KUBE: {
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
    },
  },
  DEDICATED_CLOUD: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
  },
  IP: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
  },
  LOAD_BALANCER: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
    },
  },
  VRACK: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
  },
  LICENSE: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
      US: ['US'],
    },
  },
  NASHA: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
  },
  METRICS: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ['FR'],
    },
  },
  CEPH: {
    sidebarMenu: {
      EU: ['FR'],
      US: ['US'],
    },
    sidebarOrder: {
      EU: ['FR'],
    },
  },
  VEEAM: {
    sidebarMenu: {
      EU: ['FR'],
    },
    sidebarOrder: {
      EU: ['FR'],
    },
  },
  VEEAM_ENTERPRISE: {
    sidebarMenu: {
      EU: ['DE', 'ES', 'FR', 'GB', 'IT', 'NL', 'PL', 'PT'],
      CA: ['CA', 'QC'],
    },
    sidebarOrder: {
      EU: ['DE', 'ES', 'FR', 'GB', 'IT', 'NL', 'PL', 'PT'],
      CA: ['CA', 'QC'],
    },
  },
  CLOUD_DESKTOP: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ALL_CANADIAN_SUBSIDIARIES,
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
    },
  },
  CONTACTS: {
    manage: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
    },
  },
  DBAAS_LOGS: {
    sidebarMenu: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ['CA', 'QC'],
    },
    sidebarOrder: {
      EU: ALL_EUROPEAN_SUBSIDIARIES,
      CA: ['CA', 'QC'],
    },
  },
};

export default {
  FEATURE_AVAILABILITY,
};
