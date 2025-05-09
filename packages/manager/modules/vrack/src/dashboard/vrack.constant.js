export const VRACK_URLS = {
  changeOwner: {
    CZ: 'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
    DE: 'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
    ES: 'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
    FI: 'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
    FR: 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
    GB: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
    IE: 'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
    IT: 'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
    LT: 'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
    MA: 'https://www.ovh.ma/cgi-bin/procedure/procedureChangeOwner.cgi',
    NL: 'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PL: 'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PT: 'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
    SN: 'https://www.ovh.sn/cgi-bin/procedure/procedureChangeOwner.cgi',
    TN: 'https://www.ovh.com/tn/cgi-bin/procedure/procedureChangeOwner.cgi',
  },
  guides: {
    vrack: {
      FR: {
        roadmap:
          'https://www.ovh.com/fr/g2148.public_cloud_et_vrack_-_explications_et_roadmap',
      },
    },
  },
};

export const FEATURE_NAMES = {
  cloudProject: 'public-cloud',
  dedicatedCloud: 'dedicated-cloud',
  dedicatedCloudDatacenter: 'dedicated-cloud',
  dedicatedServer: 'dedicated-server',
  dedicatedServerInterface: 'dedicated-server',
  ip: 'ip',
  ipLoadbalancing: 'ip-load-balancer',
  legacyVrack: 'vrack',
  managedBareMetal: 'managed-bare-metal',
  managedBareMetalDatacenter: 'managed-bare-metal',
  ovhCloudConnect: 'cloud-connect',
  vrackServices: 'vrack-services',
  legacyVrackDelete: 'vrack:delete',
};

export const POLLING_INTERVAL = 3000;
export const ELIGIBLE_POLLING_INTERVAL = 3000;

export const STATUS = {
  ok: 'ok',
  delivered: 'delivered',
};

export const SLAAC_VALUES = {
  enabled: true,
  disabled: false,
};

export const VRACK_DASHBOARD_TRACKING_PREFIX = 'vrack::dashboard';
export const VRACK_ACTIONS_SUFFIX = 'action';

// SERVICES TO WORK WITH (others are excluded)
export const TYPE_SERVICE = {
  cloudProject: 'cloudProject',
  dedicatedCloud: 'dedicatedCloud',
  dedicatedServer: 'dedicatedServer',
  dedicatedServerInterface: 'dedicatedServerInterface',
  ipLoadbalancing: 'ipLoadbalancing',
  ip: 'ip',
  legacyVrack: 'legacyVrack',
  ipv6: 'ipv6',
  ovhCloudConnect: 'ovhCloudConnect',
  vrackServices: 'vrackServices',
};

// ALL ELIGIBLE SERVICES FOR VRACK
export const SERVICES = [
  'cloudProject',
  'dedicatedCloud',
  'dedicatedServer',
  'dedicatedServerInterface',
  'ipLoadbalancing',
  'ip',
  'legacyVrack',
  'ipv6',
  'ovhCloudConnect',
  'vrackServices',
];

export const API_STATUS = {
  pending: 'pending',
  done: 'done',
};

export const DEDICATED_CLOUD_PRODUCT = {
  epcc: 'EPCC',
  mbm: 'MBM',
};

export const SUSPENDED = 'suspended';

export default {
  API_STATUS,
  DEDICATED_CLOUD_PRODUCT,
  FEATURE_NAMES,
  POLLING_INTERVAL,
  SERVICES,
  STATUS,
  TYPE_SERVICE,
  VRACK_URLS,
  VRACK_DASHBOARD_TRACKING_PREFIX,
  VRACK_ACTIONS_SUFFIX,
  ELIGIBLE_POLLING_INTERVAL,
  SUSPENDED,
};
