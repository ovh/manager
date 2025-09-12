export const COLD_ARCHIVE_GRID_DATA = {
  REGION: 'RBX-ARCHIVE',
  FEE_TYPES: {
    ARCHIVE: 'archive',
    RESTORE: 'restore',
    'ARCHIVE-FEES': 'archive-fees',
  },
  QUANTITY: {
    HOUR: 'Hour',
    UNIT: 'Unit',
  },
};

export const CLOUD_GEOLOCALISATION = {
  instance: {
    EU: ['SBG1', 'GRA1', 'GRA3', 'GRA5', 'SBG3', 'SBG5', 'WAW1', 'DE1', 'UK1'],
    CA: ['BHS1', 'BHS3'],
    APAC: ['SYD1', 'SGP1'],
  },
  user: {
    EU: [
      'CZ',
      'DE',
      'ES',
      'EU',
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
    ],
    CA: ['ASIA', 'AU', 'CA', 'QC', 'SG', 'WE', 'WS'],
  },
  ipfo: {
    EU: [
      'BE',
      'CZ',
      'DE',
      'ES',
      'FI',
      'FR',
      'IE',
      'IT',
      'LT',
      'NL',
      'PL',
      'PT',
      'UK',
    ],
    CA: ['CA', 'US'],
  },
};

export const CLOUD_UNIT_CONVERSION = {
  KILOBYTE_TO_BYTE: 1000,
  MEGABYTE_TO_BYTE: 1000000,
  GIGABYTE_TO_BYTE: 1000000000,
  GIBIBYTE_TO_BYTE: 1073741824,
};

export const COLD_ARCHIVE_FEE_TYPES = ['archive', 'restore', 'archive-fees'];

export const PRODUCTS = {
  KUBERNETES_LOAD_BALANCER: 'Kubernetes Load Balancer',
  OCTAVIA_LOAD_BALANCER: 'Load Balancer',
};

export const INSTANCE_PRICING_LINKS = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices',
};

export const PCI_FEATURES_FREE_LOCAL_ZONES_BANNER =
  'public-cloud:project:free-local-zones-banner';
export const PCI_FEATURES_BILLING_POST_PAID = 'billing:postPaid';
export const TRUSTED_ZONE = 'public-cloud:trusted-zone';

export enum ResourceType {
  REGISTRY = 'registry',
  LOADBALANCER = 'loadbalancer',
  AI_NOTEBOOK = 'ai-notebook',
  AI_SERVING_ENGINE = 'ai-serving-engine',
  AI_TRAINING = 'ai-training',
  AI_ENDPOINTS = 'ai-endpoints',
  DATABASES = 'databases',
  COLD_ARCHIVE = 'coldarchive',
  FLOATING_IP = 'floatingip',
  GATEWAY = 'gateway',
  OCTAVIA_LOADBALANCER = 'octavia-loadbalancer',
  AI_APP = 'ai-app',
  PUBLIC_IP = 'publicip',
  DATAPLATFORM = 'dataplatform',
  INSTANCE = 'instance',
  SNAPSHOT = 'snapshot',
  VOLUME = 'volume',
  OBJECT_STORAGE = 'objectStorage',
  ARCHIVE_STORAGE = 'archiveStorage',
  BANDWIDTH = 'bandwidth',
  RANCHER = 'rancher',
  MANAGED_KUBERNETES_SERVICE = 'managedKubernetesService',
  QUANTUM = 'quantum',
  TOTAL = 'total',
}

export const RESOURCE_DISPLAY_NAMES: Partial<Record<ResourceType, string>> = {
  [ResourceType.REGISTRY]: 'privateRegistry',
  [ResourceType.LOADBALANCER]: 'kubernetesLoadBalancer',
  [ResourceType.AI_NOTEBOOK]: 'notebooks',
  [ResourceType.AI_SERVING_ENGINE]: 'serving',
  [ResourceType.AI_TRAINING]: 'training',
  [ResourceType.AI_ENDPOINTS]: 'aiEndpoints',
  [ResourceType.DATABASES]: 'databases',
  [ResourceType.COLD_ARCHIVE]: 'coldArchive',
  [ResourceType.FLOATING_IP]: 'floatingIP',
  [ResourceType.GATEWAY]: 'gateway',
  [ResourceType.OCTAVIA_LOADBALANCER]: 'octaviaLoadBalancer',
  [ResourceType.AI_APP]: 'aiDeploy',
  [ResourceType.PUBLIC_IP]: 'publicIP',
  [ResourceType.DATAPLATFORM]: 'dataplatform',
};

export const getResourceDisplayKey = (resourceType: ResourceType): string =>
  RESOURCE_DISPLAY_NAMES[resourceType] || resourceType;

type DisplayNameValues = NonNullable<
  typeof RESOURCE_DISPLAY_NAMES[keyof typeof RESOURCE_DISPLAY_NAMES]
>;

export type ConsumptionKey = ResourceType | DisplayNameValues;
