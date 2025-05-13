export const NSX_EDGE_FEATURE = 'dedicated-cloud:nsxEdge';
export const NSX_EDGE_RELOCATE_FEATURE = `${NSX_EDGE_FEATURE}:relocate`;

export const MIN_NSX_EDGES = 2;
export const MAX_NSX_EDGES = 10;

export const NETWORK_LABEL = 'NSX Edge Nodes';
export const NSX_COMPATIBLE_COMMERCIAL_RANGE = [
  'NSX',
  'NSX-T',
  'SDDC 2016',
  'SDDC 2018',
];

export const NSXT_EDGE_CATALOG = 'privateCloud';
export const NSXT_EDGE_CORE_PLAN_CODE = 'pcc-option-edge-nsxt-core';

export const DATACENTER_NETWORK_SITE_WEB_LINK = {
  FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/vmware/nsx/',
  EN: 'https://www.ovhcloud.com/en/hosted-private-cloud/vmware/nsx/',
  DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/vmware/nsx/',
  ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/vmware/nsx/',
  WS: 'https://www.ovhcloud.com/es/hosted-private-cloud/vmware/nsx/',
  IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/vmware/nsx/',
  IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/vmware/nsx/',
  NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/vmware/nsx/',
  PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/vmware/nsx/',
  PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/vmware/nsx/',
  GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/vmware/nsx/',
  CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/vmware/nsx/',
  QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/vmware/nsx/',
  US: 'https://us.ovhcloud.com/hosted-private-cloud/vmware/nsx/',
  MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/vmware/nsx/',
  SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/vmware/nsx/',
  TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/vmware/nsx/',
  AU: 'https://www.ovhcloud.com/en-au/hosted-private-cloud/vmware/nsx/',
  IN: 'https://www.ovhcloud.com/en-in/hosted-private-cloud/vmware/nsx/',
  SG: 'https://www.ovhcloud.com/en-sg/hosted-private-cloud/vmware/nsx/',
  VN: 'https://www.ovhcloud.com/asia/hosted-private-cloud/vmware/nsx/',
  ASIA: 'https://www.ovhcloud.com/asia/hosted-private-cloud/vmware/nsx/',
};

export default {
  MAX_NSX_EDGES,
  MIN_NSX_EDGES,
  NSX_COMPATIBLE_COMMERCIAL_RANGE,
  NETWORK_LABEL,
  NSXT_EDGE_CATALOG,
  DATACENTER_NETWORK_SITE_WEB_LINK,
  NSXT_EDGE_CORE_PLAN_CODE,
  NSX_EDGE_FEATURE,
  NSX_EDGE_RELOCATE_FEATURE,
};
