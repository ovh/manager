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

/**
 * OVH services names as constants
 * @type {string}
 */
export const SERVICES_NAMES = {
  CP_SERVICE: 'cloudProject',
  DCLOUDDC_SERVICE: 'dedicatedCloudDatacenter',
  DCLOUD_SERVICE: 'dedicatedCloud',
  DC_SERVICE: 'dedicatedConnect',
  DEDICATED_SERVICE: 'dedicatedServer',
  DSI_SERVICE: 'dedicatedServerInterface',
  IPLB_SERVICE: 'ipLoadbalancing',
  IP_SERVICE: 'ip',
  LVRACK_SERVICE: 'legacyVrack',
  MBMDC_SERVICE: 'managedBareMetalDatacenter',
  MBM_SERVICE: 'managedBareMetal',
  OVHCC_SERVICE: 'ovhCloudConnect',
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
};

export const POLLING_INTERVAL = 500;

export const STATUS = {
  ok: 'ok',
  delivered: 'delivered',
};

export const VRACK_DASHBOARD_TRACKING_PREFIX = 'vrack::dashboard';
export const VRACK_ACTIONS_SUFFIX = 'action';

/**
 * groupes of services are used to display a sub list in the vrack available template
 * @type {string[]}
 */
export const GROUPED_SERVICES_TYPES = [
  SERVICES_NAMES.DCLOUDDC_SERVICE,
  SERVICES_NAMES.MBMDC_SERVICE,
  SERVICES_NAMES.DCLOUD_SERVICE,
  SERVICES_NAMES.MBM_SERVICE,
  SERVICES_NAMES.DSI_SERVICE,
];
/**
 * the services families are referenced in the vrack allowed services API
 * this map is the base object to gather the data from the backend in each family
 * https://api.ovh.com/console/#/vrack/%7BserviceName%7D/allowedServices~GET
 * @type {{legacyVrack: null, dedicatedCloudDatacenter: null, ovhCloudConnect: null, dedicatedCloud: null, dedicatedServer: null, ip: null, dedicatedConnect: null, dedicatedServerInterface: null, cloudProject: null, ipLoadbalancing: null}}
 */
export const SERVICE_FAMILIES_MAP_FETCH = {
  cloudProject: false,
  dedicatedCloud: false,
  dedicatedCloudDatacenter: false,
  dedicatedConnect: false,
  dedicatedServer: false,
  dedicatedServerInterface: false,
  ip: false,
  ipLoadbalancing: false,
  legacyVrack: false,
  ovhCloudConnect: false,
};
export const SERVICE_FAMILIES_MAP = {
  cloudProject: null,
  dedicatedCloud: null,
  dedicatedCloudDatacenter: null,
  dedicatedConnect: null,
  dedicatedServer: null,
  dedicatedServerInterface: null,
  ip: null,
  ipLoadbalancing: null,
  legacyVrack: null,
  ovhCloudConnect: null,
};
/**
 * only the keys of the service families map object
 * @type {string[]}
 */
export const SERVICE_FAMILIES_LIST = Object.keys(SERVICE_FAMILIES_MAP);

/**
 * maps a type of serviec to a set of OVH UI icons
 * @param serviceType
 * @returns {{"ovh-font ovh-font-ip": boolean, "ovh-font ovh-font-iplb": boolean, "ovh-font ovh-font-server": boolean, "ovh-font ovh-font-vRack": boolean, "ovh-font ovh-font-dedicatedCloud": boolean, "ovh-font ovh-font-network": boolean, "ovh-font ovh-font-public-cloud": boolean, "oui-icon oui-icon-cloud-essential_concept": boolean}}
 */
export function serviceIconClassMapper(serviceType) {
  return {
    'ovh-font ovh-font-dedicatedCloud':
      serviceType === SERVICES_NAMES.DCLOUD_SERVICE ||
      serviceType === SERVICES_NAMES.DCLOUDDC_SERVICE,
    'oui-icon oui-icon-cloud-essential_concept':
      serviceType === SERVICES_NAMES.MBM_SERVICE,
    'ovh-font ovh-font-public-cloud': serviceType === SERVICES_NAMES.CP_SERVICE,
    'ovh-font ovh-font-iplb': serviceType === SERVICES_NAMES.IPLB_SERVICE,
    'ovh-font ovh-font-ip': serviceType === SERVICES_NAMES.IP_SERVICE,
    'ovh-font ovh-font-server':
      serviceType === 'dedicatedServer' ||
      serviceType === SERVICES_NAMES.DSI_SERVICE,
    'ovh-font ovh-font-network': serviceType === SERVICES_NAMES.DC_SERVICE,
    'ovh-font ovh-font-vRack': serviceType === SERVICES_NAMES.LVRACK_SERVICE,
  };
}
export default {
  FEATURE_NAMES,
  POLLING_INTERVAL,
  STATUS,
  VRACK_URLS,
  SERVICE_FAMILIES_LIST,
  SERVICE_FAMILIES_MAP,
  SERVICE_FAMILIES_MAP_FETCH,
  GROUPED_SERVICES_TYPES,
  VRACK_DASHBOARD_TRACKING_PREFIX,
  VRACK_ACTIONS_SUFFIX,
  SERVICES_NAMES,
  serviceIconClassMapper,
};
